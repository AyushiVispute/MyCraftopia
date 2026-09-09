import { Link, useLocation } from "react-router-dom";

function OrderSuccess() {
  const location = useLocation();

  const savedOrder = localStorage.getItem(
    "mycraftopia_last_order"
  );

  let order = location.state?.order;

  if (!order && savedOrder) {
    try {
      order = JSON.parse(savedOrder);
    } catch {
      order = null;
    }
  }

  return (
    <section className="min-h-[75vh] bg-gray-50 py-16">

      <div className="container mx-auto px-6">

        <div className="max-w-2xl mx-auto">

          {/* SUCCESS CARD */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10 text-center">

            {/* SUCCESS ICON */}
            <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">

              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>

            </div>


            <h1 className="text-3xl font-bold text-gray-800 mt-6">
              Order Placed Successfully!
            </h1>


            <p className="text-gray-500 mt-3">
              Thank you for shopping with MyCraftopia.
            </p>


            {/* ORDER DETAILS */}
            {order && (
              <div className="mt-8 bg-gray-50 rounded-xl p-5 text-left">

                <div className="flex justify-between items-center pb-4 border-b border-gray-200">

                  <span className="text-gray-600">
                    Order ID
                  </span>

                  <span className="font-bold text-gray-800">
                    #{order.id}
                  </span>

                </div>


                <div className="flex justify-between items-center py-4 border-b border-gray-200">

                  <span className="text-gray-600">
                    Payment
                  </span>

                  <span className="font-medium text-gray-800">
                    {order.payment_method}
                  </span>

                </div>


                <div className="flex justify-between items-center pt-4">

                  <span className="text-gray-600">
                    Total Amount
                  </span>

                  <span className="text-xl font-bold text-pink-600">
                    ₹
                    {Number(
                      order.total_amount || 0
                    ).toFixed(0)}
                  </span>

                </div>

              </div>
            )}


            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">

              <Link
                to="/shop"
                className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3.5 rounded-lg transition"
              >
                Continue Shopping
              </Link>


              <Link
                to="/my-orders"
                className="flex-1 border border-pink-500 text-pink-500 hover:bg-pink-50 font-semibold py-3.5 rounded-lg transition"
              >
                View My Orders
              </Link>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default OrderSuccess;
