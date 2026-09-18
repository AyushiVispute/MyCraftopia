import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Classes from "./pages/Classes";
import MyCartPage from "./pages/MyCart";
import LoginPage from "./pages/Login";
import Signup from "./pages/Signup";
import ContactPage from "./pages/Contact";
import Payment from "./pages/Payment";
import DeliveryAddress from "./pages/DeliveryAddress";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import Dashboard from "./pages/Dashboard";
import ClassDetails from "./pages/ClassDetails";
import AdminLogin from "./pages/AdminLogin";

function App() {
  return (
    <>
      <Navbar />

      <main className="flex-grow">
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Shop */}
          <Route path="/shop" element={<Shop />} />

          {/* Product Details */}
          <Route path="/shop/:id" element={<ProductDetail />} />

          {/* Classes */}
          <Route path="/classes" element={<Classes />} />
          <Route path="/classes/:id" element={<ClassDetails />} />

          {/* Cart */}
          <Route path="/mycard" element={<MyCartPage />} />

          {/* Checkout - Delivery Address */}
          <Route path="/checkout" element={<DeliveryAddress />} />
          <Route path="/checkout/address" element={<DeliveryAddress />} />

          {/* Checkout - Payment */}
          <Route path="/checkout/payment" element={<Payment />} />

          {/* Order Success */}
          <Route path="/order-success" element={<OrderSuccess />} />

          {/* My Orders */}
          <Route path="/my-orders" element={<MyOrders />} />

          {/* Authentication */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Contact */}
          <Route path="/contact" element={<ContactPage />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="container mx-auto px-6 py-10">
                <h1 className="text-4xl font-bold text-gray-800">
                  404 - Page Not Found
                </h1>
              </div>
            }
          />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;
