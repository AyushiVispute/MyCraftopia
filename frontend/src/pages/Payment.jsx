import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

function Payment() {
  const navigate = useNavigate();

  const {
    cart,
    totalItems,
    totalPrice,
    clearCart,
  } = useCart();

  const [paymentMethod, setPaymentMethod] = useState("ONLINE");
  const [onlineMethod, setOnlineMethod] = useState("UPI");

  const [upiOpen, setUpiOpen] = useState(true);
  const [walletOpen, setWalletOpen] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);
  const [netBankingOpen, setNetBankingOpen] = useState(false);

  const [selectedUpiApp, setSelectedUpiApp] = useState("");

  const [upiId, setUpiId] = useState("");

  const [address] = useState(() => {
    try {
      const savedAddress = localStorage.getItem(
        "mycraftopia_delivery_address"
      );

      return savedAddress ? JSON.parse(savedAddress) : null;
    } catch {
      return null;
    }
  });

  // -----------------------------
  // PLACE ORDER
  // -----------------------------
   const handlePlaceOrder = async () => {
  if (!address) {
    navigate("/checkout");
    return;
  }

  if (!cart || cart.length === 0) {
    alert("Your cart is empty.");
    navigate("/mycard");
    return;
  }

  if (
    paymentMethod === "ONLINE" &&
    !onlineMethod
  ) {
    alert("Please select a payment method.");
    return;
  }

  const selectedPayment =
    paymentMethod === "COD"
      ? "Cash on Delivery"
      : onlineMethod;

  try {
    const response = await axios.post(
      "${import.meta.env.VITE_API_URL}/api/orders",
      {
        customer: {
          name: address.name,
          phone: address.phone,
          address: address.address,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
        },

        paymentMethod: selectedPayment,

        items: cart.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
      },
      {
        withCredentials: true,
      }
    );

    console.log("Order created:", response.data);

    const createdOrder = response.data.order;

    // Save order information temporarily
    localStorage.setItem(
      "mycraftopia_last_order",
      JSON.stringify(createdOrder)
    );

    // Clear cart after successful order
    clearCart();

    // Remove saved delivery address
    localStorage.removeItem(
      "mycraftopia_delivery_address"
    );

    // Go to success page
    navigate("/order-success", {
      state: {
        order: createdOrder,
      },
    });

  } catch (error) {
    console.error(
      "Order creation failed:",
      error
    );

    if (error.response) {

      if (error.response.status === 401) {
        alert(
          "Please login before placing your order."
        );

        navigate("/login");
        return;
      }

      alert(
        error.response.data?.error ||
        "Unable to place your order."
      );

      return;
    }

    alert(
      "Unable to connect to the server. Please try again."
    );
  }
};

  // -----------------------------
  // EMPTY CART
  // -----------------------------
  if (cart.length === 0) {
    return (
      <section className="min-h-screen bg-gray-50 py-16">

        <div className="container mx-auto px-6">

          <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">

            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-pink-50 flex items-center justify-center">

              <svg
                className="w-8 h-8 text-pink-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 4h13m-11 0a2 2 0 104 0m6 0a2 2 0 104 0"
                />
              </svg>

            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              Your cart is empty
            </h2>

            <p className="text-gray-500 mt-2 mb-7">
              Add some products before proceeding to payment.
            </p>

            <Link
              to="/shop"
              className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold px-7 py-3 rounded-lg transition"
            >
              Continue Shopping
            </Link>

          </div>

        </div>

      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-6 md:py-8">

      <div className="container mx-auto px-4 md:px-6 max-w-6xl">

        {/* =========================================
            CHECKOUT PROGRESS
        ========================================== */}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4 mb-6">

          <div className="flex items-center justify-center max-w-xl mx-auto">

            {/* DELIVERY */}
            <div className="flex items-center">

              <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center text-sm font-bold">
                ✓
              </div>

              <span className="ml-2 text-sm md:text-base font-semibold text-pink-500">
                Delivery
              </span>

            </div>

            <div className="flex-1 max-w-32 md:max-w-48 h-px bg-pink-400 mx-3 md:mx-5"></div>

            {/* PAYMENT */}
            <div className="flex items-center">

              <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center text-sm font-bold">
                2
              </div>

              <span className="ml-2 text-sm md:text-base font-semibold text-pink-500">
                Payment
              </span>

            </div>

          </div>

        </div>


        {/* =========================================
            PAGE TITLE
        ========================================== */}

        <div className="mb-6">

          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Payment
          </h1>

          <p className="text-sm md:text-base text-gray-500 mt-1">
            Choose your preferred payment method
          </p>

        </div>


        <div className="grid lg:grid-cols-3 gap-6 items-start">

          {/* =======================================
              LEFT SIDE
          ======================================== */}

          <div className="lg:col-span-2 space-y-6">


            {/* =====================================
                DELIVERY ADDRESS
            ====================================== */}

            {address && (

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                <div className="px-5 md:px-6 py-4 border-b border-gray-100 flex items-center justify-between">

                  <h2 className="text-lg font-bold text-gray-800">
                    Delivery Address
                  </h2>

                  <Link
                    to="/checkout"
                    className="text-sm font-semibold text-pink-500 hover:text-pink-600"
                  >
                    Change
                  </Link>

                </div>


                <div className="p-5 md:p-6">

                  <div className="flex items-start gap-4">

                    {/* LOCATION ICON */}
                    <div className="hidden sm:flex w-10 h-10 rounded-full bg-pink-50 items-center justify-center flex-shrink-0">

                      <svg
                        className="w-5 h-5 text-pink-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 21s8-4.5 8-10a8 8 0 10-16 0c0 5.5 8 10 8 10z"
                        />

                        <circle
                          cx="12"
                          cy="11"
                          r="2.5"
                          strokeWidth="2"
                        />
                      </svg>

                    </div>


                    <div className="min-w-0">

                      <div className="flex items-center gap-3 flex-wrap">

                        <p className="font-bold text-gray-800">
                          {address.name}
                        </p>

                        <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-gray-100 text-gray-600">
                          {address.addressType || "Home"}
                        </span>

                      </div>


                      <p className="text-sm text-gray-600 leading-6 mt-2">
                        {address.address}
                        <br />
                        {address.city},{" "}
                        {address.state} -{" "}
                        {address.pincode}
                      </p>


                      <p className="text-sm text-gray-700 mt-2">
                        Mobile:{" "}
                        <span className="font-medium">
                          {address.phone}
                        </span>
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            )}


            {/* =====================================
                PAYMENT CARD
            ====================================== */}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

              <div className="px-5 md:px-6 py-5 border-b border-gray-100">

                <h2 className="text-lg md:text-xl font-bold text-gray-800">
                  Payment Method
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  All payment options are secure
                </p>

              </div>


              <div className="p-5 md:p-6">


                {/* =================================
                    CASH ON DELIVERY
                ================================== */}

                <div
                  onClick={() =>
                    setPaymentMethod("COD")
                  }
                  className={`border rounded-xl cursor-pointer transition ${
                    paymentMethod === "COD"
                      ? "border-pink-500 ring-1 ring-pink-300"
                      : "border-gray-300 hover:border-pink-300"
                  }`}
                >

                  <div className="p-5 flex items-center justify-between">

                    <div className="flex items-center gap-4">

                      <div className="w-11 h-11 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">

                        <svg
                          className="w-6 h-6 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <rect
                            x="3"
                            y="6"
                            width="18"
                            height="12"
                            rx="2"
                            strokeWidth="2"
                          />

                          <circle
                            cx="12"
                            cy="12"
                            r="2.5"
                            strokeWidth="2"
                          />

                          <path
                            strokeWidth="2"
                            d="M3 10h3M18 10h3"
                          />
                        </svg>

                      </div>


                      <div>

                        <p className="font-semibold text-gray-800">
                          Cash on Delivery
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          Pay when your order is delivered
                        </p>

                      </div>

                    </div>


                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        paymentMethod === "COD"
                          ? "border-pink-500 bg-pink-500"
                          : "border-gray-400"
                      }`}
                    >

                      {paymentMethod === "COD" && (
                        <span className="text-white text-xs font-bold">
                          ✓
                        </span>
                      )}

                    </div>

                  </div>

                </div>


                {/* =================================
                    ONLINE PAYMENT
                ================================== */}

                <div
                  className={`border rounded-xl overflow-hidden mt-4 transition ${
                    paymentMethod === "ONLINE"
                      ? "border-pink-500 ring-1 ring-pink-300"
                      : "border-gray-300"
                  }`}
                >

                  {/* ONLINE HEADER */}

                  <div
                    onClick={() =>
                      setPaymentMethod("ONLINE")
                    }
                    className="p-5 flex items-center justify-between cursor-pointer"
                  >

                    <div className="flex items-center gap-4">

                      <div className="w-11 h-11 rounded-lg bg-pink-50 flex items-center justify-center">

                        <svg
                          className="w-6 h-6 text-pink-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 7h18M3 11h18M3 15h18M3 19h18"
                          />
                        </svg>

                      </div>


                      <div>

                        <p className="font-semibold text-gray-800">
                          Pay Online
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          UPI, Cards, Wallets & Net Banking
                        </p>

                      </div>

                    </div>


                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        paymentMethod === "ONLINE"
                          ? "border-pink-500 bg-pink-500"
                          : "border-gray-400"
                      }`}
                    >

                      {paymentMethod === "ONLINE" && (
                        <span className="text-white text-xs font-bold">
                          ✓
                        </span>
                      )}

                    </div>

                  </div>


                  {/* ONLINE CONTENT */}

                  {paymentMethod === "ONLINE" && (

                    <div className="border-t border-gray-200">


                      {/* =================================
                          OFFER BANNER
                      ================================== */}

                      <div className="px-5 py-4 bg-pink-50">

                        <div className="flex items-center justify-between gap-3">

                          <div>

                            <p className="text-sm font-semibold text-gray-800">
                              Special offers available
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                              Get exclusive offers on online payments
                            </p>

                          </div>

                          <span className="text-xs font-bold text-pink-600">
                            OFFERS
                          </span>

                        </div>

                      </div>


                      {/* =================================
                          UPI
                      ================================== */}

                      <div className="border-b border-gray-200">

                        <button
                          type="button"
                          onClick={() =>
                            setUpiOpen(!upiOpen)
                          }
                          className="w-full px-5 py-5 flex items-center justify-between text-left"
                        >

                          <div>

                            <p className="font-semibold text-gray-800">
                              UPI
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                              Pay using any UPI app
                            </p>

                          </div>

                          <span className="text-gray-500 text-lg">
                            {upiOpen ? "⌃" : "⌄"}
                          </span>

                        </button>


                        {upiOpen && (

                          <div className="px-5 pb-5">


                            {/* UPI APPS */}

                            <div className="space-y-3">


                              {/* PHONEPE */}

                              <button
                                type="button"
                                onClick={() => {
                                  setOnlineMethod("UPI");
                                  setSelectedUpiApp("PhonePe");
                                }}
                                className={`w-full flex items-center justify-between p-4 rounded-lg border transition ${
                                  selectedUpiApp === "PhonePe"
                                    ? "border-pink-500 bg-pink-50"
                                    : "border-gray-200 hover:border-pink-300"
                                }`}
                              >

                                <div className="flex items-center gap-4">

                                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">

                                    <span className="font-bold text-purple-700">
                                      P
                                    </span>

                                  </div>

                                  <div className="text-left">

                                    <p className="font-medium text-gray-800">
                                      PhonePe
                                    </p>

                                    <p className="text-xs text-gray-500">
                                      UPI payment
                                    </p>

                                  </div>

                                </div>


                                <div
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    selectedUpiApp === "PhonePe"
                                      ? "border-pink-500 bg-pink-500"
                                      : "border-gray-400"
                                  }`}
                                >

                                  {selectedUpiApp === "PhonePe" && (
                                    <span className="text-white text-xs">
                                      ✓
                                    </span>
                                  )}

                                </div>

                              </button>


                              {/* GOOGLE PAY */}

                              <button
                                type="button"
                                onClick={() => {
                                  setOnlineMethod("UPI");
                                  setSelectedUpiApp("Google Pay");
                                }}
                                className={`w-full flex items-center justify-between p-4 rounded-lg border transition ${
                                  selectedUpiApp === "Google Pay"
                                    ? "border-pink-500 bg-pink-50"
                                    : "border-gray-200 hover:border-pink-300"
                                }`}
                              >

                                <div className="flex items-center gap-4">

                                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">

                                    <span className="font-bold text-gray-700">
                                      G
                                    </span>

                                  </div>

                                  <div className="text-left">

                                    <p className="font-medium text-gray-800">
                                      Google Pay
                                    </p>

                                    <p className="text-xs text-gray-500">
                                      UPI payment
                                    </p>

                                  </div>

                                </div>


                                <div
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    selectedUpiApp === "Google Pay"
                                      ? "border-pink-500 bg-pink-500"
                                      : "border-gray-400"
                                  }`}
                                >

                                  {selectedUpiApp === "Google Pay" && (
                                    <span className="text-white text-xs">
                                      ✓
                                    </span>
                                  )}

                                </div>

                              </button>


                              {/* PAYTM */}

                              <button
                                type="button"
                                onClick={() => {
                                  setOnlineMethod("UPI");
                                  setSelectedUpiApp("Paytm");
                                }}
                                className={`w-full flex items-center justify-between p-4 rounded-lg border transition ${
                                  selectedUpiApp === "Paytm"
                                    ? "border-pink-500 bg-pink-50"
                                    : "border-gray-200 hover:border-pink-300"
                                }`}
                              >

                                <div className="flex items-center gap-4">

                                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">

                                    <span className="font-bold text-blue-600">
                                      P
                                    </span>

                                  </div>

                                  <div className="text-left">

                                    <p className="font-medium text-gray-800">
                                      Paytm
                                    </p>

                                    <p className="text-xs text-gray-500">
                                      UPI payment
                                    </p>

                                  </div>

                                </div>


                                <div
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    selectedUpiApp === "Paytm"
                                      ? "border-pink-500 bg-pink-500"
                                      : "border-gray-400"
                                  }`}
                                >

                                  {selectedUpiApp === "Paytm" && (
                                    <span className="text-white text-xs">
                                      ✓
                                    </span>
                                  )}

                                </div>

                              </button>

                            </div>


                            {/* UPI ID */}

                            <div className="mt-5">

                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Add UPI ID
                              </label>

                              <div className="flex flex-col sm:flex-row gap-2">

                                <input
                                  type="text"
                                  value={upiId}
                                  onChange={(e) => {
                                    setUpiId(e.target.value);
                                    setOnlineMethod("UPI");
                                  }}
                                  placeholder="example@upi"
                                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                                />

                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!upiId.trim()) {
                                      alert("Please enter your UPI ID.");
                                      return;
                                    }

                                    setOnlineMethod("UPI");

                                    alert(
                                      "UPI ID added successfully."
                                    );
                                  }}
                                  className="px-6 py-3 border border-pink-500 text-pink-600 rounded-lg font-semibold hover:bg-pink-50 transition"
                                >
                                  Add
                                </button>

                              </div>

                              <p className="text-xs text-gray-500 mt-2">
                                Example: yourname@upi
                              </p>

                            </div>


                            {/* ANY UPI APP */}

                            <button
                              type="button"
                              onClick={() => {
                                setOnlineMethod("UPI");
                                setSelectedUpiApp("Any UPI App");
                              }}
                              className="w-full mt-4 border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-between hover:border-pink-400 transition"
                            >

                              <span className="text-sm font-semibold text-gray-700">
                                Pay by any UPI app
                              </span>

                              <span className="text-pink-500">
                                →
                              </span>

                            </button>

                          </div>

                        )}

                      </div>


                      {/* =================================
                          WALLET
                      ================================== */}

                      <div className="border-b border-gray-200">

                        <button
                          type="button"
                          onClick={() =>
                            setWalletOpen(!walletOpen)
                          }
                          className="w-full px-5 py-5 flex items-center justify-between text-left"
                        >

                          <div>

                            <div className="flex items-center gap-3">

                              <p className="font-semibold text-gray-800">
                                Wallet
                              </p>

                              <span className="text-xs font-semibold text-green-600">
                                Offers Available
                              </span>

                            </div>

                            <p className="text-sm text-gray-500 mt-1">
                              Pay using supported wallets
                            </p>

                          </div>

                          <span className="text-gray-500 text-lg">
                            {walletOpen ? "⌃" : "⌄"}
                          </span>

                        </button>


                        {walletOpen && (

                          <div className="px-5 pb-5">

                            <button
                              type="button"
                              onClick={() =>
                                setOnlineMethod("WALLET")
                              }
                              className={`w-full p-4 rounded-lg border flex items-center justify-between ${
                                onlineMethod === "WALLET"
                                  ? "border-pink-500 bg-pink-50"
                                  : "border-gray-200"
                              }`}
                            >

                              <div className="flex items-center gap-3">

                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">

                                  <svg
                                    className="w-5 h-5 text-gray-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <rect
                                      x="3"
                                      y="6"
                                      width="18"
                                      height="13"
                                      rx="2"
                                      strokeWidth="2"
                                    />

                                    <path
                                      strokeWidth="2"
                                      d="M16 12h5"
                                    />

                                    <circle
                                      cx="17"
                                      cy="12"
                                      r="1"
                                      fill="currentColor"
                                    />
                                  </svg>

                                </div>

                                <span className="font-medium text-gray-800">
                                  Wallet Payment
                                </span>

                              </div>


                              <div
                                className={`w-5 h-5 rounded-full border-2 ${
                                  onlineMethod === "WALLET"
                                    ? "border-pink-500 bg-pink-500"
                                    : "border-gray-400"
                                }`}
                              ></div>

                            </button>

                          </div>

                        )}

                      </div>


                      {/* =================================
                          CARD
                      ================================== */}

                      <div className="border-b border-gray-200">

                        <button
                          type="button"
                          onClick={() =>
                            setCardOpen(!cardOpen)
                          }
                          className="w-full px-5 py-5 flex items-center justify-between text-left"
                        >

                          <div>

                            <p className="font-semibold text-gray-800">
                              Debit / Credit Cards
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                              Visa, Mastercard, RuPay
                            </p>

                          </div>

                          <span className="text-gray-500 text-lg">
                            {cardOpen ? "⌃" : "⌄"}
                          </span>

                        </button>


                        {cardOpen && (

                          <div className="px-5 pb-5">

                            <button
                              type="button"
                              onClick={() =>
                                setOnlineMethod("CARD")
                              }
                              className={`w-full text-left border rounded-lg p-4 transition ${
                                onlineMethod === "CARD"
                                  ? "border-pink-500 bg-pink-50"
                                  : "border-gray-200"
                              }`}
                            >

                              <div className="flex items-center gap-3">

                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">

                                  <svg
                                    className="w-5 h-5 text-gray-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <rect
                                      x="2"
                                      y="5"
                                      width="20"
                                      height="14"
                                      rx="2"
                                      strokeWidth="2"
                                    />

                                    <path
                                      strokeWidth="2"
                                      d="M2 10h20"
                                    />

                                  </svg>

                                </div>

                                <div>

                                  <p className="font-medium text-gray-800">
                                    Pay securely with your card
                                  </p>

                                  <p className="text-sm text-gray-500 mt-1">
                                    Visa, Mastercard and RuPay supported
                                  </p>

                                </div>

                              </div>

                            </button>

                          </div>

                        )}

                      </div>


                      {/* =================================
                          NET BANKING
                      ================================== */}

                      <div>

                        <button
                          type="button"
                          onClick={() =>
                            setNetBankingOpen(
                              !netBankingOpen
                            )
                          }
                          className="w-full px-5 py-5 flex items-center justify-between text-left"
                        >

                          <div>

                            <p className="font-semibold text-gray-800">
                              Net Banking
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                              Pay using your bank account
                            </p>

                          </div>

                          <span className="text-gray-500 text-lg">
                            {netBankingOpen
                              ? "⌃"
                              : "⌄"}
                          </span>

                        </button>


                        {netBankingOpen && (

                          <div className="px-5 pb-5">

                            <button
                              type="button"
                              onClick={() =>
                                setOnlineMethod(
                                  "NET_BANKING"
                                )
                              }
                              className={`w-full border rounded-lg p-4 text-left transition ${
                                onlineMethod ===
                                "NET_BANKING"
                                  ? "border-pink-500 bg-pink-50"
                                  : "border-gray-200"
                              }`}
                            >

                              <div className="flex items-center justify-between">

                                <div>

                                  <p className="font-medium text-gray-800">
                                    Select your bank
                                  </p>

                                  <p className="text-sm text-gray-500 mt-1">
                                    Secure bank payment
                                  </p>

                                </div>

                                <span className="text-pink-500">
                                  →
                                </span>

                              </div>

                            </button>

                          </div>

                        )}

                      </div>

                    </div>

                  )}

                </div>

              </div>

            </div>

          </div>


          {/* =======================================
              RIGHT SIDE - ORDER SUMMARY
          ======================================== */}

          <div className="lg:sticky lg:top-24">

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

              <div className="px-6 py-5 border-b border-gray-100">

                <h2 className="text-xl font-bold text-gray-800">
                  Order Summary
                </h2>

              </div>


              <div className="p-6">

                {/* PRODUCTS */}

                <div className="space-y-5">

                  {cart.map((item) => (

                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-4"
                    >

                      <div className="min-w-0">

                        <p className="font-medium text-gray-800">
                          {item.name}
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          Qty: {item.quantity}
                        </p>

                      </div>


                      <p className="font-semibold text-gray-800 whitespace-nowrap">

                        ₹
                        {(
                          Number(item.price || 0) *
                          item.quantity
                        ).toFixed(0)}

                      </p>

                    </div>

                  ))}

                </div>


                <div className="border-t border-gray-200 my-6"></div>


                {/* ITEM COUNT */}

                <div className="flex justify-between mb-4">

                  <span className="text-gray-600">
                    Items
                  </span>

                  <span className="font-medium text-gray-800">
                    {totalItems}
                  </span>

                </div>


                {/* DELIVERY */}

                <div className="flex justify-between mb-4">

                  <span className="text-gray-600">
                    Delivery
                  </span>

                  <span className="font-semibold text-green-600">
                    Free
                  </span>

                </div>


                <div className="border-t border-gray-200 my-5"></div>


                {/* TOTAL */}

                <div className="flex items-center justify-between">

                  <span className="text-lg font-bold text-gray-800">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-pink-600">
                    ₹{totalPrice.toFixed(0)}
                  </span>

                </div>


                {/* PLACE ORDER */}

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="w-full mt-7 py-4 bg-pink-500 hover:bg-pink-600 text-white font-semibold text-base md:text-lg rounded-xl transition shadow-sm"
                >

                  {paymentMethod === "COD"
                    ? "Place Order"
                    : "Continue to Pay"}

                </button>


                {/* SECURITY */}

                <div className="flex items-center justify-center gap-2 mt-5 text-xs text-gray-500">

                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >

                    <rect
                      x="5"
                      y="10"
                      width="14"
                      height="10"
                      rx="2"
                      strokeWidth="2"
                    />

                    <path
                      strokeWidth="2"
                      d="M8 10V7a4 4 0 018 0v3"
                    />

                  </svg>

                  Secure & safe checkout

                </div>


                <Link
                  to="/checkout"
                  className="block text-center mt-5 text-sm font-medium text-pink-500 hover:text-pink-600"
                >
                  ← Change Delivery Address
                </Link>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Payment;
