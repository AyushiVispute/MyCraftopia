from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
from werkzeug.security import generate_password_hash, check_password_hash
import os

# -----------------------------
# App & Config
# -----------------------------
app = Flask(__name__)
app.secret_key = "your_secret_key"  # required for session & flash

# Database
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{os.path.join(BASE_DIR, 'classes.db')}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

# Mail Config (✅ set your credentials here)
app.config["MAIL_SERVER"] = "smtp.gmail.com"
app.config["MAIL_PORT"] = 587
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USERNAME"] = "your_email@gmail.com"       # replace with your email
app.config["MAIL_PASSWORD"] = "your_app_password"          # replace with app password
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
    password = db.Column(db.String(200), nullable=False)  # store hashed password


# -----------------------------
# Routes
# -----------------------------
@app.route("/")
def home():
    products = Product.query.limit(6).all()  # show few products on homepage
    return render_template("home.html", products=products)


@app.route("/classes")
def classes():
    """List all classes with optional filters"""
    search = request.args.get("search")
    level = request.args.get("level")
    category = request.args.get("category")

    query = Class.query
    if search:
        query = query.filter(Class.name.ilike(f"%{search}%"))
    if level:
        query = query.filter(Class.level.ilike(level))
    if category:
        query = query.filter(Class.category.ilike(category))

    classes = query.all()
    return render_template("classes.html", classes=classes)


@app.route("/class/<int:class_id>")
def class_detail(class_id):
    """Detailed view of a class"""
    class_item = Class.query.get_or_404(class_id)
    return render_template("class_detail.html", class_item=class_item)


@app.route("/shop")
@app.route("/shop/<category>")
def shop(category=None):
    """Shop for products"""
    query = Product.query
    if category:
        query = query.filter_by(category=category)
    products = query.all()
    return render_template("shop.html", products=products, category=category)


@app.route("/mycard")
def mycard():
    """Shopping cart page"""
    cart = session.get("cart", {})
    total = sum(item["price"] * item["quantity"] for item in cart.values())
    return render_template("mycard.html", cart=cart, total=total)


@app.route("/add-to-cart/<int:product_id>")
def add_to_cart(product_id):
    """Add product to cart"""
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
            "quantity": 1,
        }

    session["cart"] = cart
    return redirect(url_for("mycard"))


@app.route("/update-cart/<int:product_id>", methods=["POST"])
def update_cart(product_id):
    """Update quantity of product in cart"""
    cart = session.get("cart", {})
    if str(product_id) in cart:
        quantity = int(request.form.get("quantity", 1))
        if quantity <= 0:
            cart.pop(str(product_id))  # remove item if qty = 0
        else:
            cart[str(product_id)]["quantity"] = quantity
        session["cart"] = cart
    return redirect(url_for("mycard"))


@app.route("/remove-from-cart/<int:product_id>")
def remove_from_cart(product_id):
    """Remove item from cart"""
    cart = session.get("cart", {})
    if str(product_id) in cart:
        cart.pop(str(product_id))
        session["cart"] = cart
    return redirect(url_for("mycard"))


@app.route("/clear-cart")
def clear_cart():
    """Clear the whole cart"""
    session.pop("cart", None)
    return redirect(url_for("mycard"))


@app.route("/login", methods=["GET", "POST"])
def login():
    """User login"""
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]

        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password, password):
            flash("Login successful!", "success")
            return redirect(url_for("home"))
        else:
            flash("Invalid email or password", "danger")

    return render_template("login.html")


@app.route("/signup", methods=["GET", "POST"])
def signup():
    """User signup"""
    if request.method == "POST":
        name = request.form["name"]
        email = request.form["email"]
        password = request.form["password"]
        confirm_password = request.form["confirm_password"]

        if password != confirm_password:
            flash("Passwords do not match!", "danger")
            return redirect(url_for("signup"))

        # check if email already exists
        if User.query.filter_by(email=email).first():
            flash("Email already registered!", "danger")
            return redirect(url_for("signup"))

        # hash password before saving
        hashed_pw = generate_password_hash(password)
        new_user = User(name=name, email=email, password=hashed_pw)
        db.session.add(new_user)
        db.session.commit()

        flash("Signup successful! Please login.", "success")
        return redirect(url_for("login"))

    return render_template("signup.html")


@app.route("/contact", methods=["GET", "POST"])
def contact():
    """Contact form (sends email)"""
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        subject = request.form.get("subject")
        message = request.form.get("message")

        msg = Message(
            subject=f"New Contact: {subject}",
            recipients=["your_email@gmail.com"],  # your email
        )
        msg.body = f"From: {name} ({email})\n\n{message}"
        mail.send(msg)

        flash("✅ Your message has been sent successfully!", "success")
        return redirect(url_for("contact"))

    return render_template("contact.html")


@app.route("/about")
def about():
    return render_template("about.html")


# -----------------------------
# Run App
# -----------------------------
if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # ensure tables exist
    app.run(debug=True)
