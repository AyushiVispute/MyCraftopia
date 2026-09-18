
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  // API URL
  const API = import.meta.env.VITE_API_URL;

  // User / Admin
  const [loginType, setLoginType] = useState("user");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ==============================
  // HANDLE INPUT CHANGE
  // ==============================
  const handleChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));

    setError("");
    setMessage("");
  };

  // ==============================
  // SWITCH USER / ADMIN
  // ==============================
  const handleLoginTypeChange = (type) => {
    setLoginType(type);

    // Clear old messages
    setMessage("");
    setError("");

    // Clear email and password
    setFormData({
      email: "",
      password: "",
    });
  };

  // ==============================
  // HANDLE LOGIN
  // ==============================
  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      // ==========================================
      // STEP 1: LOGIN
      // ==========================================
      const loginResponse = await axios.post(
        `${API}/api/login`,
        {
          email: formData.email.trim().toLowerCase(),
          password: formData.password,

          // VERY IMPORTANT
          // Sends "user" or "admin"
          login_type: loginType,
        },
        {
          withCredentials: true,
        }
      );


      // ==========================================
      // STEP 2: CHECK SESSION
      // ==========================================
      const userResponse = await axios.get(
        `${API}/api/me`,
        {
          withCredentials: true,
        }
      );


      const user = userResponse.data;

      // ==========================================
      // STEP 3: SESSION CHECK
      // ==========================================
      if (!user.logged_in) {
        setError(
          "Login successful, but session was not created. Please try again."
        );
        return;
      }

      // ==========================================
      // STEP 4: ADMIN LOGIN
      // ==========================================
      if (loginType === "admin") {
        if (!user.is_admin) {
          setError(
            "You are not authorized to access the admin dashboard."
          );
          return;
        }

        setMessage("Admin login successful! 👑");

        window.dispatchEvent(new Event("auth-changed"));

        setTimeout(() => {
          navigate("/dashboard");
        }, 700);

        return;
      }

      // ==========================================
      // STEP 5: NORMAL USER LOGIN
      // ==========================================
      if (user.is_admin) {
        setError(
          "This is an admin account. Please select Admin Login."
        );
        return;
      }

      setMessage("Login successful! 🎉");

      window.dispatchEvent(new Event("auth-changed"));

      setTimeout(() => {
        navigate("/");
      }, 700);

    } catch (err) {

      const status = err.response?.status;

      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error;

      if (status === 401) {
        setError(
          backendMessage ||
            "Invalid email or password. Please try again."
        );
      } else if (status === 403) {
        setError(
          backendMessage ||
            "You are not authorized to access the admin dashboard."
        );
      } else if (status === 404) {
        setError(
          "Login service was not found. Please check the backend URL."
        );
      } else {
        setError(
          backendMessage ||
            "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-100 via-pink-200 to-pink-300 px-4 py-8">

      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">

        {/* ==============================
            TITLE
        ============================== */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-3">
          Welcome Back 👋
        </h2>

        <p className="text-center text-gray-600 mb-6">
          Login to continue your creative journey
        </p>

        {/* ==============================
            USER / ADMIN SWITCH
        ============================== */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">

          {/* USER */}
          <button
            type="button"
            onClick={() => handleLoginTypeChange("user")}
            className={`w-1/2 py-3 rounded-lg font-semibold transition-all duration-200 ${
              loginType === "user"
                ? "bg-white text-pink-500 shadow"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            👤 User
          </button>

          {/* ADMIN */}
          <button
            type="button"
            onClick={() => handleLoginTypeChange("admin")}
            className={`w-1/2 py-3 rounded-lg font-semibold transition-all duration-200 ${
              loginType === "admin"
                ? "bg-white text-purple-600 shadow"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            👑 Admin
          </button>

        </div>

        {/* ==============================
            LOGIN TYPE MESSAGE
        ============================== */}
        <div
          className={`mb-5 p-3 rounded-lg text-center text-sm ${
            loginType === "admin"
              ? "bg-purple-50 text-purple-700"
              : "bg-pink-50 text-pink-700"
          }`}
        >
          {loginType === "admin"
            ? "Administrator Login — Authorized admins only"
            : "User Login — Login with your MyCraftopia account"}
        </div>

        {/* ==============================
            SUCCESS MESSAGE
        ============================== */}
        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
            {message}
          </div>
        )}

        {/* ==============================
            ERROR MESSAGE
        ============================== */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* ==============================
            LOGIN FORM
        ============================== */}
        <form onSubmit={handleSubmit}>

          {/* EMAIL */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {loginType === "admin"
                ? "Admin Email Address"
                : "Email Address"}
            </label>

            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={
                loginType === "admin"
                  ? "Enter admin email"
                  : "Enter your email"
              }
              required
              autoComplete="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 focus:outline-none"
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {loginType === "admin"
                ? "Admin Password"
                : "Password"}
            </label>

            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={
                loginType === "admin"
                  ? "Enter admin password"
                  : "Enter your password"
              }
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400 focus:outline-none"
            />
          </div>

          {/* REMEMBER ME + FORGOT PASSWORD */}
          {loginType === "user" && (
            <div className="flex items-center justify-between mb-6">

              <label className="flex items-center text-sm text-gray-600">
                <input
                  type="checkbox"
                  className="mr-2 rounded border-gray-300"
                />
                Remember me
              </label>

              <Link
                to="/forgot-password"
                className="text-sm text-pink-500 hover:underline"
              >
                Forgot Password?
              </Link>

            </div>
          )}

          {/* ADMIN SECURITY MESSAGE */}
          {loginType === "admin" && (
            <div className="mb-6 text-xs text-gray-500 text-center">
              🔒 Admin access is restricted to authorized administrators.
            </div>
          )}

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-semibold py-3 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed ${
              loginType === "admin"
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-pink-500 hover:bg-pink-600"
            }`}
          >
            {loading
              ? "Logging in..."
              : loginType === "admin"
              ? "Admin Login 👑"
              : "Login"}
          </button>
        </form>

        {/* ==============================
            SOCIAL LOGIN
            USER ONLY
        ============================== */}
        {loginType === "user" && (
          <>
            <div className="my-6 text-center text-gray-400">
              or continue with
            </div>

            <div className="flex justify-center gap-4">

              {/* GOOGLE */}
              <button
                type="button"
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 flex items-center"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/281/281764.png"
                  className="w-5 h-5 mr-2"
                  alt="Google"
                />
                Google
              </button>

              {/* FACEBOOK */}
              <button
                type="button"
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 flex items-center"
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
                  className="w-5 h-5 mr-2"
                  alt="Facebook"
                />
                Facebook
              </button>

            </div>

            {/* ==============================
                SIGNUP LINK
            ============================== */}
            <p className="text-center text-gray-600 mt-6 text-sm">
              New user?{" "}
              <Link
                to="/signup"
                className="text-pink-500 font-semibold hover:text-pink-600 transition"
              >
                Create an account
              </Link>
            </p>
          </>
        )}

        {/* ==============================
            ADMIN FOOTER
        ============================== */}
        {loginType === "admin" && (
          <p className="text-center text-gray-400 mt-6 text-xs">
            MyCraftopia Administration
          </p>
        )}

      </div>
    </section>
  );
}

export default Login;

