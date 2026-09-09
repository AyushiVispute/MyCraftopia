import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "${import.meta.env.VITE_API_URL}/api/login",
        formData,
        {
          withCredentials: true,
        }
      );

      setMessage(response.data.message || "Login successful!");
      window.dispatchEvent(new Event("auth-changed"));

      // Go to home page after successful login
      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.response?.data?.message ||
        "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-100 via-pink-200 to-pink-300">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Back 👋
        </h2>

        <p className="text-center text-gray-600 mb-8">
          Login to continue your creative journey
        </p>

        {/* Success Message */}
        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
            {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
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

          {/* Password */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>

            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none"
            />
          </div>

          {/* Remember Me + Forgot */}
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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 text-center text-gray-400">
          or continue with
        </div>

        {/* Social Login */}
        <div className="flex justify-center gap-4">

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

        {/* Signup Link */}
        <p className="text-center text-gray-600 mt-6 text-sm">
          New user?{" "}
          <Link
            to="/signup"
            className="text-pink-500 font-semibold hover:text-pink-600 transition"
          >
            Create an account
          </Link>
        </p>

      </div>
    </section>
  );
}

export default Login;
