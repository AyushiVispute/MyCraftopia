import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navigate = useNavigate();
  const { totalItems } = useCart();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/me",
          {
            withCredentials: true,
          }
        );

        if (response.data.logged_in) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Session check failed:", error);
        setUser(null);
      }
    };

    checkLogin();

    window.addEventListener("auth-changed", checkLogin);

    return () => {
      window.removeEventListener("auth-changed", checkLogin);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/logout",
        {},
        {
          withCredentials: true,
        }
      );

      setUser(null);
      setProfileOpen(false);
      setMenuOpen(false);

      window.dispatchEvent(new Event("auth-changed"));

      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navLinkClass = ({ isActive }) =>
    `relative transition duration-200 ${
      isActive
        ? "text-pink-500 font-semibold"
        : "text-gray-700 hover:text-pink-500"
    }`;

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        <div className="h-20 flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 shrink-0"
          >
            <img
              src="/images/logo.png"
              alt="MyCraftopia Logo"
              className="h-12 w-12 rounded-full border-2 border-pink-500 object-cover"
            />

            <div className="hidden sm:block">
              <span className="text-2xl font-bold text-pink-500 tracking-tight">
                MyCraftopia
              </span>

              <p className="text-[10px] text-gray-400 tracking-widest uppercase">
                Create • Learn • Inspire
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">

            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>

            <NavLink to="/classes" className={navLinkClass}>
              Classes
            </NavLink>

            <NavLink to="/shop" className={navLinkClass}>
              Shop
            </NavLink>

            {/* Cart */}
            <NavLink
              to="/mycard"
              className={({ isActive }) =>
                `relative transition duration-200 ${
                  isActive
                    ? "text-pink-500 font-semibold"
                    : "text-gray-700 hover:text-pink-500"
                }`
              }
            >
              <span className="flex items-center gap-1.5">
                <span className="text-lg">🛒</span>
                <span>MyCart</span>

                {totalItems > 0 && (
                  <span className="absolute -top-3 -right-4 min-w-[19px] h-[19px] px-1 flex items-center justify-center bg-pink-500 text-white text-[10px] font-bold rounded-full">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </span>
            </NavLink>

            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>

            {/* User */}
            {user ? (
              <div className="relative">

                <button
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-pink-50 transition"
                >
                  <div className="h-9 w-9 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  <div className="text-left hidden xl:block">
                    <p className="text-xs text-gray-400">
                      Welcome
                    </p>

                    <p className="text-sm font-semibold text-gray-800 max-w-[120px] truncate">
                      {user.name}
                    </p>
                  </div>

                  <span className="text-gray-400 text-xs">
                    {profileOpen ? "▲" : "▼"}
                  </span>
                </button>

                {/* Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden">

                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-xs text-gray-400">
                        Signed in as
                      </p>

                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      to="/my-orders"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition"
                    >
                      📦 My Orders
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition"
                    >
                      👤 My Profile
                    </Link>

                    <Link
                      to="/saved-addresses"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-500 transition"
                    >
                      📍 Saved Addresses
                    </Link>

                    <div className="border-t border-gray-100 mt-1 pt-1">

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition"
                      >
                        ↪ Logout
                      </button>

                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm hover:shadow-md transition duration-200"
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile Controls */}
          <div className="flex lg:hidden items-center gap-3">

            <Link
              to="/mycard"
              className="relative text-gray-700 text-xl"
            >
              🛒

              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[17px] h-[17px] px-1 flex items-center justify-center bg-pink-500 text-white text-[9px] font-bold rounded-full">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 text-2xl px-2"
              aria-label="Toggle menu"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4">

            <div className="flex flex-col gap-1">

              <NavLink
                to="/"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl ${
                    isActive
                      ? "bg-pink-50 text-pink-500 font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/classes"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl ${
                    isActive
                      ? "bg-pink-50 text-pink-500 font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                Classes
              </NavLink>

              <NavLink
                to="/shop"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl ${
                    isActive
                      ? "bg-pink-50 text-pink-500 font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                Shop
              </NavLink>

              <NavLink
                to="/mycard"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl ${
                    isActive
                      ? "bg-pink-50 text-pink-500 font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                🛒 MyCart
                {totalItems > 0 && (
                  <span className="ml-2 text-xs bg-pink-500 text-white px-2 py-1 rounded-full">
                    {totalItems}
                  </span>
                )}
              </NavLink>

              <NavLink
                to="/contact"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl ${
                    isActive
                      ? "bg-pink-50 text-pink-500 font-semibold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                Contact
              </NavLink>

              {user ? (
                <>
                  <div className="border-t border-gray-100 my-2" />

                  <div className="px-4 py-3 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {user.name}
                      </p>

                      <p className="text-xs text-gray-400 truncate max-w-[220px]">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/my-orders"
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl"
                  >
                    📦 My Orders
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="text-left px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl"
                  >
                    ↪ Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="mt-2 text-center bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl font-semibold"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;