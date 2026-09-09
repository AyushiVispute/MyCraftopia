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
import MyOrders from "./pages/MyOrders";
import DeliveryAddress from "./pages/DeliveryAddress";

function App() {
  return (
    <>
      <Navbar />

      <main className="flex-grow">
        <Routes>

          {/* Home */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* Shop */}
          <Route
            path="/shop"
            element={<Shop />}
          />

          {/* Product Details */}
          <Route
            path="/shop/:id"
            element={<ProductDetail />}
          />

          {/* Classes */}
          <Route
            path="/classes"
            element={<Classes />}
          />

          {/* Cart */}
          <Route
            path="/mycard"
            element={<MyCartPage />}
          />

          {/* Checkout - Delivery Address */}
          <Route
            path="/checkout"
            element={<DeliveryAddress />}
          />
          <Route path="/my-orders" element={<MyOrders />} />

          <Route
            path="/checkout/address"
            element={<DeliveryAddress />}
          />

          {/* Checkout - Payment */}
          <Route
            path="/checkout/payment"
            element={<Payment />}
          />

          {/* Authentication */}
          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          {/* Contact */}
          <Route
            path="/contact"
            element={<ContactPage />}
          />

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