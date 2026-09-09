import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );

        setProduct(response.data);
        setError("");
      } catch (err) {
        console.error("Error fetching product:", err);

        setError("Product not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-gray-500">
          Loading product...
        </p>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Product Not Found 😢
          </h2>

          <Link
            to="/shop"
            className="inline-block px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
          >
            Back to Shop
          </Link>
        </div>
      </section>
    );
  }

  const imagePath = product.image
    ?.replace("./", "")
    .replace("images/", "");

  const totalPrice = Number(product.price) * quantity;

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6">

        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-gray-500">
          <Link
            to="/"
            className="hover:text-pink-500"
          >
            Home
          </Link>

          <span className="mx-2">›</span>

          <Link
            to="/shop"
            className="hover:text-pink-500"
          >
            Shop
          </Link>

          <span className="mx-2">›</span>

          <span className="text-gray-700">
            {product.name}
          </span>
        </div>

        {/* Product Details Card */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">

          <div className="grid md:grid-cols-2 gap-10 p-8 md:p-10">

            {/* Product Image */}
            <div className="flex items-center justify-center">

              <div className="w-full bg-gray-50 rounded-2xl overflow-hidden">
                <img
                  src={`/images/${imagePath}`}
                  alt={product.name}
                  className="w-full h-[450px] object-contain"
                />
              </div>

            </div>

            {/* Product Information */}
            <div className="flex flex-col justify-center">

              {/* Category */}
              <p className="text-pink-500 font-semibold mb-3">
                {product.category}
              </p>

              {/* Product Name */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mt-5">
                <span className="text-3xl font-bold text-pink-600">
                  ₹{Number(product.price).toFixed(0)}
                </span>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Product Description
                </h3>

                <p className="text-gray-600 leading-7">
                  {product.desc}
                </p>
              </div>

              {/* Product Information */}
              <div className="mt-6 border-t border-gray-200 pt-5">

                <div className="flex justify-between py-2">
                  <span className="text-gray-500">
                    Category
                  </span>

                  <span className="font-medium text-gray-800">
                    {product.category}
                  </span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-gray-500">
                    Product ID
                  </span>

                  <span className="font-medium text-gray-800">
                    #{product.id}
                  </span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-gray-500">
                    Availability
                  </span>

                  <span className="font-medium text-green-600">
                    Available
                  </span>
                </div>

              </div>

              {/* Quantity */}
              <div className="mt-6 flex items-center gap-4">

                <span className="text-gray-700 font-medium">
                  Quantity
                </span>

                <div className="flex items-center border border-gray-300 rounded-lg">

                  <button
                    onClick={() =>
                      setQuantity((q) => Math.max(1, q - 1))
                    }
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    −
                  </button>

                  <span className="px-5 py-2 border-x border-gray-300">
                    {quantity}
                  </span>

                  <button
                    onClick={() =>
                      setQuantity((q) => q + 1)
                    }
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    +
                  </button>

                </div>

              </div>

              {/* Total */}
              <div className="mt-5">
                <span className="text-gray-600">
                  Total:{" "}
                </span>

                <span className="text-xl font-bold text-pink-600">
                  ₹{totalPrice.toFixed(0)}
                </span>
              </div>

              {/* Buttons */}
              <div className="mt-7 flex flex-wrap gap-4">

                <button
                  onClick={handleAddToCart}
                  className="px-7 py-3 bg-pink-500 text-white rounded-xl font-semibold hover:bg-pink-600 transition"
                >
                  {added ? "✓ Added to Cart" : "Add to Cart"}
                </button>

                <Link
                  to="/shop"
                  className="px-7 py-3 border border-pink-500 text-pink-500 rounded-xl font-semibold hover:bg-pink-50 transition"
                >
                  Continue Shopping
                </Link>

              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default ProductDetail;