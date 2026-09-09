import { useEffect, useMemo, useState } from "react";
import axios from "axios";

function Classes() {
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          "${import.meta.env.VITE_API_URL}/api/classes"
        );

        setClasses(response.data);
        setError("");
      } catch (err) {
        console.error("Error fetching classes:", err);
        setError("Unable to load classes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const filteredClasses = useMemo(() => {
    return classes.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.desc.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "" || item.category === category;

      const matchesLevel =
        level === "" || item.level === level;

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [classes, search, category, level]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
            Our <span className="text-pink-500">Classes</span>
          </h2>

          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Explore creative and fun workshops led by expert instructors.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">

          <input
            type="text"
            placeholder="Search classes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring focus:ring-pink-200"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">All Categories</option>
            <option value="Painting">Painting</option>
            <option value="Craft Kits">Craft Kits</option>
            <option value="Knitting">Knitting</option>
            <option value="Sewing">Sewing</option>
            <option value="Baking">Baking</option>
          </select>

          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <button
            onClick={() => {
              setSearch("");
              setCategory("");
              setLevel("");
            }}
            className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
          >
            Filter
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-10 text-gray-500">
            Loading classes...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-10 text-red-500">
            {error}
          </div>
        )}

        {/* Classes */}
        {!loading && !error && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {filteredClasses.length > 0 ? (
              filteredClasses.map((item) => {

                const imagePath = item.image
                  ?.replace("./", "")
                  .replace("images/", "");

                return (
                  <div
                    key={item.id}
                    className="card-hover bg-white rounded-2xl shadow-md overflow-hidden"
                  >

                    {/* Image */}
                    <img
                      src={`/images/${imagePath}`}
                      alt={item.name}
                      className="w-full h-56 object-cover"
                    />

                    {/* Content */}
                    <div className="p-6">

                      <h3 className="text-2xl font-semibold text-gray-800">
                        {item.name}
                      </h3>

                      <p className="mt-2 text-gray-600">
                        {item.desc?.length > 120
                          ? `${item.desc.substring(0, 120)}...`
                          : item.desc}
                      </p>

                      <p className="mt-2 text-sm text-gray-500">
                        {item.category} • {item.level}
                      </p>

                      <button
                        className="inline-block mt-4 px-5 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
                      >
                        Join Now
                      </button>

                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-3 text-center text-gray-500">
                😢 No classes found. Try adjusting your filters.
              </div>
            )}

          </div>
        )}
      </div>

      <style>{`
        .card-hover {
          transition: all 0.3s ease;
        }

        .card-hover:hover {
          transform: scale(1.05) translateY(-6px);
          box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </section>
  );
}

export default Classes;
