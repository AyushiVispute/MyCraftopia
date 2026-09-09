import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryFromUrl = searchParams.get("category") || "";

  const [category, setCategory] = useState(categoryFromUrl);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { addToCart } = useCart();

  // Fetch products from Flask API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          "http://localhost:5000/api/products"
        );

        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Add to Cart Animation
  const animateToCart = (event, product) => {
    event.preventDefault();
    event.stopPropagation();

    const productCard =
      event.currentTarget.closest(".product-card");

    const image =
      productCard?.querySelector(".product-image");

    const cartIcon =
      document.getElementById("cart-icon");

    if (!image || !cartIcon) {
      addToCart(product);
      return;
    }

    const imageRect = image.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    const flyingImage = image.cloneNode(true);

    flyingImage.style.position = "fixed";
    flyingImage.style.left = `${imageRect.left}px`;
    flyingImage.style.top = `${imageRect.top}px`;
    flyingImage.style.width = `${imageRect.width}px`;
    flyingImage.style.height = `${imageRect.height}px`;
    flyingImage.style.objectFit = "cover";
    flyingImage.style.borderRadius = "12px";
    flyingImage.style.zIndex = "9999";
    flyingImage.style.pointerEvents = "none";
    flyingImage.style.transition =
      "all 0.8s cubic-bezier(0.65, 0, 0.35, 1)";

    document.body.appendChild(flyingImage);

    requestAnimationFrame(() => {
      flyingImage.style.left =
        `${cartRect.left + cartRect.width / 2 - 15}px`;

      flyingImage.style.top =
        `${cartRect.top + cartRect.height / 2 - 15}px`;

      flyingImage.style.width = "30px";
      flyingImage.style.height = "30px";
      flyingImage.style.opacity = "0";
      flyingImage.style.transform = "rotate(360deg)";
    });

    setTimeout(() => {
      flyingImage.remove();

      addToCart(product);

      cartIcon.classList.add("cart-bounce");

      setTimeout(() => {
        cartIcon.classList.remove("cart-bounce");
      }, 500);
    }, 800);
  };

  // Categories
  const categories = [
    "Craft Kits",
    "Knitting",
    "Sewing",
    "Painting",
    "Quilting",
  ];

  // Filter Products
  const filteredProducts = useMemo(() => {
    if (!category) {
      return products;
    }

    return products.filter(
      (product) => product.category === category
    );
  }, [category, products]);

  // Category Change
  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);

    if (selectedCategory) {
      setSearchParams({
        category: selectedCategory,
      });
    } else {
      setSearchParams({});
    }
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-6">

        {/* Categories Navigation */}
        <div className="flex flex-wrap justify-center gap-6 mb-10">

          <button
            onClick={() => handleCategoryChange("")}
            className="text-gray-700 hover:text-pink-500 font-semibold"
          >
            All Products
          </button>

          {categories.map((item) => (
            <button
              key={item}
              onClick={() => handleCategoryChange(item)}
              className="text-gray-700 hover:text-pink-500 font-semibold"
            >
              {item}
            </button>
          ))}

        </div>

        {/* Page Heading */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            {category || "All Products"}
          </h2>
        </div>

        {/* Product Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {/* Loading */}
          {loading && (
            <p className="col-span-full text-center text-gray-500">
              Loading products...
            </p>
          )}

          {/* Error */}
          {!loading && error && (
            <p className="col-span-full text-center text-red-500">
              {error}
            </p>
          )}

          {/* Products */}
          {!loading &&
            !error &&
            filteredProducts.length > 0 &&
            filteredProducts.map((product) => {

              const imagePath = product.image
                ?.replace("./", "")
                .replace("images/", "");

              return (
                <div
                  key={product.id}
                  className="product-card bg-white rounded-2xl shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-2"
                >

                  {/* Product Image */}
                  <Link
                    to={`/shop/${product.id}`}
                    className="block"
                  >
                    <img
                      src={`/images/${imagePath}`}
                      className="product-image w-full h-56 object-cover"
                      alt={product.name}
                      onError={(event) => {
                        console.error(
                          "Image failed:",
                          event.currentTarget.src
                        );
                      }}
                    />
                  </Link>

                  {/* Product Content */}
                  <div className="p-6">

                    {/* Product Name */}
                    <Link
                      to={`/shop/${product.id}`}
                      className="block"
                    >
                      <h3 className="text-xl font-semibold text-gray-800 hover:text-pink-500 transition">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Description */}
                    <p className="mt-2 text-gray-600">
                      {product.desc}
                    </p>

                    {/* Price + Cart */}
                    <div className="flex items-center justify-between mt-4">

                      <span className="text-lg font-bold text-pink-600">
                        ₹{Number(product.price).toFixed(0)}
                      </span>

                      <button
                        type="button"
                        onClick={(event) =>
                          animateToCart(event, product)
                        }
                        className="px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition"
                      >
                        Add to Cart
                      </button>

                    </div>

                  </div>
                </div>
              );
            })}

          {/* No Products */}
          {!loading &&
            !error &&
            filteredProducts.length === 0 && (
              <p className="col-span-full text-center text-gray-500">
                No products available.
              </p>
            )}

        </div>
      </div>

      {/* Cart Animation */}
      <style>{`
        .cart-bounce {
          animation: cartBounce 0.5s ease;
        }

        @keyframes cartBounce {
          0% {
            transform: scale(1);
          }

          30% {
            transform: scale(1.25);
          }

          50% {
            transform: scale(0.9);
          }

          70% {
            transform: scale(1.15);
          }

          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </section>
  );
}

export default Shop;