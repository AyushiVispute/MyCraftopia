import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Classes() {
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // FETCH CLASSES
  // =========================
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        setError("");

        const apiUrl = import.meta.env.VITE_API_URL;

        const response = await axios.get(
          `${apiUrl}/api/classes`
        );

        const data = response.data;

        // Handle both:
        // [ {...}, {...} ]
        // and
        // { classes: [ {...}, {...} ] }
        if (Array.isArray(data)) {
          setClasses(data);
        } else if (Array.isArray(data?.classes)) {
          setClasses(data.classes);
        } else {
          setClasses([]);
          setError("Invalid classes data received from server.");
        }
      } catch (err) {
        setClasses([]);
        setError(
          "Unable to load classes. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  // =========================
  // FILTER CLASSES
  // =========================
  const filteredClasses = useMemo(() => {
    return classes.filter((item) => {
      const name = String(item?.name || "");
      const desc = String(item?.desc || "");
      const itemCategory = String(item?.category || "");
      const itemLevel = String(item?.level || "");

      const searchText = search.toLowerCase();

      const matchesSearch =
        name.toLowerCase().includes(searchText) ||
        desc.toLowerCase().includes(searchText);

      const matchesCategory =
        category === "" ||
        itemCategory === category;

      const matchesLevel =
        level === "" ||
        itemLevel === level;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLevel
      );
    });
  }, [classes, search, category, level]);

  // =========================
  // CLEAR FILTERS
  // =========================
  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setLevel("");
  };

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6">

        {/* =========================
            HEADING
        ========================= */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
            Our{" "}
            <span className="text-pink-500">
              Classes
            </span>
          </h2>

          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Explore creative and fun workshops led by expert instructors.
          </p>
        </div>

        {/* =========================
            FILTERS
        ========================= */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">

          {/* Search */}
          <input
            type="text"
            placeholder="Search classes..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="px-4 py-2 border rounded-lg w-64 bg-white focus:outline-none focus:ring-2 focus:ring-pink-200"
          />

          {/* Category */}
          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="px-4 py-2 border rounded-lg bg-white"
          >
            <option value="">
              All Categories
            </option>
            <option value="Painting">
              Painting
            </option>
            <option value="Craft Kits">
              Craft Kits
            </option>
            <option value="Knitting">
              Knitting
            </option>
            <option value="Sewing">
              Sewing
            </option>
            <option value="Baking">
              Baking
            </option>
          </select>

          {/* Level */}
          <select
            value={level}
            onChange={(e) =>
              setLevel(e.target.value)
            }
            className="px-4 py-2 border rounded-lg bg-white"
          >
            <option value="">
              All Levels
            </option>
            <option value="Beginner">
              Beginner
            </option>
            <option value="Intermediate">
              Intermediate
            </option>
            <option value="Advanced">
              Advanced
            </option>
          </select>

          {/* Clear */}
          <button
            onClick={clearFilters}
            className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
          >
            Clear Filters
          </button>
        </div>

        {/* =========================
            LOADING
        ========================= */}
        {loading && (
          <div className="text-center py-10 text-gray-500">
            <p className="text-lg">
              Loading classes...
            </p>
          </div>
        )}

        {/* =========================
            ERROR
        ========================= */}
        {!loading && error && (
          <div className="text-center py-10">
            <p className="text-red-500 text-lg">
              {error}
            </p>
          </div>
        )}

        {/* =========================
            CLASSES
        ========================= */}
        {!loading && !error && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredClasses.length > 0 ? (
              filteredClasses.map((item) => {
                const imagePath = item?.image
                  ? item.image
                      .replace("./", "")
                      .replace("images/", "")
                  : "";

                return (
                  <Link
                    key={item.id}
                    to={`/classes/${item.id}`}
                    className="card-hover bg-white rounded-2xl shadow-md overflow-hidden block"
                  >
                    {/* Image */}
                    <img
                      src={item.image || "/images/default-class.jpg"}
                      alt={item.name || "Craft Class"}
                      className="w-full h-56 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/images/default-class.jpg";
                      }}
                    />

                    {/* Content */}
                    <div className="p-6">
                      {/* Name */}
                      <h3 className="text-2xl font-semibold text-gray-800">
                        {item.name || "Craft Class"}
                      </h3>

                      {/* Description */}
                      <p className="mt-2 text-gray-600">
                        {item.desc
                          ? item.desc.length > 120
                            ? `${item.desc.substring(0, 120)}...`
                            : item.desc
                          : "Learn creative skills with our expert instructors."}
                      </p>

                      {/* Category + Level */}
                      <p className="mt-2 text-sm text-gray-500">
                        {item.category || "Craft"} •{" "}
                        {item.level || "Beginner"}
                      </p>

                      {/* View Details */}
                      <span className="inline-block mt-4 px-5 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition">
                        View Details
                      </span>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500">
                <p className="text-lg">
                  😢 No classes found.
                </p>
                <p className="mt-2">
                  Try adjusting your filters.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* =========================
          CARD HOVER
      ========================= */}
      <style>{`
        .card-hover {
          transition: all 0.3s ease;
        }

        .card-hover:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </section>
  );
}

export default Classes;
