import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function AdminLogin() {
const navigate = useNavigate();

const API = import.meta.env.VITE_API_URL;

const [formData, setFormData] = useState({
email: "",
password: "",
});

const [error, setError] = useState("");
const [message, setMessage] = useState("");
const [loading, setLoading] = useState(false);

const handleChange = (event) => {
setFormData((previous) => ({
...previous,
[event.target.name]: event.target.value,
}));

```
setError("");
```

};

const handleSubmit = async (event) => {
event.preventDefault();

setError("");
setMessage("");
setLoading(true);

try {
  const response = await axios.post(
    `${API}/api/login`,
    {
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      login_type: "admin",
    },
    {
      withCredentials: true,
    }
  );

  const userResponse = await axios.get(
    `${API}/api/me`,
    {
      withCredentials: true,
    }
  );

  const user = userResponse.data;

  if (!user.logged_in) {
    setError(
      "Login successful, but admin session was not created. Please try again."
    );
    return;
  }

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
} catch (err) {
  const status = err.response?.status;

  const backendMessage =
    err.response?.data?.message ||
    err.response?.data?.error;

  if (status === 401) {
    setError(
      backendMessage ||
        "Invalid admin email or password."
    );
  } else if (status === 403) {
    setError(
      backendMessage ||
        "You are not authorized to access the admin dashboard."
    );
  } else if (status === 404) {
    setError(
      "Admin login service was not found. Please check the backend."
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

return ( <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-pink-200 px-4"> <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">


    <div className="flex justify-center mb-4">
      <div className="w-16 h-16 flex items-center justify-center rounded-full bg-purple-100 text-3xl">
        👑
      </div>
    </div>

    <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
      Admin Login
    </h2>

    <p className="text-center text-gray-500 mb-7">
      Access the MyCraftopia administration panel
    </p>

    <div className="mb-6 p-3 rounded-lg bg-purple-50 border border-purple-100 text-purple-700 text-sm text-center">
      🔒 Authorized administrators only
    </div>

    {message && (
      <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-center">
        {message}
      </div>
    )}

    {error && (
      <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-center">
        {error}
      </div>
    )}

    <form onSubmit={handleSubmit}>
      <div className="mb-5">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Admin Email
        </label>

        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter admin email"
          required
          autoComplete="email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:outline-none"
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Admin Password
        </label>

        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter admin password"
          required
          autoComplete="current-password"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Signing in..." : "Admin Login 👑"}
      </button>
    </form>

    <div className="mt-6 text-center">
      <p className="text-sm text-gray-500">
        Are you a regular user?
      </p>

      <Link
        to="/login"
        className="inline-block mt-2 text-pink-500 font-semibold hover:text-pink-600 transition"
      >
        ← Go to User Login
      </Link>
    </div>

  </div>
</section>


);
}

export default AdminLogin;
