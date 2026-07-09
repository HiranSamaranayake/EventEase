import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { motion } from "framer-motion";
import Hero from "../../components/Hero";
import { Zap, ShieldCheck, Ticket, MapPinned } from "lucide-react";
import ctaBg from "../../assets/images/cta-bg.jpg";

//import CountUp from "react-countup";

function Home() {
  const navigate = useNavigate();
  const [rotation, setRotation] = useState({
    rotateX: 0,
    rotateY: 0,
  });
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost/EventEase/backend/api/events.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFeaturedEvents(data.events);
        }
      });
    fetch("http://localhost/EventEase/backend/api/categories.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCategories(data.categories);
        }
      });
  }, []);

  const filteredEvents = featuredEvents.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" || event.category === categoryFilter;

    const matchesLocation =
      locationFilter === "All" || event.location === locationFilter;

    return matchesSearch && matchesCategory && matchesLocation;
  });

  const upcomingEvents = [...featuredEvents]
    .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
    .slice(0, 4);

  const categoryIcons = {
    Technology: "💻",
    Music: "🎵",
    Sports: "⚽",
    Business: "💼",
    Education: "🎓",
    Festival: "🎉",
    Food: "🍔",
    Gaming: "🎮",
    General: "🎫",
  };
  const categoryColors = {
    Technology: "from-blue-500 to-cyan-500",
    Music: "from-pink-500 to-rose-500",
    Sports: "from-green-500 to-emerald-500",
    Business: "from-indigo-500 to-violet-500",
    Education: "from-orange-500 to-amber-500",
    Festival: "from-fuchsia-500 to-purple-500",
    Food: "from-red-500 to-orange-500",
    Gaming: "from-violet-500 to-indigo-600",
    General: "from-purple-600 to-fuchsia-500",
  };

  return (
    <>
                  <Navbar />           {" "}
      <main
        className="
                    relative
                    min-h-screen
                    overflow-hidden
                    bg-gradient-to-br
                    from-white
                    via-purple-50
                    to-white
                "
      >
                        {/* Purple Glow */}               {" "}
        <div
          className="
absolute
top-[-120px]
left-[-120px]
w-[450px]
h-[450px]
rounded-full
bg-purple-500/20
blur-3xl
animate-orb-1
"
        ></div>
                        {/* Pink Glow */}               {" "}
        <div
          className="
absolute
bottom-[-150px]
right-[-120px]
w-[500px]
h-[500px]
rounded-full
bg-fuchsia-500/20
blur-3xl
animate-orb-2
"
        ></div>
                        {/* Violet Glow */}               {" "}
        <div
          className="
absolute
top-1/2
right-1/4
w-[300px]
h-[300px]
rounded-full
bg-violet-400/10
blur-3xl
animate-orb-3
"
        ></div>
                        {/* Hero Section */}                <Hero />           
            {/* Statistics Section */}               {" "}
        <section className="py-20 relative z-10">
                             {" "}
          <div className="max-w-7xl mx-auto px-6">
                                   {" "}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                                         {" "}
              <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 text-center hover:-translate-y-2 transition duration-300">
                                               {" "}
                <h2 className="text-5xl font-black text-purple-600">
                                                      500+                      
                           {" "}
                </h2>
                                               {" "}
                <p className="mt-3 text-gray-600 font-medium">
                                                      Events Hosted            
                                     {" "}
                </p>
                                           {" "}
              </div>
                                         {" "}
              <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 text-center hover:-translate-y-2 transition duration-300">
                                               {" "}
                <h2 className="text-5xl font-black text-purple-600">
                                                      10K+                      
                           {" "}
                </h2>
                                               {" "}
                <p className="mt-3 text-gray-600 font-medium">
                                                      Tickets Booked            
                                     {" "}
                </p>
                                           {" "}
              </div>
                                         {" "}
              <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 text-center hover:-translate-y-2 transition duration-300">
                                               {" "}
                <h2 className="text-5xl font-black text-purple-600">
                                                      50+                      
                           {" "}
                </h2>
                                               {" "}
                <p className="mt-3 text-gray-600 font-medium">
                                                      Event Organizers          
                                       {" "}
                </p>
                                           {" "}
              </div>
                                         {" "}
              <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 text-center hover:-translate-y-2 transition duration-300">
                                               {" "}
                <h2 className="text-5xl font-black text-purple-600">
                                                      98%                      
                           {" "}
                </h2>
                                               {" "}
                <p className="mt-3 text-gray-600 font-medium">
                                                      Customer Satisfaction    
                                             {" "}
                </p>
                                           {" "}
              </div>
                                     {" "}
            </div>
                               {" "}
          </div>
                         {" "}
        </section>
        <section className="py-24 relative z-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span
                className="
                    bg-purple-100
                    text-purple-700
                    px-4
                    py-2
                    rounded-full
                    font-semibold
                    text-sm
                "
              >
                BROWSE CATEGORIES
              </span>

              <h2
                className="
                    mt-6
                    text-4xl
                    lg:text-5xl
                    font-black
                "
              >
                Find Events By Category
              </h2>

              <p
                className="
                    mt-4
                    text-gray-600
                    max-w-2xl
                    mx-auto
                "
              >
                Explore events based on your interests.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <button
                onClick={() => setCategoryFilter("All")}
                className={`
        group
        rounded-3xl
        p-8
        transition-all
        duration-300
        ${
          categoryFilter === "All"
            ? "bg-purple-600 text-white shadow-2xl scale-105"
            : "bg-white hover:-translate-y-2 hover:shadow-purple-300/40 shadow-lg"
        }
    `}
              >
                <div
                  className="
            w-16
            h-16
            mx-auto
            rounded-2xl
            bg-gradient-to-br
            from-indigo-500
            to-purple-600
            flex
            items-center
            justify-center
            text-white
            text-3xl
            mb-5
            shadow-lg
            group-hover:scale-110
            transition-all
            duration-300
        "
                >
                  🌍
                </div>

                <h3 className="text-xl font-bold">All Categories</h3>

                <p className="mt-2 opacity-80">
                  {featuredEvents.length} Events
                </p>
              </button>
              {categories.map((category) => (
                <button
                  key={category.category}
                  onClick={() => setCategoryFilter(category.category)}
                  className={`
        group
        rounded-3xl
        p-8
        transition-all
        duration-300
        ${
          categoryFilter === category.category
            ? "bg-purple-600 text-white shadow-2xl scale-105"
            : "bg-white hover:-translate-y-2 hover:shadow-purple-300/40 shadow-lg"
        }
    `}
                >
                  <div
                    className={`
        w-16
        h-16
        mx-auto
        rounded-2xl
        bg-gradient-to-br
        ${categoryColors[category.category] || "from-purple-600 to-fuchsia-500"}
        flex
        items-center
        justify-center
        text-white
        text-3xl
        mb-5
        shadow-lg
        group-hover:scale-110
        transition-all
        duration-300
    `}
                  >
                    {categoryIcons[category.category] || "🎫"}
                  </div>

                  <h3 className="font-bold text-xl">{category.category}</h3>

                  <p className="text-gray-500 mt-2">
                    {category.total_events} Events
                  </p>
                </button>
              ))}
            </div>
          </div>
        </section>
        <section className="py-24 relative z-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span
                className="
                bg-purple-100
                text-purple-700
                px-4 py-2
                rounded-full
                font-semibold
                text-sm
            "
              >
                FEATURED EVENTS
              </span>

              <h2
                className="
                mt-6
                text-4xl lg:text-5xl
                font-black
                text-black
            "
              >
                Discover Amazing Events
              </h2>

              <p
                className="
                mt-4
                text-gray-600
                max-w-2xl
                mx-auto
            "
              >
                Explore trending events and discover unforgettable experiences
                near you.
              </p>
            </div>
            <div className="mb-10 flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="🔍 Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
            flex-1
            border
            border-gray-300
            rounded-2xl
            px-5
            py-3
            shadow-sm
            focus:outline-none
            focus:ring-2
            focus:ring-purple-500
        "
              />

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="
        border
        border-gray-300
        rounded-2xl
        px-5
        py-3
        shadow-sm
        focus:outline-none
        focus:ring-2
        focus:ring-purple-500
    "
              >
                <option value="All">All Categories</option>

                {categories.map((category) => (
                  <option key={category.category} value={category.category}>
                    {category.category}
                  </option>
                ))}
              </select>

              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="
        border
        border-gray-300
        rounded-2xl
        px-5
        py-3
        shadow-sm
        focus:outline-none
        focus:ring-2
        focus:ring-purple-500
    "
              >
                <option value="All">All Locations</option>

                {[
                  ...new Set(featuredEvents.map((event) => event.location)),
                ].map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.slice(0, 3).map((event) => (
                <motion.div
                  key={event.id}
                  initial={{
                    opacity: 0,
                    y: 40,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                  }}
                  whileHover={{
                    y: -12,
                  }}
                  className="
        group
        bg-white/80
        backdrop-blur-md
        rounded-3xl
        overflow-hidden
        shadow-xl
        hover:shadow-[0_30px_60px_rgba(124,58,237,0.25)]
        transition-all
        duration-300
    "
                >
                  <div className="overflow-hidden relative">
                    <div
                      className="
        absolute
        top-4
        right-4
        z-10
        bg-gradient-to-r
        from-purple-600
        to-fuchsia-600
        text-white
        text-xs
        font-bold
        px-3
        py-1
        rounded-full
        shadow-lg
    "
                    >
                      ⭐ Featured
                    </div>
                    <img
                      src={
                        event.image
                          ? `http://localhost/EventEase/backend/uploads/${event.image}`
                          : "https://via.placeholder.com/600x400?text=No+Image"
                      }
                      alt={event.title}
                      className="
        h-56
        w-full
        object-cover
        group-hover:scale-110
        transition-transform
        duration-500
    "
                    />
                    <div className="absolute top-4 left-4">
                      <span
                        className="
        bg-purple-600
        text-white
        px-3
        py-1
        rounded-full
        text-sm
        font-bold
        shadow-lg
    "
                      >
                        {Number(event.price) === 0
                          ? "FREE"
                          : `Rs. ${Number(event.price).toLocaleString()}`}
                      </span>
                    </div>
                    <div
                      className="
        absolute
        inset-0
        bg-gradient-to-t
        from-black/30
        via-transparent
        to-transparent
        pointer-events-none
    "
                    ></div>
                  </div>

                  <div className="p-6">
                    <span
                      className="
        inline-flex
        items-center
        bg-purple-100
        text-purple-700
        px-4
        py-2
        rounded-full
        text-sm
        font-semibold
    "
                    >
                      🏷 {event.category}
                    </span>

                    <h3
                      className="
            mt-4
            text-2xl
            font-bold
            text-black
        "
                    >
                      {event.title}
                    </h3>

                    <p className="mt-3 text-gray-600 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="mt-5 space-y-3 text-gray-600">
                      {" "}
                      <p className="flex items-center gap-2">
                        📅
                        <span>{event.event_date}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        📍
                        <span>{event.location}</span>
                      </p>
                      <p className="font-semibold text-purple-700">
                        {Number(event.price) === 0 ? (
                          <>🆓 FREE</>
                        ) : (
                          <>💰 Rs. {Number(event.price).toLocaleString()}</>
                        )}
                      </p>
                      <p className="text-gray-600">
                        👥 {event.capacity ?? "Unlimited"} Seats
                      </p>
                    </div>

                    <button
                      onClick={() => navigate(`/event/${event.id}`)}
                      className="
    mt-6
    w-full
    bg-gradient-to-r
    from-purple-600
    to-fuchsia-600
    text-white
    py-3
    rounded-2xl
    font-semibold
    shadow-lg
    hover:shadow-purple-500/40
    hover:scale-105
    active:scale-95
    transition-all
    duration-300
"
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="mt-12 text-center">
            <button
              onClick={() => navigate("/events")}
              className="
      bg-purple-600
      hover:bg-purple-700
      text-white
      px-8
      py-4
      rounded-2xl
      font-semibold
      transition
      shadow-lg
    "
            >
              View All Events →
            </button>
          </div>
        </section>
        {/* ================= WHY CHOOSE EVENTEASE ================= */}
        <section className="py-24 relative z-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <span
                className="
                    bg-purple-100
                    text-purple-700
                    px-4
                    py-2
                    rounded-full
                    font-semibold
                    text-sm
                "
              >
                WHY CHOOSE US
              </span>

              <h2
                className="
                    mt-6
                    text-4xl
                    lg:text-5xl
                    font-black
                    text-black
                "
              >
                Why Choose EventEase?
              </h2>

              <p
                className="
                    mt-5
                    text-gray-600
                    max-w-3xl
                    mx-auto
                    text-lg
                    leading-8
                "
              >
                Everything you need to create, manage and attend amazing events
                in one beautiful platform.
              </p>
            </div>
            <div
              className="
        grid
        md:grid-cols-2
        lg:grid-cols-4
        gap-8
        mt-16
    "
            >
              {/* Card 1 */}

              <div
                className="
                group
            bg-white/80
backdrop-blur-xl
border
border-white/60
rounded-3xl
p-8
shadow-xl
hover:-translate-y-3
hover:scale-105
hover:shadow-[0_20px_60px_rgba(168,85,247,0.25)]
transition-all
duration-500
text-center
        "
              >
             <div
    className="
        w-20
        h-20
        mx-auto
        mb-6
        rounded-2xl
        bg-gradient-to-br
        from-purple-500
        via-fuchsia-500
        to-pink-500
        flex
        items-center
        justify-center
        text-white
        shadow-xl
        transition-all
        duration-500
        group-hover:rotate-6
        group-hover:scale-110
    "
>
                  <Zap size={38} />
                </div>

                <h3
                  className="text-2xl
font-black
mb-4
text-gray-900"
                >
                  Fast Booking
                </h3>

                <p
                  className="text-gray-600
leading-7
text-[15px]"
                >
                  Book tickets within seconds with a smooth and simple booking
                  experience.
                </p>
              </div>

              {/* Card 2 */}

              <div
                className="
                group
            bg-white/80
backdrop-blur-xl
border
border-white/60
rounded-3xl
p-8
shadow-xl
hover:-translate-y-3
hover:scale-105
hover:shadow-[0_20px_60px_rgba(168,85,247,0.25)]
transition-all
duration-500
text-center
        "
              >
               <div
    className="
        w-20
        h-20
        mx-auto
        mb-6
        rounded-2xl
        bg-gradient-to-br
        from-purple-500
        via-fuchsia-500
        to-pink-500
        flex
        items-center
        justify-center
        text-white
        shadow-xl
        transition-all
        duration-500
        group-hover:rotate-6
        group-hover:scale-110
    "
>
                  <ShieldCheck size={38} />
                </div>

                <h3
                  className="text-2xl
font-black
mb-4
text-gray-900"
                >
                  Secure Platform
                </h3>

                <p
                  className="text-gray-600
leading-7
text-[15px]"
                >
                  Safe registrations, protected user accounts and reliable event
                  management.
                </p>
              </div>

              {/* Card 3 */}

              <div
                className="
                group
            bg-white/80
backdrop-blur-xl
border
border-white/60
rounded-3xl
p-8
shadow-xl
hover:-translate-y-3
hover:scale-105
hover:shadow-[0_20px_60px_rgba(168,85,247,0.25)]
transition-all
duration-500
text-center
        "
              >
               <div
    className="
        w-20
        h-20
        mx-auto
        mb-6
        rounded-2xl
        bg-gradient-to-br
        from-purple-500
        via-fuchsia-500
        to-pink-500
        flex
        items-center
        justify-center
        text-white
        shadow-xl
        transition-all
        duration-500
        group-hover:rotate-6
        group-hover:scale-110
    "
>
                 <Ticket size={38} />
                </div>

                <h3
                  className="text-2xl
font-black
mb-4
text-gray-900"
                >
                  Instant Tickets
                </h3>

                <p
                  className="text-gray-600
leading-7
text-[15px]"
                >
                  Receive your booking confirmation immediately after reserving
                  your seat.
                </p>
              </div>

              {/* Card 4 */}

              <div
                className="
                group
            bg-white/80
backdrop-blur-xl
border
border-white/60
rounded-3xl
p-8
shadow-xl
hover:-translate-y-3
hover:scale-105
hover:shadow-[0_20px_60px_rgba(168,85,247,0.25)]
transition-all
duration-500
text-center
        "
              >
              <div
    className="
        w-20
        h-20
        mx-auto
        mb-6
        rounded-2xl
        bg-gradient-to-br
        from-purple-500
        via-fuchsia-500
        to-pink-500
        flex
        items-center
        justify-center
        text-white
        shadow-xl
        transition-all
        duration-500
        group-hover:rotate-6
        group-hover:scale-110
    "
>
                  <MapPinned size={38} />
                </div>

                <h3
                  className="text-2xl
font-black
mb-4
text-gray-900"
                >
                  Discover Events
                </h3>

                <p
                  className="text-gray-600
leading-7
text-[15px]"
                >
                  Find exciting events happening near you and explore new
                  experiences.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= TESTIMONIALS ================= */}

<section className="py-24 relative z-10">

    <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

            <span
                className="
                    bg-purple-100
                    text-purple-700
                    px-4
                    py-2
                    rounded-full
                    font-semibold
                    text-sm
                "
            >
                TESTIMONIALS
            </span>

            <h2
                className="
                    mt-6
                    text-4xl
                    lg:text-5xl
                    font-black
                "
            >
                Loved by Event Organizers
            </h2>

            <p
                className="
                    mt-4
                    text-gray-600
                    max-w-2xl
                    mx-auto
                "
            >
                Here's what people are saying about EventEase.
            </p>

        </div>
        <div
    className="
        grid
        md:grid-cols-2
        lg:grid-cols-3
        gap-8
        mt-16
    "
>

    {/* Review 1 */}

    <div
        className="
            group
            bg-white/80
            backdrop-blur-xl
            border
            border-white/60
            rounded-3xl
            p-8
            shadow-xl
            hover:-translate-y-3
            hover:shadow-purple-300/30
            transition-all
            duration-500
        "
    >

        <div className="flex mb-5 text-yellow-400 text-xl">
            ⭐⭐⭐⭐⭐
        </div>

        <p
            className="
                text-gray-600
                leading-8
                mb-8
            "
        >
            "EventEase made organizing our annual tech conference incredibly simple. Ticket sales and attendee management were effortless."
        </p>

        <div className="flex items-center gap-4">

            <div
                className="
                    w-14
                    h-14
                    rounded-full
                    bg-gradient-to-br
                    from-purple-500
                    to-pink-500
                    flex
                    items-center
                    justify-center
                    text-white
                    font-bold
                    text-xl
                "
            >
                A
            </div>

            <div>

                <h4 className="font-bold">
                    Amanda Silva
                </h4>

                <p className="text-gray-500 text-sm">
                    Event Organizer
                </p>

            </div>

        </div>

    </div>

    {/* Review 2 */}

    <div
        className="
            group
            bg-white/80
            backdrop-blur-xl
            border
            border-white/60
            rounded-3xl
            p-8
            shadow-xl
            hover:-translate-y-3
            hover:shadow-purple-300/30
            transition-all
            duration-500
        "
    >

        <div className="flex mb-5 text-yellow-400 text-xl">
            ⭐⭐⭐⭐⭐
        </div>

        <p
            className="
                text-gray-600
                leading-8
                mb-8
            "
        >
            "Booking tickets has never been easier. The platform is fast, modern and extremely user friendly."
        </p>

        <div className="flex items-center gap-4">

            <div
                className="
                    w-14
                    h-14
                    rounded-full
                    bg-gradient-to-br
                    from-blue-500
                    to-cyan-500
                    flex
                    items-center
                    justify-center
                    text-white
                    font-bold
                    text-xl
                "
            >
                D
            </div>

            <div>

                <h4 className="font-bold">
                    Daniel Fernando
                </h4>

                <p className="text-gray-500 text-sm">
                    Customer
                </p>

            </div>

        </div>

    </div>

    {/* Review 3 */}

    <div
        className="
            group
            bg-white/80
            backdrop-blur-xl
            border
            border-white/60
            rounded-3xl
            p-8
            shadow-xl
            hover:-translate-y-3
            hover:shadow-purple-300/30
            transition-all
            duration-500
        "
    >

        <div className="flex mb-5 text-yellow-400 text-xl">
            ⭐⭐⭐⭐⭐
        </div>

        <p
            className="
                text-gray-600
                leading-8
                mb-8
            "
        >
            "Our music festival sold out within days. Managing registrations and bookings became completely stress-free."
        </p>

        <div className="flex items-center gap-4">

            <div
                className="
                    w-14
                    h-14
                    rounded-full
                    bg-gradient-to-br
                    from-green-500
                    to-emerald-500
                    flex
                    items-center
                    justify-center
                    text-white
                    font-bold
                    text-xl
                "
            >
                M
            </div>

            <div>

                <h4 className="font-bold">
                    Michael Perera
                </h4>

                <p className="text-gray-500 text-sm">
                    Festival Manager
                </p>

            </div>

        </div>

    </div>

</div>

    </div>

</section>
{/* ================= FINAL CTA ================= */}

<section
    className="
        relative
        overflow-hidden
        py-40
        mt-16
    "
>
  {/* Background Image */}

<img
    src={ctaBg}
    alt="CTA Background"
    className="
        absolute
        inset-0
        w-full
        h-full
        object-cover
    "
/>

{/* Dark Overlay */}

<div
    className="
        absolute
        inset-0
        bg-black/65
    "
></div>

{/* Purple Overlay */}

<div
    className="
        absolute
        inset-0
        bg-gradient-to-br
        from-purple-900/50
        via-black/40
        to-black/70
    "
></div>


    {/* Background Glow */}

    <div
        className="
            absolute
            -top-40
            -left-40
            w-96
            h-96
            rounded-full
            bg-white/10
            blur-3xl
        "
    ></div>

    <div
        className="
            absolute
            -bottom-40
            -right-40
            w-[420px]
            h-[420px]
            rounded-full
            bg-white/10
            blur-3xl
        "
    ></div>

    <div
        className="
            relative
            z-10
            max-w-5xl
            mx-auto
            px-6
            text-center
        "
    >

        <span
            className="
                inline-block
                bg-white/20
                backdrop-blur-md
                px-5
                py-2
                rounded-full
                text-white
                font-semibold
                tracking-wide
            "
        >
            READY TO GET STARTED?
        </span>

        <h2
            className="
                mt-8
                text-5xl
                lg:text-6xl
                font-black
                text-white
                leading-tight
            "
        >
            Host Amazing Events
            <br />
            With EventEase
        </h2>

        <p
            className="
                mt-8
                text-white/90
                text-xl
                leading-9
                max-w-3xl
                mx-auto
            "
        >
            Whether you're organizing a conference, concert,
            workshop or community gathering, EventEase gives you
            everything you need to create unforgettable experiences.
        </p>
        <div
    className="
        mt-14
        flex
        flex-wrap
        justify-center
        gap-6
    "
>

    <button
        onClick={() => navigate("/register")}
        className="
            px-10
            py-4
            rounded-2xl
            bg-white
            text-purple-700
            font-bold
            text-lg
            shadow-2xl
            hover:scale-105
            hover:shadow-white/40
            transition-all
            duration-300
        "
    >
        Become an Organizer
    </button>

    <button
        onClick={() => navigate("/events")}
        className="
            px-10
            py-4
            rounded-2xl
            border
            border-white/40
            bg-white/10
            backdrop-blur-xl
            text-white
            font-bold
            text-lg
            hover:bg-white/20
            hover:scale-105
            transition-all
            duration-300
        "
    >
        Explore Events
    </button>
    <div
    className="
        mt-12
        flex
        flex-wrap
        justify-center
        gap-10
        text-white/90
        text-sm
        font-medium
    "
>

    <span>✓ Secure Ticket Booking</span>

    <span>✓ Instant Event Creation</span>

    <span>✓ Trusted by Hundreds of Users</span>

</div>

</div>

    </div>

</section>
                   {" "}
      </main>
             {" "}
    </>
  );
}

export default Home;
