import { useEffect, useState } from "react";

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

function Home() {
  const [counters, setCounters] = useState({
    students: 0,
    classes: 0,
    customers: 0
  });

  /*
   * Temporary products.
   *
   * Later these will come from your Flask backend.
   * The design will remain exactly the same.
   */
  const products = [
    {
      id: 1,
      name: "Creative Craft",
      image: "craft.jpg",
      price: 499,
      desc: "Explore creative handmade craft materials and techniques."
    },
    {
      id: 2,
      name: "Painting Kit",
      image: "paint.webp",
      price: 599,
      desc: "Complete painting kit for creative artists and beginners."
    },
    {
      id: 3,
      name: "Crochet Kit",
      image: "crochet.webp",
      price: 699,
      desc: "Learn and create beautiful crochet designs with this kit."
    }
  ];

  /*
   * Animated counters
   */
  useEffect(() => {
    const targets = {
      students: 500,
      classes: 50,
      customers: 100
    };

    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setCounters({
        students: Math.floor(targets.students * progress),
        classes: Math.floor(targets.classes * progress),
        customers: Math.floor(targets.customers * progress)
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, []);

  return (
    <>
      {/* =========================
          HERO SLIDER
      ========================== */}

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
                  "url('/images/1.jpg')"
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
                  "url('/images/2jpg.jpg')"
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
                  "url('/images/3.webp')"
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


      {/* =========================
          ANIMATED COUNTERS
      ========================== */}

      <section className="py-16 bg-gray-100">

        <div className="container mx-auto grid md:grid-cols-3 gap-8 text-center">

          <div>
            <h2 className="text-5xl font-bold text-pink-500">
              {counters.students}+
            </h2>

            <p className="mt-2 text-gray-700 text-lg">
              Students
            </p>
          </div>


          <div>
            <h2 className="text-5xl font-bold text-pink-500">
              {counters.classes}+
            </h2>

            <p className="mt-2 text-gray-700 text-lg">
              Classes
            </p>
          </div>


          <div>
            <h2 className="text-5xl font-bold text-pink-500">
              {counters.customers}+
            </h2>

            <p className="mt-2 text-gray-700 text-lg">
              Happy Customers
            </p>
          </div>

        </div>

      </section>


      {/* =========================
          TRENDING PRODUCTS
      ========================== */}

      <section
        className="relative py-20 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/images/blue.jpeg')"
        }}
      >

        <div className="absolute inset-0 bg-white/50"></div>

        <div className="container mx-auto px-6 relative z-10">

          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            ✨ Trending Products
          </h2>


          <Swiper
            className="productSwiper"
            slidesPerView={1}
            spaceBetween={30}
            centeredSlides={true}
            loop={true}
            autoplay={{
              delay: 3000,
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

            {products.map((product) => (

              <SwiperSlide key={product.id}>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition max-w-4xl mx-auto">

                  <img
                    src={`/images/${product.image}`}
                    className="w-full h-[28rem] object-cover"
                    alt={product.name}
                  />

                  <div className="p-6 text-center">

                    <h3 className="text-2xl font-semibold text-gray-800">
                      {product.name}
                    </h3>

                    <p className="text-gray-600 mt-3 text-lg">
                      {product.desc.slice(0, 120)}...
                    </p>

                    <div className="flex justify-between items-center mt-6">

                      <span className="text-pink-600 font-bold text-2xl">
                        ₹{product.price}
                      </span>

                      <a
                        href="/shop"
                        className="px-6 py-3 bg-pink-500 text-white text-base rounded-lg hover:bg-pink-600 transition"
                      >
                        Shop Now
                      </a>

                    </div>

                  </div>

                </div>

              </SwiperSlide>

            ))}

          </Swiper>

        </div>

      </section>


      {/* =========================
          TESTIMONIALS
      ========================== */}

      <section
        className="relative py-20 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/images/bg1.pg.jpg')"
        }}
      >

        <div className="absolute inset-0 bg-white/70"></div>

        <div className="container mx-auto px-6 relative z-10">

          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
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
                    src="/images/student1.jpg"
                    className="w-16 h-16 rounded-full object-cover border-2 border-pink-500"
                    alt="Student 1"
                  />

                  <h3 className="mt-3 font-semibold text-gray-800">
                    Prayank Sharma
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
                    src="/images/parent.jpg"
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
                    src="/images/student.jpg"
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
