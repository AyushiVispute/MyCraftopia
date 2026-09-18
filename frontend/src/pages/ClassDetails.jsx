import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

function ClassDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [classItem, setClassItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClass = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${API}/api/classes/${id}`
        );

        setClassItem(res.data);
        setError("");
      } catch (err) {
        console.error("Error fetching class:", err);
        setError("Class not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchClass();
  }, [id]);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading class...
      </div>
    );
  }

  // Error
  if (error || !classItem) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">
          {error || "Class not found."}
        </p>

        <Link
          to="/classes"
          className="text-pink-500 hover:underline"
        >
          Back to Classes
        </Link>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6 max-w-5xl">

        {/* Back */}
        <Link
          to="/classes"
          className="text-pink-500 hover:underline text-sm"
        >
          ← Back to Classes
        </Link>

        {/* Main Card */}
        <div className="mt-6 bg-white rounded-2xl shadow-md overflow-hidden md:flex">

          {/* Image */}
          <div className="md:w-1/2">
            <img
              src={classItem.image}
              alt={classItem.name}
              className="w-full h-80 md:h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="p-8 flex-1">

            <span className="text-xs font-semibold text-pink-500 uppercase tracking-wide">
              {classItem.category} • {classItem.level}
            </span>

            <h1 className="text-3xl font-bold text-gray-800 mt-2">
              {classItem.name}
            </h1>

            <p className="mt-4 text-gray-600 leading-relaxed">
              {classItem.desc}
            </p>

            {/* Enroll */}
            <button
              onClick={() => navigate("/contact")}
              className="mt-8 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-semibold transition"
            >
              Enroll Now
            </button>

            <p className="mt-3 text-xs text-gray-400">
              Enrollment currently goes through our contact form.
            </p>

          </div>
        </div>
      </div>
    </section>
  );
}

export default ClassDetails;