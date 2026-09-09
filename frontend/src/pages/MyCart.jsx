import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function MyCart() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalPrice,
    totalItems,
  } = useCart();

  // Convert database image path to frontend public image path
  const getImagePath = (image) => {
    if (!image) {
      return "/images/default.jpg";
    }

    const cleanPath = image
      .replace("./", "")
      .replace("images/", "");

    if (cleanPath.startsWith("shopimg/")) {
      return `/images/${cleanPath}`;
    }

    return `/images/${cleanPath}`;
  };

  // Empty cart
  if (cart.length === 0) {
    return (
      <section className="py-16 bg-gray-50 min-h-[70vh]">
        <div className="container mx-auto px-6 text-center">

          <h2 className="text-3xl font-bold text-gray-800">
            My Cart
          </h2>

          <div className="bg-white rounded-2xl shadow-md max-w-xl mx-auto mt-8 p-10">

            <div className="text-6xl mb-5">
              🛒
            </div>

            <h3 className="text-2xl font-semibold text-gray-800">
              Your cart is empty
            </h3>

            <p className="mt-3 text-gray-600">
              Looks like you haven't added anything to your cart yet.
            </p>

            <Link
              to="/shop"
              className="inline-block mt-6 px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition"
            >
              Continue Shopping
            </Link>

          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50 min-h-[70vh]">
      <div className="container mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">
            My Cart
          </h2>

          <p className="mt-2 text-gray-600">
            {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">

            {cart.map((item) => {

              const itemTotal =
                Number(item.price || 0) * item.quantity;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row gap-6 hover:shadow-lg transition"
                >

                  {/* Product Image */}
                  <Link
                    to={`/shop/${item.id}`}
                    className="shrink-0"
                  >
                    <img
                      src={getImagePath(item.image)}
                      alt={item.name}
                      className="w-full md:w-40 h-32 object-cover rounded-xl hover:opacity-90 transition"
                    />
                  </Link>

                  {/* Product Information */}
                  <div className="flex-1">

                    <Link to={`/shop/${item.id}`}>
                      <h3 className="text-xl font-semibold text-gray-800 hover:text-pink-500 transition">
                        {item.name}
                      </h3>
                    </Link>

                    <p className="mt-2 text-gray-600">
                      ₹{Number(item.price).toFixed(0)} each
                    </p>

                    {/* Quantity */}
                    <div className="flex items-center gap-3 mt-4">

                      <span className="text-sm text-gray-500">
                        Quantity:
                      </span>

                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">

                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity - 1
                            )
                          }
                          className="w-9 h-9 bg-gray-100 hover:bg-gray-200 text-gray-700"
                        >
                          −
                        </button>

                        <span className="w-10 text-center font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity + 1
                            )
                          }
                          className="w-9 h-9 bg-gray-100 hover:bg-gray-200 text-gray-700"
                        >
                          +
                        </button>

                      </div>

                    </div>

                  </div>

                  {/* Price + Remove */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between">

                    <span className="text-lg font-bold text-pink-600">
                      ₹{itemTotal.toFixed(0)}
                    </span>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-600 transition"
                    >
                      Remove
                    </button>

                  </div>

                </div>
              );
            })}

            {/* Continue Shopping */}
            <Link
              to="/shop"
              className="inline-block text-pink-500 font-semibold hover:text-pink-600 transition"
            >
              ← Continue Shopping
            </Link>

          </div>

          {/* Summary */}
          <div className="bg-white rounded-2xl shadow-md p-6 h-fit sticky top-24">

            <h3 className="text-2xl font-bold text-gray-800">
              Cart Summary
            </h3>

            {/* Items */}
            <div className="flex justify-between mt-6 text-gray-600">
              <span>Items</span>

              <span className="font-medium">
                {totalItems}
              </span>
            </div>

            {/* Subtotal */}
            <div className="flex justify-between mt-4 text-gray-600">
              <span>Subtotal</span>

              <span>
                ₹{Number(totalPrice).toFixed(0)}
              </span>
            </div>

            {/* Delivery */}
            <div className="flex justify-between mt-4 text-gray-600">
              <span>Delivery</span>

              <span className="text-green-600 font-medium">
                Free
              </span>
            </div>

            {/* Total */}
            <div className="border-t mt-5 pt-5 flex justify-between">

              <span className="text-lg font-semibold text-gray-800">
                Total
              </span>

              <span className="text-xl font-bold text-pink-600">
                ₹{Number(totalPrice).toFixed(0)}
              </span>

            </div>

            {/* Checkout */}
            <Link
              to="/checkout"
              className="block text-center w-full mt-6 px-5 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition font-semibold"
            >
              Proceed to Checkout
            </Link>

            {/* Clear Cart */}
            <button
              onClick={clearCart}
              className="w-full mt-3 px-5 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition"
            >
              Clear Cart
            </button>

          </div>

        </div>
      </div>
    </section>
  );
}

export default MyCart;
