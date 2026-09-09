import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "${import.meta.env.VITE_API_URL}/api/orders",
          {
            withCredentials: true,
          }
        );

        setOrders(response.data);
      } catch (err) {
        console.error("Failed to load orders:", err);

        if (err.response?.status === 401) {
          navigate("/login");
          return;
        }

        setError(
          err.response?.data?.error ||
          "Unable to load your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700";

      case "shipped":
        return "bg-blue-100 text-blue-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <section className="min-h-[75vh] bg-gray-50 py-10">

      <div className="max-w-6xl mx-auto px-5 sm:px-6">

        {/* Header */}
        <div className="mb-8">

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            My Orders
          </h1>

          <p className="text-gray-500 mt-2">
            Track and manage your MyCraftopia orders
          </p>

        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">

            <div className="animate-spin w-10 h-10 border-4 border-pink-200 border-t-pink-500 rounded-full mx-auto mb-4" />

            <p className="text-gray-500">
              Loading your orders...
            </p>

          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">

            <div className="text-5xl mb-4">
              ⚠️
            </div>

            <h2 className="text-xl font-semibold text-gray-800">
              Something went wrong
            </h2>

            <p className="text-gray-500 mt-2">
              {error}
            </p>

          </div>
        )}

        {/* Empty */}
        {!loading && !error && orders.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">

            <div className="text-6xl mb-5">
              📦
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              No orders yet
            </h2>

            <p className="text-gray-500 mt-2 mb-7">
              You haven't placed any orders yet.
            </p>

            <Link
              to="/shop"
              className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold px-7 py-3 rounded-xl transition"
            >
              Start Shopping
            </Link>

          </div>
        )}

        {/* Orders */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-6">

            {orders.map((order) => (

              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >

                {/* Order Header */}
                <div className="px-5 sm:px-7 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Order ID
                    </p>

                    <p className="text-lg font-bold text-gray-800">
                      #{order.id}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">

                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {order.status || "Pending"}
                    </span>

                  </div>

                </div>

                {/* Items */}
                <div className="px-5 sm:px-7 py-5">

                  <div className="space-y-4">

                    {order.items?.map((item) => (

                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-4"
                      >

                        <div className="flex items-center gap-4 min-w-0">

                          <div className="w-14 h-14 rounded-xl bg-pink-50 flex items-center justify-center shrink-0">
                            🛍️
                          </div>

                          <div className="min-w-0">

                            <p className="font-semibold text-gray-800 truncate">
                              {item.product_name}
                            </p>

                            <p className="text-sm text-gray-500">
                              ₹{Number(item.price).toFixed(0)}
                              {" × "}
                              {item.quantity}
                            </p>

                          </div>

                        </div>

                        <p className="font-semibold text-gray-800 shrink-0">
                          ₹
                          {(
                            Number(item.price) *
                            Number(item.quantity)
                          ).toFixed(0)}
                        </p>

                      </div>

                    ))}

                  </div>

                </div>

                {/* Order Footer */}
                <div className="bg-gray-50 px-5 sm:px-7 py-5">

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

                    <div>
                      <p className="text-xs text-gray-400 uppercase">
                        Payment
                      </p>

                      <p className="text-sm font-semibold text-gray-700 mt-1">
                        {order.payment_method}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 uppercase">
                        Delivery
                      </p>

                      <p className="text-sm font-semibold text-gray-700 mt-1">
                        {order.city}, {order.state}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 uppercase">
                        Total Amount
                      </p>

                      <p className="text-xl font-bold text-pink-500 mt-1">
                        ₹{Number(order.total_amount).toFixed(0)}
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

    </section>
  );
}

export default MyOrders;
