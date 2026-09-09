from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
import os

# -----------------------------
# App & Config
# -----------------------------
app = Flask(__name__)

app.secret_key = os.getenv("SECRET_KEY", "your_secret_key")

# Allow React frontend to communicate with Flask
CORS(
    app,
    resources={
        r"/api/*": {
            "origins": "http://localhost:5173"
        }
    },
    supports_credentials=True
)

# -----------------------------
# Database
# -----------------------------
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

app.config["SQLALCHEMY_DATABASE_URI"] = (
    f"sqlite:///{os.path.join(BASE_DIR, 'instance', 'classes.db')}"
)

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# -----------------------------
# Mail Config
# -----------------------------
app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME")
app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD")

mail = Mail(app)


# -----------------------------
# Models
# -----------------------------
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    price = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(100), nullable=False)
    image = db.Column(db.String(200))
    desc = db.Column(db.Text)


class Class(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    level = db.Column(db.String(50), nullable=False)
    image = db.Column(db.String(200))
    desc = db.Column(db.Text)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("user.id"),
        nullable=False
    )

    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    address = db.Column(db.Text, nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    pincode = db.Column(db.String(10), nullable=False)

    payment_method = db.Column(
        db.String(50),
        nullable=False
    )

    total_amount = db.Column(
        db.Float,
        nullable=False
    )

    status = db.Column(
        db.String(50),
        default="Pending"
    )

    items = db.relationship(
        "OrderItem",
        backref="order",
        cascade="all, delete-orphan"
    )


class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    order_id = db.Column(
        db.Integer,
        db.ForeignKey("order.id"),
        nullable=False
    )

    product_id = db.Column(
        db.Integer,
        db.ForeignKey("product.id"),
        nullable=False
    )

    product_name = db.Column(
        db.String(200),
        nullable=False
    )

    price = db.Column(
        db.Float,
        nullable=False
    )

    quantity = db.Column(
        db.Integer,
        nullable=False
    )
# ============================================================
# API ROUTES
# ============================================================

# -----------------------------
# Products API
# -----------------------------
@app.route("/api/orders", methods=["POST"])
def create_order():
    # User must be logged in
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({
            "error": "Please login before placing an order."
        }), 401

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Invalid order data."
        }), 400

    # Delivery information
    customer = data.get("customer", {})

    name = customer.get("name", "").strip()
    phone = customer.get("phone", "").strip()
    address = customer.get("address", "").strip()
    city = customer.get("city", "").strip()
    state = customer.get("state", "").strip()
    pincode = customer.get("pincode", "").strip()

    # Payment method
    payment_method = data.get(
        "paymentMethod",
        "Cash on Delivery"
    )

    # Cart items
    items = data.get("items", [])

    # Validate delivery information
    if not all([
        name,
        phone,
        address,
        city,
        state,
        pincode
    ]):
        return jsonify({
            "error": "All delivery details are required."
        }), 400

    # Validate cart
    if not items:
        return jsonify({
            "error": "Your cart is empty."
        }), 400

    try:
        total_amount = 0

        order_items = []

        # ------------------------------------------
        # Validate every product from database
        # ------------------------------------------

        for item in items:

            product_id = item.get("id")
            quantity = item.get("quantity", 0)

            try:
                product_id = int(product_id)
                quantity = int(quantity)
            except (TypeError, ValueError):
                return jsonify({
                    "error": "Invalid product or quantity."
                }), 400

            if quantity <= 0:
                return jsonify({
                    "error": "Product quantity must be greater than zero."
                }), 400

            product = db.session.get(
                Product,
                product_id
            )

            if not product:
                return jsonify({
                    "error": f"Product {product_id} not found."
                }), 404

            # IMPORTANT:
            # Price comes from database,
            # not from frontend.
            item_total = (
                float(product.price) * quantity
            )

            total_amount += item_total

            order_items.append({
                "product": product,
                "quantity": quantity
            })

        # ------------------------------------------
        # Create Order
        # ------------------------------------------

        order = Order(
            user_id=user_id,
            name=name,
            phone=phone,
            address=address,
            city=city,
            state=state,
            pincode=pincode,
            payment_method=payment_method,
            total_amount=total_amount,
            status="Pending"
        )

        db.session.add(order)

        # Save first so order.id is generated
        db.session.flush()

        # ------------------------------------------
        # Create Order Items
        # ------------------------------------------

        for item in order_items:

            product = item["product"]
            quantity = item["quantity"]

            order_item = OrderItem(
                order_id=order.id,
                product_id=product.id,
                product_name=product.name,
                price=float(product.price),
                quantity=quantity
            )

            db.session.add(order_item)

        # ------------------------------------------
        # Save everything
        # ------------------------------------------

        db.session.commit()

        return jsonify({
            "message": "Order placed successfully.",
            "order": {
                "id": order.id,
                "user_id": order.user_id,
                "total_amount": order.total_amount,
                "payment_method": order.payment_method,
                "status": order.status
            }
        }), 201

    except Exception as e:

        db.session.rollback()

        print("Order creation error:", e)

        return jsonify({
            "error": "Unable to place order."
        }), 500
def api_products():

    category = request.args.get("category")

    query = Product.query

    if category:
        query = query.filter(Product.category.ilike(category))

    products = query.all()

    return jsonify([
        {
            "id": product.id,
            "name": product.name,
            "price": product.price,
            "category": product.category,
            "image": product.image,
            "desc": product.desc
        }
        for product in products
    ])


# -----------------------------
# Single Product API
# -----------------------------
@app.route("/api/products/<int:product_id>", methods=["GET"])
def api_product_detail(product_id):

    product = Product.query.get_or_404(product_id)

    return jsonify({
        "id": product.id,
        "name": product.name,
        "price": product.price,
        "category": product.category,
        "image": product.image,
        "desc": product.desc
    })


# -----------------------------
# Classes API
# -----------------------------
@app.route("/api/classes", methods=["GET"])
def api_classes():

    search = request.args.get("search")
    level = request.args.get("level")
    category = request.args.get("category")

    query = Class.query

    if search:
        query = query.filter(
            Class.name.ilike(f"%{search}%")
        )

    if level:
        query = query.filter(
            Class.level.ilike(level)
        )

    if category:
        query = query.filter(
            Class.category.ilike(category)
        )

    classes = query.all()

    return jsonify([
        {
            "id": item.id,
            "name": item.name,
            "category": item.category,
            "level": item.level,
            "image": item.image,
            "desc": item.desc
        }
        for item in classes
    ])


# -----------------------------
# Single Class API
# -----------------------------
@app.route("/api/classes/<int:class_id>", methods=["GET"])
def api_class_detail(class_id):

    class_item = Class.query.get_or_404(class_id)

    return jsonify({
        "id": class_item.id,
        "name": class_item.name,
        "category": class_item.category,
        "level": class_item.level,
        "image": class_item.image,
        "desc": class_item.desc
    })


# -----------------------------
# Signup API
# -----------------------------
@app.route("/api/signup", methods=["POST"])
def api_signup():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "No data received"
        }), 400

    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    confirm_password = data.get("confirmPassword", "")

    # Required fields
    if not name or not email or not password or not confirm_password:
        return jsonify({
            "success": False,
            "message": "All fields are required"
        }), 400

    # Password confirmation
    if password != confirm_password:
        return jsonify({
            "success": False,
            "message": "Passwords do not match"
        }), 400

    # Password length
    if len(password) < 6:
        return jsonify({
            "success": False,
            "message": "Password must be at least 6 characters"
        }), 400

    # Check existing email
    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return jsonify({
            "success": False,
            "message": "Email already registered"
        }), 409

    # Hash password
    hashed_password = generate_password_hash(password)

    new_user = User(
        name=name,
        email=email,
        password=hashed_password
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Signup successful"
    }), 201
   
# Login API
# -----------------------------
@app.route("/api/login", methods=["POST"])
def api_login():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "No data received"
        }), 400

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({
            "success": False,
            "message": "Invalid email or password"
        }), 401

    session["user_id"] = user.id
    session["user_name"] = user.name

    return jsonify({
        "success": True,
        "message": "Login successful",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    })


# -----------------------------
# Current User API
# -----------------------------
@app.route("/api/me", methods=["GET"])
def api_me():

    user_id = session.get("user_id")

    if not user_id:
        return jsonify({
            "logged_in": False
        })

    user = User.query.get(user_id)

    if not user:
        session.clear()

        return jsonify({
            "logged_in": False
        })

    return jsonify({
        "logged_in": True,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    })


# -----------------------------
# Logout API
# -----------------------------
@app.route("/api/logout", methods=["POST"])
def api_logout():

    session.clear()

    return jsonify({
        "success": True,
        "message": "Logged out successfully"
    })


# -----------------------------
# Contact API
# -----------------------------
@app.route("/api/contact", methods=["POST"])
def api_contact():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "No data received"
        }), 400

    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    subject = data.get("subject", "").strip()
    message = data.get("message", "").strip()

    if not name or not email or not subject or not message:
        return jsonify({
            "success": False,
            "message": "All fields are required"
        }), 400

    # Email sending will work when MAIL_USERNAME
    # and MAIL_PASSWORD are configured in .env
    if app.config["MAIL_USERNAME"] and app.config["MAIL_PASSWORD"]:

        msg = Message(
            subject=f"MyCraftopia Contact: {subject}",
            sender=app.config["MAIL_USERNAME"],
            recipients=[app.config["MAIL_USERNAME"]]
        )

        msg.body = (
            f"Name: {name}\n"
            f"Email: {email}\n\n"
            f"Message:\n{message}"
        )

        mail.send(msg)

    return jsonify({
        "success": True,
        "message": "Your message has been sent successfully"
    })


# ============================================================
# OLD FLASK/JINJA ROUTES
# ============================================================

@app.route("/")
def home():

    products = Product.query.limit(6).all()

    return render_template(
        "home.html",
        products=products
    )


@app.route("/classes")
def classes():

    search = request.args.get("search")
    level = request.args.get("level")
    category = request.args.get("category")

    query = Class.query

    if search:
        query = query.filter(
            Class.name.ilike(f"%{search}%")
        )

    if level:
        query = query.filter(
            Class.level.ilike(level)
        )

    if category:
        query = query.filter(
            Class.category.ilike(category)
        )

    classes = query.all()

    return render_template(
        "classes.html",
        classes=classes
    )


@app.route("/class/<int:class_id>")
def class_detail(class_id):

    class_item = Class.query.get_or_404(class_id)

    return render_template(
        "class_detail.html",
        class_item=class_item
    )


@app.route("/shop")
@app.route("/shop/<category>")
def shop(category=None):

    query = Product.query

    if category:
        query = query.filter_by(
            category=category
        )

    products = query.all()

    return render_template(
        "shop.html",
        products=products,
        category=category
    )


@app.route("/mycard")
def mycard():

    cart = session.get("cart", {})

    total = sum(
        item["price"] * item["quantity"]
        for item in cart.values()
    )

    return render_template(
        "mycard.html",
        cart=cart,
        total=total
    )
    


@app.route("/add-to-cart/<int:product_id>")
def add_to_cart(product_id):

    product = Product.query.get_or_404(product_id)

    cart = session.get("cart", {})

    if str(product_id) in cart:

        cart[str(product_id)]["quantity"] += 1

    else:

        cart[str(product_id)] = {
            "id": product.id,
            "name": product.name,
            "price": product.price,
            "image": product.image,
            "quantity": 1
        }

    session["cart"] = cart

    return redirect(url_for("mycard"))


@app.route("/update-cart/<int:product_id>", methods=["POST"])
def update_cart(product_id):

    cart = session.get("cart", {})

    if str(product_id) in cart:

        quantity = int(
            request.form.get("quantity", 1)
        )

        if quantity <= 0:
            cart.pop(str(product_id))
        else:
            cart[str(product_id)]["quantity"] = quantity

        session["cart"] = cart

    return redirect(url_for("mycard"))


@app.route("/remove-from-cart/<int:product_id>")
def remove_from_cart(product_id):

    cart = session.get("cart", {})

    if str(product_id) in cart:
        cart.pop(str(product_id))
        session["cart"] = cart

    return redirect(url_for("mycard"))


@app.route("/clear-cart")
def clear_cart():

    session.pop("cart", None)

    return redirect(url_for("mycard"))

# -----------------------------
# My Orders API
# -----------------------------
@app.route("/api/orders", methods=["GET"])
def get_my_orders():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({
            "error": "Please login to view your orders."
        }), 401

    try:
        orders = (
            Order.query
            .filter_by(user_id=user_id)
            .order_by(Order.id.desc())
            .all()
        )

        result = []

        for order in orders:
            result.append({
                "id": order.id,
                "name": order.name,
                "phone": order.phone,
                "address": order.address,
                "city": order.city,
                "state": order.state,
                "pincode": order.pincode,
                "payment_method": order.payment_method,
                "total_amount": order.total_amount,
                "status": order.status,
                "items": [
                    {
                        "id": item.id,
                        "product_id": item.product_id,
                        "product_name": item.product_name,
                        "price": item.price,
                        "quantity": item.quantity
                    }
                    for item in order.items
                ]
            })

        return jsonify(result), 200

    except Exception as e:
        print("My orders error:", e)

        return jsonify({
            "error": "Unable to load orders."
        }), 500
@app.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":

        email = request.form["email"]
        password = request.form["password"]

        user = User.query.filter_by(
            email=email
        ).first()

        if user and check_password_hash(
            user.password,
            password
        ):

            session["user_id"] = user.id
            session["user_name"] = user.name

            flash(
                "Login successful!",
                "success"
            )

            return redirect(url_for("home"))

        flash(
            "Invalid email or password",
            "danger"
        )

    return render_template("login.html")



@app.route("/signup", methods=["GET", "POST"])
def signup():

    if request.method == "POST":

        name = request.form["name"]
        email = request.form["email"]
        password = request.form["password"]
        confirm_password = request.form["confirm_password"]

        if password != confirm_password:

            flash(
                "Passwords do not match!",
                "danger"
            )

            return redirect(
                url_for("signup")
            )

        if User.query.filter_by(
            email=email
        ).first():

            flash(
                "Email already registered!",
                "danger"
            )

            return redirect(
                url_for("signup")
            )

        hashed_pw = generate_password_hash(
            password
        )

        new_user = User(
            name=name,
            email=email,
            password=hashed_pw
        )

        db.session.add(new_user)
        db.session.commit()

        flash(
            "Signup successful! Please login.",
            "success"
        )

        return redirect(
            url_for("login")
        )

    return render_template("signup.html")


@app.route("/contact", methods=["GET", "POST"])
def contact():

    if request.method == "POST":

        name = request.form.get("name")
        email = request.form.get("email")
        subject = request.form.get("subject")
        message = request.form.get("message")

        if app.config["MAIL_USERNAME"] and app.config["MAIL_PASSWORD"]:

            msg = Message(
                subject=f"New Contact: {subject}",
                sender=app.config["MAIL_USERNAME"],
                recipients=[app.config["MAIL_USERNAME"]]
            )

            msg.body = (
                f"From: {name} ({email})\n\n"
                f"{message}"
            )

            mail.send(msg)

        flash(
            "Your message has been sent successfully!",
            "success"
        )

        return redirect(
            url_for("contact")
        )

    return render_template("contact.html")


@app.route("/about")
def about():

    return render_template("about.html")


# -----------------------------
# Run App
# -----------------------------
if __name__ == "__main__":

    with app.app_context():
        db.create_all()

    app.run(
        debug=True,
        port=5000
    )