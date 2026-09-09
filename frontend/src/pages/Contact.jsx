import { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Backend contact API will be connected later.
    console.log("Contact form:", formData);
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">
            Contact <span className="text-pink-500">Us</span>
          </h2>

          <p className="mt-3 text-gray-600">
            We'd love to hear from you. Get in touch with MyCraftopia.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">

          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-md p-8">

            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Get In Touch
            </h3>

            <div className="space-y-6">

              <div>
                <h4 className="font-semibold text-pink-500">
                  Email
                </h4>

                <p className="text-gray-600 mt-1">
                  support@mycraftopia.com
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-pink-500">
                  Phone
                </h4>

                <p className="text-gray-600 mt-1">
                  +91 98765 43210
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-pink-500">
                  Address
                </h4>

                <p className="text-gray-600 mt-1">
                  MyCraftopia Creative Studio
                </p>
              </div>

            </div>

          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-md p-8">

            <form onSubmit={handleSubmit}>

              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Name
                </label>

                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Subject
                </label>

                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg transition"
              >
                Send Message
              </button>

            </form>

          </div>

        </div>
      </div>
    </section>
  );
}

export default Contact;