from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from functools import wraps
from flask_mail import Mail, Message
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv

load_dotenv()
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)
# -----------------------------
# App & Config
# -----------------------------
app = Flask(__name__)

# ==========================================
# SECRET KEY
# ==========================================
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY environment variable is required.")
app.secret_key = SECRET_KEY

# ==========================================
# SESSION CONFIGURATION
# ==========================================
app.config["SESSION_COOKIE_NAME"] = "mycraftopia_session"
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
app.config["SESSION_COOKIE_SECURE"] = (
    os.getenv("FLASK_ENV", "").lower() == "production"
)

# ==========================================
# FRONTEND URL
# ==========================================
allowed_origin = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173"
)

# ==========================================
# CORS
# ==========================================
CORS(
    app,
    resources={
        r"/api/*": {
            "origins": allowed_origin
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
    image = db.Column(db.Text)
    desc = db.Column(db.Text)


class Class(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    level = db.Column(db.String(50), nullable=False)
    image = db.Column(db.Text)
    desc = db.Column(db.Text)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    is_admin = db.Column(db.Boolean, default=False, nullable=False) 


class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("user.id"),
        nullable=False
    )

    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)  # NEW
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
    

def admin_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        user_id = session.get("user_id")
        if not user_id:
            return jsonify({"error": "Please login."}), 401

        user = db.session.get(User, user_id)
        if not user or not user.is_admin:
            return jsonify({"error": "Admin access required."}), 403

        return f(*args, **kwargs)
    return wrapper
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
    email = customer.get("email", "").strip().lower()
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
        email,
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

        # Validate every product from database
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

            product = db.session.get(Product, product_id)

            if not product:
                return jsonify({
                    "error": f"Product {product_id} not found."
                }), 404

            # Price comes from database
            item_total = float(product.price) * quantity
            total_amount += item_total

            order_items.append({
                "product": product,
                "quantity": quantity
            })

        # Create Order
        order = Order(
            user_id=user_id,
            name=name,
            email=email,
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

        # Generate order ID
        db.session.flush()

        # Create Order Items
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

        # Save everything
        db.session.commit()

        # Send order confirmation email
        try:
            msg = Message(
                subject=f"MyCraftopia Order Confirmation - #{order.id}",
                sender=app.config["MAIL_USERNAME"],
                recipients=[order.email]
            )

            msg.body = f"""
Hello {order.name},

Thank you for your order from MyCraftopia! 🎨

Your order has been successfully placed.

Order ID: #{order.id}
Total Amount: ₹{order.total_amount:.2f}
Payment Method: {order.payment_method}
Order Status: {order.status}

Delivery Address:
{order.address}
{order.city}, {order.state} - {order.pincode}

We will process your order and keep you updated about its status.

Thank you for shopping with MyCraftopia! ❤️

Best regards,
MyCraftopia Team
"""

            mail.send(msg)

        except Exception as email_error:
            print("Email sending failed:", email_error)

        # Return successful order response
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
    

# =========================================================
# GET PRODUCTS
# =========================================================

@app.route("/api/products", methods=["GET"])
def get_products():

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


# =========================================================
# ADD PRODUCT - ADMIN ONLY
# =========================================================

@app.route("/api/products", methods=["POST"])
@admin_required
def create_product():

    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "No product data received."
            }), 400

        name = data.get("name", "").strip()
        price = data.get("price")
        category = data.get("category", "").strip()
        image = data.get("image", "").strip()
        desc = data.get("desc", "").strip()

        # -----------------------------
        # Validate fields
        # -----------------------------

        if not name:
            return jsonify({
                "success": False,
                "message": "Product name is required."
            }), 400

        if price is None or price == "":
            return jsonify({
                "success": False,
                "message": "Product price is required."
            }), 400

        if not category:
            return jsonify({
                "success": False,
                "message": "Product category is required."
            }), 400

        if not image:
            return jsonify({
                "success": False,
                "message": "Please upload a product image."
            }),400

        # -----------------------------
        # Convert price
        # -----------------------------

        try:
            price = float(price)
        except (ValueError, TypeError):

            return jsonify({
                "success": False,
                "message": "Invalid product price."
            }), 400

        # -----------------------------
        # Create product
        # -----------------------------

        product = Product(
            name=name,
            price=price,
            category=category,
            image=image,
            desc=desc
        )

        db.session.add(product)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Product added successfully.",
            "product": {
                "id": product.id,
                "name": product.name,
                "price": product.price,
                "category": product.category,
                "image": product.image,
                "desc": product.desc
            }
        }), 201

    except Exception as e:

        db.session.rollback()

        print("CREATE PRODUCT ERROR:", str(e))

        return jsonify({
            "success": False,
            "message": "Failed to add product.",
            "error": str(e)
        }), 500


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
        "email": user.email,
        "is_admin": user.is_admin
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
        }), 200

    user = db.session.get(User, user_id)

    if not user:
        session.clear()

        return jsonify({
            "logged_in": False
        }), 200

    return jsonify({
        "logged_in": True,
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "is_admin": bool(user.is_admin)
    }), 200


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

@app.route("/api/upload-image", methods=["POST"])
def upload_image():
    try:
        # Check whether an image was sent
        if "image" not in request.files:
            return jsonify({
                "success": False,
                "message": "Please upload a product image."
            }), 400

        image = request.files["image"]

        # Check filename
        if image.filename == "":
            return jsonify({
                "success": False,
                "message": "Please select an image."
            }), 400

        # Upload image to Cloudinary
        result = cloudinary.uploader.upload(
            image,
            folder="mycraftopia/products"
        )

        image_url = result.get("secure_url")

        if not image_url:
            return jsonify({
                "success": False,
                "message": "Image upload failed."
            }), 500

        return jsonify({
            "success": True,
            "message": "Image uploaded successfully.",
            "url": image_url
        }), 200

    except Exception as e:
        print("IMAGE UPLOAD ERROR:", str(e))

        return jsonify({
            "success": False,
            "message": "Failed to upload image.",
            "error": str(e)
        }), 500


@app.route("/api/products/<int:product_id>", methods=["PUT"])
@admin_required
def update_product(product_id):
    product = db.session.get(Product, product_id)
    if not product:
        return jsonify({"error": "Product not found."}), 404

    data = request.get_json() or {}

    if "name" in data: product.name = data["name"].strip()
    if "category" in data: product.category = data["category"].strip()
    if "image" in data: product.image = data["image"].strip()
    if "desc" in data: product.desc = data["desc"].strip()
    if "price" in data:
        try:
            product.price = float(data["price"])
        except (TypeError, ValueError):
            return jsonify({"error": "price must be a number."}), 400

    db.session.commit()
    return jsonify({
        "id": product.id, "name": product.name, "price": product.price,
        "category": product.category, "image": product.image, "desc": product.desc
    })


@app.route("/api/products/<int:product_id>", methods=["DELETE"])
@admin_required
def delete_product(product_id):
    product = db.session.get(Product, product_id)
    if not product:
        return jsonify({"error": "Product not found."}), 404

    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "Product deleted."})


# -----------------------------
# Class CRUD (admin only)
# -----------------------------
@app.route("/api/classes", methods=["POST"])
@admin_required
def create_class():
    data = request.get_json() or {}
    name = data.get("name", "").strip()
    category = data.get("category", "").strip()
    level = data.get("level", "").strip()

    if not name or not category or not level:
        return jsonify({"error": "name, category, and level are required."}), 400

    class_item = Class(
        name=name,
        category=category,
        level=level,
        image=data.get("image", "").strip(),
        desc=data.get("desc", "").strip()
    )
    db.session.add(class_item)
    db.session.commit()

    return jsonify({
        "id": class_item.id, "name": class_item.name, "category": class_item.category,
        "level": class_item.level, "image": class_item.image, "desc": class_item.desc
    }), 201


@app.route("/api/classes/<int:class_id>", methods=["PUT"])
@admin_required
def update_class(class_id):
    class_item = db.session.get(Class, class_id)
    if not class_item:
        return jsonify({"error": "Class not found."}), 404

    data = request.get_json() or {}
    if "name" in data: class_item.name = data["name"].strip()
    if "category" in data: class_item.category = data["category"].strip()
    if "level" in data: class_item.level = data["level"].strip()
    if "image" in data: class_item.image = data["image"].strip()
    if "desc" in data: class_item.desc = data["desc"].strip()

    db.session.commit()
    return jsonify({
        "id": class_item.id, "name": class_item.name, "category": class_item.category,
        "level": class_item.level, "image": class_item.image, "desc": class_item.desc
    })


@app.route("/api/classes/<int:class_id>", methods=["DELETE"])
@admin_required
def delete_class(class_id):
    class_item = db.session.get(Class, class_id)
    if not class_item:
        return jsonify({"error": "Class not found."}), 404

    db.session.delete(class_item)
    db.session.commit()
    return jsonify({"message": "Class deleted."})


# -----------------------------
# Admin: view & update orders
# -----------------------------
@app.route("/api/admin/orders", methods=["GET"])
@admin_required
def admin_get_orders():
    orders = Order.query.order_by(Order.id.desc()).all()

    result = [{
        "id": o.id, "name": o.name, "phone": o.phone,
        "total_amount": o.total_amount, "status": o.status,
        "payment_method": o.payment_method,
        "items": [
            {"product_name": i.product_name, "quantity": i.quantity, "price": i.price}
            for i in o.items
        ]
    } for o in orders]

    return jsonify(result)


@app.route("/api/admin/orders/<int:order_id>/status", methods=["PUT"])
@admin_required
def update_order_status(order_id):
    order = db.session.get(Order, order_id)
    if not order:
        return jsonify({"error": "Order not found."}), 404

    data = request.get_json() or {}
    status = data.get("status")
    valid_statuses = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"]

    if status not in valid_statuses:
        return jsonify({"error": f"status must be one of {valid_statuses}"}), 400

    order.status = status
    db.session.commit()
    return jsonify({"message": "Order status updated.", "status": order.status})

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
        debug=os.getenv("FLASK_ENV", "").lower() != "production",
        port=int(os.getenv("PORT", 5000))
    )