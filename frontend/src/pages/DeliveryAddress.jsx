import { useState } from "react";
import { useNavigate } from "react-router-dom";

function DeliveryAddress() {
  const navigate = useNavigate();

  const [address, setAddress] = useState(() => {
    try {
      const saved = localStorage.getItem("mycraftopia_delivery_address");
      return saved
        ? JSON.parse(saved)
        : {
            name: "",
            phone: "",
            address: "",
            city: "",
            state: "",
            pincode: "",
            addressType: "Home",
          };
    } catch {
      return {
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        addressType: "Home",
      };
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAddress((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleContinue = (e) => {
    e.preventDefault();

    localStorage.setItem(
      "mycraftopia_delivery_address",
      JSON.stringify(address)
    );

    navigate("/checkout/payment");
  };

  return (
    <section className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6 max-w-5xl">

        {/* Checkout Progress */}
        <div className="bg-white rounded-xl shadow-sm px-6 py-5 mb-6">
          <div className="flex items-center justify-center max-w-2xl mx-auto">

            {/* Step 1 */}
            <div className="flex items-center">
              <div className="w-9 h-9 rounded-full bg-pink-500 text-white flex items-center justify-center font-semibold">
                1
              </div>

              <span className="ml-2 font-semibold text-pink-500">
                Delivery
              </span>
            </div>

            {/* Line */}
            <div className="w-24 md:w-40 h-px bg-gray-300 mx-4"></div>

            {/* Step 2 */}
            <div className="flex items-center">
              <div className="w-9 h-9 rounded-full border-2 border-gray-300 text-gray-400 flex items-center justify-center font-semibold">
                2
              </div>

              <span className="ml-2 text-gray-400 font-medium">
                Payment
              </span>
            </div>

          </div>
        </div>


        {/* Page Heading */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Delivery Address
          </h1>

          <p className="text-gray-500 mt-1">
            Enter the address where you want your order delivered
          </p>
        </div>


        <div className="grid lg:grid-cols-3 gap-6 items-start">

          {/* Address Form */}
          <div className="lg:col-span-2">

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">

              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">
                  Add Delivery Address
                </h2>
              </div>


              <form onSubmit={handleContinue}>

                <div className="p-6">

                  {/* Name + Phone */}
                  <div className="grid md:grid-cols-2 gap-5 mb-5">

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                      </label>

                      <input
                        type="text"
                        name="name"
                        value={address.name}
                        onChange={handleChange}
                        placeholder="Enter full name"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                      />
                    </div>


                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Mobile Number
                      </label>

                      <input
                        type="tel"
                        name="phone"
                        value={address.phone}
                        onChange={handleChange}
                        placeholder="10 digit mobile number"
                        pattern="[0-9]{10}"
                        maxLength="10"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                      />
                    </div>

                  </div>


                  {/* Address */}
                  <div className="mb-5">

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Address
                    </label>

                    <textarea
                      name="address"
                      value={address.address}
                      onChange={handleChange}
                      rows="4"
                      placeholder="House No., Building, Street, Area"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none resize-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                    />

                  </div>


                  {/* City + State */}
                  <div className="grid md:grid-cols-2 gap-5 mb-5">

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City
                      </label>

                      <input
                        type="text"
                        name="city"
                        value={address.city}
                        onChange={handleChange}
                        placeholder="Enter city"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                      />
                    </div>


                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        State
                      </label>

                      <input
                        type="text"
                        name="state"
                        value={address.state}
                        onChange={handleChange}
                        placeholder="Enter state"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                      />
                    </div>

                  </div>


                  {/* Pincode */}
                  <div className="mb-6">

                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pincode
                    </label>

                    <input
                      type="text"
                      name="pincode"
                      value={address.pincode}
                      onChange={handleChange}
                      placeholder="6 digit pincode"
                      pattern="[0-9]{6}"
                      maxLength="6"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                    />

                  </div>


                  {/* Address Type */}
                  <div>

                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      Address Type
                    </p>

                    <div className="flex gap-3">

                      <label
                        className={`flex items-center gap-2 px-5 py-3 border rounded-lg cursor-pointer transition ${
                          address.addressType === "Home"
                            ? "border-pink-500 bg-pink-50 text-pink-600"
                            : "border-gray-300 text-gray-600"
                        }`}
                      >
                        <input
                          type="radio"
                          name="addressType"
                          value="Home"
                          checked={address.addressType === "Home"}
                          onChange={handleChange}
                          className="accent-pink-500"
                        />

                        <span>Home</span>
                      </label>


                      <label
                        className={`flex items-center gap-2 px-5 py-3 border rounded-lg cursor-pointer transition ${
                          address.addressType === "Work"
                            ? "border-pink-500 bg-pink-50 text-pink-600"
                            : "border-gray-300 text-gray-600"
                        }`}
                      >
                        <input
                          type="radio"
                          name="addressType"
                          value="Work"
                          checked={address.addressType === "Work"}
                          onChange={handleChange}
                          className="accent-pink-500"
                        />

                        <span>Work</span>
                      </label>

                    </div>

                  </div>

                </div>


                {/* Continue */}
                <div className="px-6 py-5 border-t border-gray-100 bg-gray-50 rounded-b-2xl">

                  <button
                    type="submit"
                    className="w-full md:w-auto md:min-w-[280px] bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3.5 px-8 rounded-lg transition"
                  >
                    Continue to Payment
                  </button>

                </div>

              </form>

            </div>

          </div>


          {/* Right Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

            <h3 className="text-lg font-bold text-gray-800 mb-5">
              Delivery Information
            </h3>

            <div className="space-y-5">

              <div className="flex gap-3">
                <div className="text-pink-500 font-bold">
                  ✓
                </div>

                <div>
                  <p className="font-medium text-gray-800">
                    Secure Delivery
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Your order will be delivered safely to this address.
                  </p>
                </div>
              </div>


              <div className="flex gap-3">
                <div className="text-pink-500 font-bold">
                  ✓
                </div>

                <div>
                  <p className="font-medium text-gray-800">
                    Free Delivery
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Delivery charges are currently free.
                  </p>
                </div>
              </div>


              <div className="flex gap-3">
                <div className="text-pink-500 font-bold">
                  ✓
                </div>

                <div>
                  <p className="font-medium text-gray-800">
                    Easy Checkout
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Continue to payment after saving your address.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default DeliveryAddress;