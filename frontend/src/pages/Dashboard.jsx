import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

// ============================================================
// Cloudinary Image Upload
// ============================================================

const uploadImage = async (file) => {
  if (!file) return "";

  const formData = new FormData();
  formData.append("image", file);

  const res = await axios.post(
    `${API}/api/upload-image`,
    formData,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data.url;
};

// ============================================================
// Empty Forms
// ============================================================

const emptyProduct = {
  name: "",
  price: "",
  category: "",
  image: "",
  desc: "",
};

const emptyClass = {
  name: "",
  category: "",
  level: "Beginner",
  image: "",
  desc: "",
};

const STATUSES = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

// ============================================================
// Dashboard
// ============================================================

function Dashboard() {
  const navigate = useNavigate();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [tab, setTab] = useState("products");
  const [message, setMessage] = useState("");

  const [products, setProducts] = useState([]);
  const [classes, setClasses] = useState([]);
  const [orders, setOrders] = useState([]);

  const [productForm, setProductForm] = useState(emptyProduct);
  const [editingProductId, setEditingProductId] = useState(null);

  const [classForm, setClassForm] = useState(emptyClass);
  const [editingClassId, setEditingClassId] = useState(null);

  // ============================================================
  // Admin Authentication
  // ============================================================

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await axios.get(`${API}/api/me`, {
  withCredentials: true,
});

console.log("CURRENT USER:", res.data);

if (res.data.id && res.data.is_admin) {
  setIsAdmin(true);
} else {
  navigate("/");
}
      } catch (error) {
        navigate("/");
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAdmin();
  }, [navigate]);

  // ============================================================
  // Load Data
  // ============================================================

  const loadProducts = async () => {
    try {
      const res = await axios.get(`${API}/api/products`);
      setProducts(res.data);
    } catch (error) {
    }
  };

  const loadClasses = async () => {
    try {
      const res = await axios.get(`${API}/api/classes`);
      setClasses(res.data);
    } catch (error) {
    }
  };

  const loadOrders = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/orders`, {
        withCredentials: true,
      });

      setOrders(res.data);
    } catch (error) {
    }
  };

  useEffect(() => {
    if (!isAdmin) return;

    loadProducts();
    loadClasses();
    loadOrders();
  }, [isAdmin]);

  // ============================================================
  // PRODUCT HANDLERS
  // ============================================================

  const submitProduct = async (e) => {
    e.preventDefault();

    try {
      // Make sure image is selected
      if (!productForm.image) {
        setMessage("Please upload a product image.");
        return;
      }

      if (editingProductId) {
        await axios.put(
          `${API}/api/products/${editingProductId}`,
          productForm,
          {
            withCredentials: true,
          }
        );

        setMessage("Product updated successfully.");
      } else {
        await axios.post(
          `${API}/api/products`,
          productForm,
          {
            withCredentials: true,
          }
        );

        setMessage("Product created successfully.");
      }

      setProductForm(emptyProduct);
      setEditingProductId(null);

      await loadProducts();
    } catch (err) {

      setMessage(
        err.response?.data?.error ||
          "Something went wrong while saving the product."
      );
    }
  };

  // ============================================================
  // PRODUCT IMAGE UPLOAD
  // ============================================================

  const handleProductImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      setMessage("Uploading product image...");

      const imageUrl = await uploadImage(file);

      setProductForm((prev) => ({
        ...prev,
        image: imageUrl,
      }));

      setMessage("Product image uploaded successfully.");
    } catch (err) {

      setMessage(
        err.response?.data?.error ||
          "Product image upload failed."
      );
    }
  };

  const editProduct = (p) => {
    setEditingProductId(p.id);

    setProductForm({
      name: p.name,
      price: p.price,
      category: p.category,
      image: p.image || "",
      desc: p.desc || "",
    });

    setMessage("");
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await axios.delete(`${API}/api/products/${id}`, {
        withCredentials: true,
      });

      setMessage("Product deleted.");
      loadProducts();
    } catch (err) {
      setMessage(
        err.response?.data?.error ||
          "Unable to delete product."
      );
    }
  };

  // ============================================================
  // CLASS HANDLERS
  // ============================================================

  const submitClass = async (e) => {
    e.preventDefault();

    try {
      // Make sure image is selected
      if (!classForm.image) {
        setMessage("Please upload a class image.");
        return;
      }

      if (editingClassId) {
        await axios.put(
          `${API}/api/classes/${editingClassId}`,
          classForm,
          {
            withCredentials: true,
          }
        );

        setMessage("Class updated successfully.");
      } else {
        await axios.post(
          `${API}/api/classes`,
          classForm,
          {
            withCredentials: true,
          }
        );

        setMessage("Class created successfully.");
      }

      setClassForm(emptyClass);
      setEditingClassId(null);

      await loadClasses();
    } catch (err) {

      setMessage(
        err.response?.data?.error ||
          "Something went wrong while saving the class."
      );
    }
  };

  // ============================================================
  // CLASS IMAGE UPLOAD
  // ============================================================

  const handleClassImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      setMessage("Uploading class image...");

      const imageUrl = await uploadImage(file);

      setClassForm((prev) => ({
        ...prev,
        image: imageUrl,
      }));

      setMessage("Class image uploaded successfully.");
    } catch (err) {

      setMessage(
        err.response?.data?.error ||
          "Class image upload failed."
      );
    }
  };

  const editClass = (c) => {
    setEditingClassId(c.id);

    setClassForm({
      name: c.name,
      category: c.category,
      level: c.level,
      image: c.image || "",
      desc: c.desc || "",
    });

    setMessage("");
  };

  const deleteClass = async (id) => {
    if (!window.confirm("Delete this class?")) return;

    try {
      await axios.delete(`${API}/api/classes/${id}`, {
        withCredentials: true,
      });

      setMessage("Class deleted.");
      loadClasses();
    } catch (err) {
      setMessage(
        err.response?.data?.error ||
          "Unable to delete class."
      );
    }
  };

  // ============================================================
  // ORDER STATUS
  // ============================================================

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(
        `${API}/api/admin/orders/${orderId}/status`,
        { status },
        {
          withCredentials: true,
        }
      );

      setMessage("Order status updated.");
      loadOrders();
    } catch (err) {
      setMessage(
        err.response?.data?.error ||
          "Unable to update order status."
      );
    }
  };

  // ============================================================
  // Loading
  // ============================================================

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Checking access...
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <section className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-6">

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Admin Dashboard
        </h1>

        {/* Message */}
        {message && (
          <div className="mb-4 px-4 py-3 bg-pink-50 text-pink-600 rounded-lg">
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {["products", "classes", "orders"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg font-semibold capitalize transition ${
                tab === t
                  ? "bg-pink-500 text-white"
                  : "bg-white text-gray-600 hover:bg-pink-50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* =====================================================
            PRODUCTS
        ====================================================== */}

        {tab === "products" && (
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Product Form */}
            <form
              onSubmit={submitProduct}
              className="bg-white p-6 rounded-2xl shadow-sm space-y-4 h-fit"
            >
              <h2 className="text-lg font-semibold text-gray-800">
                {editingProductId
                  ? "Edit Product"
                  : "Add Product"}
              </h2>

              {/* Name */}
              <input
                type="text"
                placeholder="Name"
                value={productForm.name}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    name: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border rounded-lg"
                required
              />

              {/* Price */}
              <input
                type="number"
                step="0.01"
                placeholder="Price"
                value={productForm.price}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    price: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border rounded-lg"
                required
              />

              {/* Category */}
              <input
                type="text"
                placeholder="Category"
                value={productForm.category}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    category: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border rounded-lg"
                required
              />

              {/* =================================================
                  PRODUCT IMAGE
              ================================================== */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProductImageUpload}
                  className="w-full px-4 py-2 border rounded-lg bg-white"
                />

                {/* Product Image Preview */}
                {productForm.image && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">
                      Image Preview
                    </p>

                    <img
                      src={productForm.image}
                      alt="Product Preview"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <textarea
                placeholder="Description"
                value={productForm.desc}
                rows={3}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    desc: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border rounded-lg"
              />

              {/* Buttons */}
              <div className="flex gap-3">

                <button
                  type="submit"
                  className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg font-semibold"
                >
                  {editingProductId
                    ? "Save Changes"
                    : "Add Product"}
                </button>

                {editingProductId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProductId(null);
                      setProductForm(emptyProduct);
                      setMessage("");
                    }}
                    className="px-4 py-2 border rounded-lg text-gray-600"
                  >
                    Cancel
                  </button>
                )}

              </div>
            </form>

            {/* Product Table */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden">

              <table className="w-full text-sm">

                <thead className="bg-gray-100 text-gray-600 text-left">
                  <tr>
                    <th className="px-4 py-3">
                      Name
                    </th>

                    <th className="px-4 py-3">
                      Price
                    </th>

                    <th className="px-4 py-3">
                      Category
                    </th>

                    <th className="px-4 py-3">
                      Image
                    </th>

                    <th className="px-4 py-3">
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {products.map((p) => (
                    <tr
                      key={p.id}
                      className="border-t"
                    >

                      <td className="px-4 py-3">
                        {p.name}
                      </td>

                      <td className="px-4 py-3">
                        ₹{p.price}
                      </td>

                      <td className="px-4 py-3">
                        {p.category}
                      </td>

                      {/* Product Thumbnail */}
                      <td className="px-4 py-3">

                        {p.image && (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        )}

                      </td>

                      <td className="px-4 py-3 text-right space-x-3">

                        <button
                          onClick={() => editProduct(p)}
                          className="text-pink-500 hover:underline"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            deleteProduct(p.id)
                          }
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          </div>
        )}

        {/* =====================================================
            CLASSES
        ====================================================== */}

        {tab === "classes" && (
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Class Form */}
            <form
              onSubmit={submitClass}
              className="bg-white p-6 rounded-2xl shadow-sm space-y-4 h-fit"
            >

              <h2 className="text-lg font-semibold text-gray-800">
                {editingClassId
                  ? "Edit Class"
                  : "Add Class"}
              </h2>

              {/* Name */}
              <input
                type="text"
                placeholder="Name"
                value={classForm.name}
                onChange={(e) =>
                  setClassForm({
                    ...classForm,
                    name: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border rounded-lg"
                required
              />

              {/* Category */}
              <input
                type="text"
                placeholder="Category"
                value={classForm.category}
                onChange={(e) =>
                  setClassForm({
                    ...classForm,
                    category: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border rounded-lg"
                required
              />

              {/* Level */}
              <select
                value={classForm.level}
                onChange={(e) =>
                  setClassForm({
                    ...classForm,
                    level: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>

              {/* =================================================
                  CLASS IMAGE
              ================================================== */}

              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleClassImageUpload}
                  className="w-full px-4 py-2 border rounded-lg bg-white"
                />

                {/* Class Image Preview */}
                {classForm.image && (
                  <div className="mt-3">

                    <p className="text-xs text-gray-500 mb-2">
                      Image Preview
                    </p>

                    <img
                      src={classForm.image}
                      alt="Class Preview"
                      className="w-32 h-32 object-cover rounded-lg border"
                    />

                  </div>
                )}

              </div>

              {/* Description */}
              <textarea
                placeholder="Description"
                value={classForm.desc}
                rows={3}
                onChange={(e) =>
                  setClassForm({
                    ...classForm,
                    desc: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border rounded-lg"
              />

              {/* Buttons */}
              <div className="flex gap-3">

                <button
                  type="submit"
                  className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg font-semibold"
                >
                  {editingClassId
                    ? "Save Changes"
                    : "Add Class"}
                </button>

                {editingClassId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingClassId(null);
                      setClassForm(emptyClass);
                      setMessage("");
                    }}
                    className="px-4 py-2 border rounded-lg text-gray-600"
                  >
                    Cancel
                  </button>
                )}

              </div>

            </form>

            {/* Classes Table */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden">

              <table className="w-full text-sm">

                <thead className="bg-gray-100 text-gray-600 text-left">
                  <tr>

                    <th className="px-4 py-3">
                      Name
                    </th>

                    <th className="px-4 py-3">
                      Category
                    </th>

                    <th className="px-4 py-3">
                      Level
                    </th>

                    <th className="px-4 py-3">
                      Image
                    </th>

                    <th className="px-4 py-3">
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {classes.map((c) => (
                    <tr
                      key={c.id}
                      className="border-t"
                    >

                      <td className="px-4 py-3">
                        {c.name}
                      </td>

                      <td className="px-4 py-3">
                        {c.category}
                      </td>

                      <td className="px-4 py-3">
                        {c.level}
                      </td>

                      {/* Class Thumbnail */}
                      <td className="px-4 py-3">

                        {c.image && (
                          <img
                            src={c.image}
                            alt={c.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        )}

                      </td>

                      <td className="px-4 py-3 text-right space-x-3">

                        <button
                          onClick={() => editClass(c)}
                          className="text-pink-500 hover:underline"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            deleteClass(c.id)
                          }
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          </div>
        )}

        {/* =====================================================
            ORDERS
        ====================================================== */}

        {tab === "orders" && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

            <table className="w-full text-sm">

              <thead className="bg-gray-100 text-gray-600 text-left">

                <tr>

                  <th className="px-4 py-3">
                    Order #
                  </th>

                  <th className="px-4 py-3">
                    Customer
                  </th>

                  <th className="px-4 py-3">
                    Total
                  </th>

                  <th className="px-4 py-3">
                    Payment
                  </th>

                  <th className="px-4 py-3">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {orders.map((o) => (
                  <tr
                    key={o.id}
                    className="border-t"
                  >

                    <td className="px-4 py-3">
                      #{o.id}
                    </td>

                    <td className="px-4 py-3">

                      {o.name}

                      <br />

                      <span className="text-gray-400">
                        {o.phone}
                      </span>

                    </td>

                    <td className="px-4 py-3">
                      ₹{o.total_amount}
                    </td>

                    <td className="px-4 py-3">
                      {o.payment_method}
                    </td>

                    <td className="px-4 py-3">

                      <select
                        value={o.status}
                        onChange={(e) =>
                          updateStatus(
                            o.id,
                            e.target.value
                          )
                        }
                        className="px-3 py-1 border rounded-lg"
                      >

                        {STATUSES.map((s) => (
                          <option
                            key={s}
                            value={s}
                          >
                            {s}
                          </option>
                        ))}

                      </select>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>
    </section>
  );
}

export default Dashboard;