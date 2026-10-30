
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import {
  Swiper,
  SwiperSlide
} from "swiper/react";

import {
  Autoplay,
  Pagination,
  Navigation
} from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// =====================================
// IMAGE HELPER FOR PRODUCTS
// =====================================
const getProductImage = (image) => {
  if (!image) return "/images/default.jpg";

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  const cleanPath = image
    .replace(/^\.\/+/, "")
    .replace(/^images\//, "");

  return `/images/${cleanPath}`;
};

// =====================================
// HOME COMPONENT
// =====================================
function Home() {

  const [products, setProducts] = useState([]);
  const [classes, setClasses] = useState([]);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingClasses, setLoadingClasses] = useState(true);

  const [productError, setProductError] = useState("");
  const [classError, setClassError] = useState("");

  const API = import.meta.env.VITE_API_URL;

  // =====================================
  // FETCH PRODUCTS FROM FLASK
  // =====================================
  useEffect(() => {

    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${API}/api/products`
        );

        const data = response.data;

        const productList = Array.isArray(data)
          ? data
          : Array.isArray(data?.products)
            ? data.products
            : [];

        setProducts(productList);

      } catch (error) {
        console.error("Products fetching error:", error);
        setProductError("Unable to load products.");
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();

  }, [API]);

  // =====================================
  // FETCH CLASSES FROM FLASK
  // =====================================
  useEffect(() => {

    const fetchClasses = async () => {
      try {
        const response = await axios.get(
          `${API}/api/classes`
        );

        const data = response.data;

        const classList = Array.isArray(data)
          ? data
          : Array.isArray(data?.classes)
            ? data.classes
            : [];

        setClasses(classList);

      } catch (error) {
        console.error("Classes fetching error:", error);
        setClassError("Unable to load classes.");
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchClasses();

  }, [API]);

  // =====================================
  // CATEGORY DATA
  // =====================================
  const categories = [
    { name: "Craft Kits", icon: "🎨" },
    { name: "Knitting", icon: "🧶" },
    { name: "Sewing", icon: "🪡" },
    { name: "Painting", icon: "🖌️" },
    { name: "Quilting", icon: "🧵" },
  ];

  // =====================================
  // RETURN
  // =====================================
  return (
    <>

      {/* =====================================
          HERO SLIDER
          ORIGINAL DESIGN - UNCHANGED
      ===================================== */}

      <section className="bg-white">

        <Swiper
          className="mySwiper"
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false
          }}
          pagination={{
            clickable: true
          }}
          navigation={true}
          modules={[
            Autoplay,
            Pagination,
            Navigation
          ]}
        >

          {/* Slide 1 */}

          <SwiperSlide>
            <div
              className="relative h-[80vh] flex items-center justify-center bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('src/images/1.jpg')"
              }}
            >

              <div className="absolute inset-0 bg-black/40"></div>

              <div className="relative z-10 text-center text-white px-6 md:px-12">

                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Find Creativity to <br />
                  <span className="text-pink-400">
                    make happy
                  </span>
                </h1>

                <p className="mt-4 text-lg md:text-2xl">
                  Take a variety of interesting and fun classes.
                </p>

                <a
                  href="/login"
                  className="inline-block mt-6 px-8 py-4 bg-pink-500 text-white rounded-lg shadow-lg hover:bg-pink-600 transition"
                >
                  JOIN US
                </a>

              </div>
            </div>
          </SwiperSlide>


          {/* Slide 2 */}

          <SwiperSlide>
            <div
              className="relative h-[80vh] flex items-center justify-center bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('src/images/2.jpg')"
              }}
            >

              <div className="absolute inset-0 bg-black/40"></div>

              <div className="relative z-10 text-center text-white px-6 md:px-12">

                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Explore{" "}
                  <span className="text-pink-400">
                    Art & Craft
                  </span>
                </h1>

                <p className="mt-4 text-lg md:text-2xl">
                  Join hands-on creative workshops anytime.
                </p>

                <a
                  href="/classes"
                  className="inline-block mt-6 px-8 py-4 bg-pink-500 text-white rounded-lg shadow-lg hover:bg-pink-600 transition"
                >
                  VIEW CLASSES
                </a>

              </div>
            </div>
          </SwiperSlide>


          {/* Slide 3 */}

          <SwiperSlide>
            <div
              className="relative h-[80vh] flex items-center justify-center bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('src/images/3.webp')"
              }}
            >

              <div className="absolute inset-0 bg-black/40"></div>

              <div className="relative z-10 text-center text-white px-6 md:px-12">

                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Learn with{" "}
                  <span className="text-pink-400">
                    Experts
                  </span>
                </h1>

                <p className="mt-4 text-lg md:text-2xl">
                  Discover tutorials and classes from top instructors.
                </p>

                <a
                  href="/shop"
                  className="inline-block mt-6 px-8 py-4 bg-pink-500 text-white rounded-lg shadow-lg hover:bg-pink-600 transition"
                >
                  START LEARNING
                </a>

              </div>
            </div>
          </SwiperSlide>

        </Swiper>
      </section>


      {/* =====================================
          WELCOME SECTION
      ===================================== */}

      <section className="py-16 px-6 bg-[#fffaf7]">

        <div className="max-w-4xl mx-auto text-center">

          <p className="text-pink-500 font-semibold tracking-widest uppercase">
            A Little World of Creativity
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-3">
            Welcome to MyCraftopia
          </h2>

          <p className="text-gray-600 text-lg mt-5 leading-8">
            Your happy place for handmade treasures, creative
            craft kits and inspiring learning experiences.
            Discover the joy of creating something beautiful
            with your own hands.
          </p>

        </div>

      </section>


      {/* =====================================
          LIVE STATISTICS
      ===================================== */}

      <section className="py-12 bg-[#fdf0ec]">

        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

          <div>
            <h2 className="text-4xl font-bold text-pink-500">
              {products.length}+
            </h2>
            <p className="mt-2 text-gray-700 text-lg">
              Handmade Products
            </p>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-pink-500">
              {classes.length}+
            </h2>
            <p className="mt-2 text-gray-700 text-lg">
              Creative Classes
            </p>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-pink-500">
              {categories.length}+
            </h2>
            <p className="mt-2 text-gray-700 text-lg">
              Craft Categories
            </p>
          </div>

        </div>

      </section>


      {/* =====================================
          SHOP BY CATEGORY
      ===================================== */}

      <section className="py-20 px-6 bg-white">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-12">

            <p className="text-pink-500 font-semibold tracking-wider">
              EXPLORE YOUR INTERESTS
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-3">
              Shop By Category
            </h2>

            <p className="text-gray-600 mt-3">
              Find everything you need for your next creative project.
            </p>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">

            {categories.map((item) => (

              <Link
                key={item.name}
                to={`/shop?category=${encodeURIComponent(item.name)}`}
                className="bg-[#fff5f2] rounded-2xl p-7 text-center shadow-sm hover:shadow-xl hover:-translate-y-2 transition duration-300"
              >

                <div className="text-5xl">
                  {item.icon}
                </div>

                <h3 className="font-bold text-lg mt-4 text-gray-800">
                  {item.name}
                </h3>

                <p className="text-pink-500 mt-3 text-sm font-semibold">
                  Explore →
                </p>

              </Link>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================
          TRENDING PRODUCTS
          FETCH FROM SHOP API
      ===================================== */}

      <section className="py-20 px-6 bg-[#fffaf7]">

        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12">

            <div>

              <p className="text-pink-500 font-semibold tracking-wider">
                HANDPICKED FOR YOU
              </p>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-3">
                ✨ Trending Products
              </h2>

              <p className="text-gray-600 mt-3">
                Beautiful handmade products made with love.
              </p>

            </div>

            <Link
              to="/shop"
              className="px-7 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition shadow-md"
            >
              View All Products →
            </Link>

          </div>


          {loadingProducts ? (

            <p className="text-center py-12 text-gray-500">
              Loading products...
            </p>

          ) : productError ? (

            <p className="text-center py-12 text-red-500">
              {productError}
            </p>

          ) : products.length > 0 ? (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">

              {products.slice(0, 4).map((product) => (

                <div
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-2 transition duration-300 group"
                >

                  <Link to={`/shop/${product.id}`}>

                    <div className="h-64 overflow-hidden bg-gray-100">

                      <img
                        src={getProductImage(product.image)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        onError={(e) => {
                          e.currentTarget.src = "/images/default.jpg";
                        }}
                      />

                    </div>

                  </Link>


                  <div className="p-5">

                    <span className="text-sm text-pink-500 font-semibold">
                      {product.category}
                    </span>

                    <Link to={`/shop/${product.id}`}>

                      <h3 className="font-bold text-lg mt-2 text-gray-800 hover:text-pink-500 transition">
                        {product.name}
                      </h3>

                    </Link>

                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                      {product.desc}
                    </p>

                    <div className="flex justify-between items-center mt-5">

                      <span className="text-pink-600 font-bold text-xl">
                        ₹{Number(product.price).toFixed(0)}
                      </span>

                      <Link
                        to={`/shop/${product.id}`}
                        className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition text-sm"
                      >
                        View Product
                      </Link>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          ) : (

            <p className="text-center py-12 text-gray-500">
              No products available.
            </p>

          )}

        </div>

      </section>


      {/* =====================================
          EXPLORE CLASSES
          FETCH FROM CLASSES API
      ===================================== */}

      <section className="py-20 px-6 bg-[#fdf0ec]">

        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12">

            <div>

              <p className="text-pink-500 font-semibold tracking-wider">
                LEARN SOMETHING NEW
              </p>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-3">
                Explore Our Classes
              </h2>

              <p className="text-gray-600 mt-3">
                Learn new skills and discover your creativity.
              </p>

            </div>

            <Link
              to="/classes"
              className="px-7 py-3 border-2 border-pink-500 text-pink-600 rounded-full hover:bg-pink-500 hover:text-white transition"
            >
              View All Classes →
            </Link>

          </div>


          {loadingClasses ? (

            <p className="text-center py-12 text-gray-500">
              Loading classes...
            </p>

          ) : classError ? (

            <p className="text-center py-12 text-red-500">
              {classError}
            </p>

          ) : classes.length > 0 ? (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

              {classes.slice(0, 3).map((item) => (

                <Link
                  key={item.id}
                  to={`/classes/${item.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-2 transition duration-300 group"
                >

                  <div className="h-64 overflow-hidden bg-gray-100">

                    <img
                      src={item.image || "/images/default-class.jpg"}
                      alt={item.name || "Craft Class"}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      onError={(e) => {
                        e.currentTarget.src = "/images/default-class.jpg";
                      }}
                    />

                  </div>


                  <div className="p-6">

                    <span className="text-pink-500 text-sm font-semibold">
                      {item.category || "Craft"}
                    </span>

                    <h3 className="text-xl font-bold mt-2 text-gray-800">
                      {item.name || "Creative Class"}
                    </h3>

                    <p className="text-gray-600 mt-3 line-clamp-3">
                      {item.desc || "Learn creative skills with our expert instructors."}
                    </p>

                    <div className="flex justify-between items-center mt-5">

                      <span className="text-sm text-gray-500">
                        {item.level || "Beginner"}
                      </span>

                      <span className="text-pink-600 font-semibold">
                        View Details →
                      </span>

                    </div>

                  </div>

                </Link>

              ))}

            </div>

          ) : (

            <p className="text-center py-12 text-gray-500">
              No classes available.
            </p>

          )}

        </div>

      </section>


      {/* =====================================
          WHY CHOOSE MYCRAFTOPIA
      ===================================== */}

      <section className="py-20 px-6 bg-white">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-14">

            <p className="text-pink-500 font-semibold tracking-wider">
              WHY MYCRAFTOPIA?
            </p>

            <h2 className="text-3xl md:text-4xl font-bold mt-3 text-gray-800">
              Made With Love, Shared With You
            </h2>

            <p className="text-gray-600 mt-3">
              More than shopping, it's a world of creativity.
            </p>

          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">

            {[
              {
                icon: "🎨",
                title: "Creative Products",
                desc: "Discover unique handmade products and craft supplies."
              },
              {
                icon: "💝",
                title: "Made With Love",
                desc: "Every creation brings its own special charm."
              },
              {
                icon: "🧶",
                title: "Learn New Skills",
                desc: "Join workshops and improve your creative skills."
              },
              {
                icon: "🛍️",
                title: "Easy Shopping",
                desc: "Enjoy a simple and convenient shopping experience."
              }
            ].map((item) => (

              <div
                key={item.title}
                className="bg-[#fff5f2] rounded-2xl p-8 text-center hover:shadow-lg transition duration-300"
              >

                <div className="text-5xl">
                  {item.icon}
                </div>

                <h3 className="font-bold text-lg mt-5 text-gray-800">
                  {item.title}
                </h3>

                <p className="text-gray-600 mt-3 leading-7">
                  {item.desc}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================
          TESTIMONIALS
          ORIGINAL PHOTOGRAPHS PRESERVED
      ===================================== */}

      <section
        className="relative py-20 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('src/images/bg1.pg.jpg')"
        }}
      >

        <div className="absolute inset-0 bg-white/70"></div>

        <div className="container mx-auto px-6 relative z-10">

          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            💬 What Our Students Say
          </h2>


          <Swiper
            className="testimonialSwiper"
            slidesPerView={1}
            spaceBetween={30}
            centeredSlides={true}
            loop={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false
            }}
            navigation={true}
            pagination={{
              clickable: true
            }}
            modules={[
              Autoplay,
              Pagination,
              Navigation
            ]}
          >

            {/* Testimonial 1 */}

            <SwiperSlide>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 max-w-2xl mx-auto text-center">

                <p className="text-gray-700 text-lg italic">
                  "HappyCraft classes are amazing! I learned so many new techniques and had so much fun."
                </p>

                <div className="mt-6 flex flex-col items-center">

                  <img
                    src="src/images/student1.png"
                    className="w-16 h-16 rounded-full object-cover border-2 border-pink-500"
                    alt="Student 1"
                  />

                  <h3 className="mt-3 font-semibold text-gray-800">
                    Prayanka Sharma
                  </h3>

                  <span className="text-sm text-pink-500">
                    Student
                  </span>

                </div>

              </div>

            </SwiperSlide>


            {/* Testimonial 2 */}

            <SwiperSlide>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 max-w-2xl mx-auto text-center">

                <p className="text-gray-700 text-lg italic">
                  "The craft kits are top-notch and super easy to use. My kids loved them!"
                </p>

                <div className="mt-6 flex flex-col items-center">

                  <img
                    src="src/images/parent.jpg"
                    className="w-16 h-16 rounded-full object-cover border-2 border-pink-500"
                    alt="Parent"
                  />

                  <h3 className="mt-3 font-semibold text-gray-800">
                    Rahul Sharma
                  </h3>

                  <span className="text-sm text-pink-500">
                    Parent
                  </span>

                </div>

              </div>

            </SwiperSlide>


            {/* Testimonial 3 */}

            <SwiperSlide>

              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 max-w-2xl mx-auto text-center">

                <p className="text-gray-700 text-lg italic">
                  "Best platform for learning crafts online. The instructors are very helpful."
                </p>

                <div className="mt-6 flex flex-col items-center">

                  <img
                    src="src/images/student.jpg"
                    className="w-16 h-16 rounded-full object-cover border-2 border-pink-500"
                    alt="Student 3"
                  />

                  <h3 className="mt-3 font-semibold text-gray-800">
                    Priya Mehta
                  </h3>

                  <span className="text-sm text-pink-500">
                    Student
                  </span>

                </div>

              </div>

            </SwiperSlide>

          </Swiper>

        </div>

      </section>


      

      

    </>
  );
}

export default Home;
