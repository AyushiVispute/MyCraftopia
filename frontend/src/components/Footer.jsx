import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 mt-10">
      <div className="container mx-auto px-6">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img
                src="/images/logo.png"
                alt="MyCraftopia Logo"
                className="h-12 w-12 rounded-full border-2 border-pink-500 object-cover"
              />

              <span className="text-2xl font-bold text-pink-500">
                MyCraftopia
              </span>
            </div>

            <p className="text-gray-400 leading-relaxed">
              Explore your creativity with MyCraftopia.
              Learn, create and discover amazing art and
              craft ideas with us.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Quick Links
            </h3>

            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="hover:text-pink-500 transition"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/classes"
                  className="hover:text-pink-500 transition"
                >
                  Classes
                </Link>
              </li>

              <li>
                <Link
                  to="/shop"
                  className="hover:text-pink-500 transition"
                >
                  Shop
                </Link>
              </li>

              <li>
                <Link
                  to="/mycard"
                  className="hover:text-pink-500 transition"
                >
                  MyCart
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="hover:text-pink-500 transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Newsletter
            </h3>

            <p className="text-gray-400 mb-4">
              Subscribe to receive our latest updates,
              creative ideas and offers.
            </p>

            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 rounded-l-lg text-gray-800 focus:outline-none"
              />

              <button
                type="button"
                className="px-4 py-2 bg-pink-500 text-white rounded-r-lg hover:bg-pink-600 transition"
              >
                Subscribe
              </button>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Social Links
            </h3>

            <div className="flex space-x-4">

              <a
                href="#"
                className="hover:text-pink-500 transition"
                aria-label="Instagram"
              >
                Instagram
              </a>

              <a
                href="#"
                className="hover:text-pink-500 transition"
                aria-label="Facebook"
              >
                Facebook
              </a>

              <a
                href="#"
                className="hover:text-pink-500 transition"
                aria-label="Twitter"
              >
                Twitter
              </a>

            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center">
          <p className="text-gray-400">
            © 2025 MyCraftopia. All rights reserved.
          </p>

          <p className="mt-2 text-gray-400">
            Made with ❤️ by Ayushi Vispute
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;