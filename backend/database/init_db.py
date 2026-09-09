

from backend.app import app, db, Product, Class

# -----------------------------
# Sample Products
# -----------------------------
products = [
    {"name": "DIY Craft Kit", "price": 499, "category": "Craft Kits", "image": "dcraft.jpg", "desc": "Everything you need for a fun DIY craft project."},
    {"name": "Knitting Needles", "price": 299, "category": "Knitting", "image": "./shopimg/niddle.jpg", "desc": "Durable stainless steel knitting needles."},
    {"name": "Sewing Machine", "price": 4999, "category": "Sewing", "image": "./shopimg/sewing.jpeg", "desc": "Compact and portable sewing machine."},
    {"name": "Acrylic Paint Set", "price": 699, "category": "Painting", "image": "./shopimg/paint.webp", "desc": "24 vibrant colors for your art projects."},
    {"name": "Quilting Fabric Bundle", "price": 899, "category": "Quilting", "image": "./shopimg/fabric.jpg", "desc": "High-quality fabric pieces for quilting."},
    {"name": "Jewellery Making Kit Necklace", "price": 299, "category": "Craft Kits", "image": "./shopimg/jwelaryjpg.jpg", "desc": "Jewellery Making Kits for Kids - colorful beads in different shapes and colors."},
    {"name": "SYGA 28 Pcs Baby Girls Hair Clip Set", "price": 199, "category": "Craft Kits", "image": "./shopimg/bow.jpg", "desc": "The clips are lightweight."},
    {"name": "QUAKEL Air Dry Clay Kit (12-Pack)", "price": 150, "category": "Craft Kits", "image": "./shopimg/cley.jpg", "desc": "Unleash creativity with this Air Dry Clay Kit."},
    {"name": "Craft Affair Macrame Thread Pack of Six", "price": 274, "category": "Sewing", "image": "./shopimg/microm_.jpg", "desc": "Organic Cotton Macrame thread (10 Meter, 3mm)."},
    {"name": "Flower Pot Paintings with Frame", "price": 99, "category": "Painting", "image": "./shopimg/painting.webp", "desc": "Set of 3 Panel Paintings Pasted on Thick MDF Board."},
    {"name": "Sadhusadhya Mirror Kit Craft Work", "price": 104, "category": "Craft Kits", "image": "./shopimg/mirror.webp", "desc": "Mirrors make a huge impact on various crafts."},
    {"name": "Shivom Knitting Crochet Kit", "price": 199, "category": "Knitting", "image": "./shopimg/crochet.jpg", "desc": "Knitting Crochet Kit (Large)."},
    {"name": "Extra Quilting Fabric Bundle", "price": 899, "category": "Quilting", "image": "./shopimg/fabric.jpg", "desc": "High-quality fabric pieces for quilting."}
]

# -----------------------------
# Sample Classes
# -----------------------------
classes = [
    {"name": "DIY Craft Workshop", "category": "Craft Kits", "level": "Beginner", "image": "images/craft.jpg", "desc": "Learn handmade crafts, decorations, and DIY projects."},
    {"name": "Painting & Drawing", "category": "Painting", "level": "Intermediate", "image": "images/art.jpg", "desc": "Explore painting techniques and express your creativity."},
    {"name": "Creative Quilting Techniques", "category": "Quilting", "level": "Advanced", "image": "images/scrapjpg.jpg", "desc": "Learn String Quilts, Crazy Quilts, Foundation Paper Piecing & more."},
    {"name": "Lunchbox Cookies", "category": "Baking", "level": "Beginner", "image": "images/cookies.jpg", "desc": "A fun cookie-making class for all skill levels."},
    {"name": "Seamless Crochet Techniques", "category": "Knitting", "level": "Intermediate", "image": "images/crochet.webp", "desc": "Join-as-you-go crochet methods taught step by step."},
    {"name": "Interactive Cards Class", "category": "Paper Craft", "level": "Beginner", "image": "images/card.webp", "desc": "Learn 10 interactive cards with different mechanisms."},
    {"name": "Mandala Freehand Drawing", "category": "Art", "level": "Beginner", "image": "images/mandalajpg.jpg", "desc": "Relax and design your own mandala step by step."},
    {"name": "Leather & Vinyl Sewing", "category": "Sewing", "level": "Intermediate", "image": "images/sewing.jpg", "desc": "Learn the art of sewing with leather and vinyl."},
    {"name": "Hand Embroidery", "category": "Embroidery", "level": "Beginner", "image": "images/embroidery.jpg", "desc": "Master 19 embroidery stitches and create stunning designs."},
    {"name": "Cake Baking & Frosting", "category": "Baking", "level": "Beginner", "image": "images/cakejpg.jpg", "desc": "Bake delicious cakes with creative flavors and fillings."},
    {"name": "Cookie Decorating", "category": "Baking", "level": "Intermediate", "image": "images/cookie.jpg", "desc": "Learn seasonal cookie decoration techniques."},
    {"name": "Handcrafted Candy Making", "category": "Baking", "level": "Advanced", "image": "images/candywebp.webp", "desc": "Master handcrafted candy recipes with sugar techniques."}
]

# -----------------------------
# Seeding Function
# -----------------------------
def seed_database():
    with db.session.begin():
        if Product.query.count() == 0:
            for p in products:
                db.session.add(Product(**p))

        if Class.query.count() == 0:
            for c in classes:
                db.session.add(Class(**c))

    print("✅ Database seeded successfully!")

class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)    

# -----------------------------
# Main
# -----------------------------
if __name__ == "__main__":
    with app.app_context():   # ✅ FIX: add application context
        db.create_all()
        seed_database()
