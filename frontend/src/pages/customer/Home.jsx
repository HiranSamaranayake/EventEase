import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { motion } from "framer-motion";

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
  


  useEffect(() => {
    fetch("http://localhost/EventEase/backend/api/events.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFeaturedEvents(data.events);
        }
      });
  }, []);


  const filteredEvents = featuredEvents.filter((event) => {

    const matchesSearch =
        event.title.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
        categoryFilter === "All" ||
        event.category === categoryFilter;

    const matchesLocation =
        locationFilter === "All" ||
        event.location === locationFilter;

    return (
        matchesSearch &&
        matchesCategory &&
        matchesLocation
    );

});




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
                        {/* Hero Section */}               {" "}
        <section className="pt-36 pb-20 relative z-10">
                             {" "}
          <div
            className="
                            max-w-7xl mx-auto
                            px-6
                            grid lg:grid-cols-2
                            gap-12
                            items-center
                        "
          >
                                    {/* Left Side */}                     
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
                                         {" "}
              <span
                className="
                                    bg-purple-100
                                    text-purple-700
                                    px-4 py-2
                                    rounded-full
                                    text-sm
                                    font-semibold
                                "
              >
                                               NEXT GENERATION EVENT PLATFORM  
                                         {" "}
              </span>
                                         {" "}
              <h1
                className="
    mt-6
    text-5xl
    lg:text-7xl
    font-black
    leading-tight
    text-black
  "
              >
                Smart Event
                <br />
                <span
                  className="
      bg-gradient-to-r
      from-purple-600
      via-fuchsia-500
      to-violet-600
      bg-clip-text
      text-transparent
      inline-block
    "
                >
                  Management
                </span>
                <br />
                Made Simple
              </h1>
                                         {" "}
              <p
                className="
                                    mt-8
                                    text-gray-600
                                    text-lg
                                    leading-relaxed
                                "
              >
                                               Create, discover, manage and book
                events with EventEase – the all-in-one platform designed to
                deliver seamless event experiences.                          
                 {" "}
              </p>
                                         {" "}
              <div
                className="
                                    mt-10
                                    flex flex-wrap gap-4
                                "
              >
                                               
                <button
                  onClick={() => navigate("/events")}
                  className="
        bg-gradient-to-r
        from-purple-600
        to-fuchsia-600
        text-white
        px-8
        py-4
        rounded-2xl
        font-semibold
        shadow-xl
        hover:scale-105
        hover:shadow-purple-500/30
        transition-all
        duration-300
    "
                >
                  Explore Events
                </button>
                                               {" "}
                <button
                  className="
                                        border-2
                                        border-black
                                        bg-white/70
                                        backdrop-blur-sm
                                        px-8 py-4
                                        rounded-2xl
                                        font-semibold
                                        hover:bg-black
                                        hover:text-white
                                        transition-all
                                        duration-300
                                    "
                >
                                                      Become Organizer          
                                       {" "}
                </button>
                                           {" "}
              </div>
                                 {" "}
            </motion.div>
                                    {/* Right Side */}                       {" "}
            <div
              className="relative w-full perspective-[1200px]"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();

                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const rotateY = (x / rect.width - 0.5) * 20;
                const rotateX = (y / rect.height - 0.5) * -20;

                setRotation({
                  rotateX,
                  rotateY,
                });
              }}
              onMouseLeave={() =>
                setRotation({
                  rotateX: 0,
                  rotateY: 0,
                })
              }
            >
                                          {/* Main Dashboard */}               
                         {" "}
              <div
                style={{
                  transform: `
            rotateX(${rotation.rotateX}deg)
            rotateY(${rotation.rotateY}deg)
        `,
                }}
                className="
    relative
    w-full
    max-w-xl
    mx-auto
    bg-gradient-to-br
    from-gray-900
    via-black
    to-purple-950
    rounded-3xl
    p-8
    text-white
    transition-all
    duration-200
    transform-gpu
    shadow-[0_30px_80px_rgba(124,58,237,0.45)]
    hover:shadow-[0_40px_100px_rgba(168,85,247,0.55)]
"
              >
                <div
                  className="
        absolute
        inset-0
        -z-10
        blur-3xl
        opacity-40
        bg-purple-600
        rounded-3xl
        scale-95
    "
                ></div>
                                               {" "}
                <h3 className="text-2xl font-bold">
                                                      Event Dashboard          
                                       {" "}
                </h3>
                                               {" "}
                <div className="mt-8 space-y-6">
                                                     {" "}
                  <div className="flex justify-between">
                                                           {" "}
                    <span>Upcoming Events</span>                               
                           {" "}
                    <span className="text-purple-400 font-bold">
                                                                  25            
                                                 {" "}
                    </span>
                                                       {" "}
                  </div>
                                                     {" "}
                  <div className="flex justify-between">
                                                           {" "}
                    <span>Tickets Sold</span>                                   
                       {" "}
                    <span className="text-purple-400 font-bold">
                                                                  1,250        
                                                     {" "}
                    </span>
                                                       {" "}
                  </div>
                                                     {" "}
                  <div className="flex justify-between">
                                                           {" "}
                    <span>Total Revenue</span>                                 
                         {" "}
                    <span className="text-purple-400 font-bold">
                                                                  Rs.450,000    
                                                         {" "}
                    </span>
                                                       {" "}
                  </div>
                                                 {" "}
                </div>
                                           {" "}
              </div>
                                          {/* Floating Card 1 */}               
                         
              <div
                className="
        absolute
        -top-6
        -left-10
        bg-white
        p-4
        rounded-2xl
        shadow-xl
    "
              >
                                               {" "}
                <h4 className="text-2xl font-bold text-purple-600">
                                                      500+                      
                           {" "}
                </h4>
                                               {" "}
                <p className="text-gray-600">
                                                      Events Hosted            
                                     {" "}
                </p>
                                           {" "}
              </div>
                                         
              <div
                className="
        absolute
        -bottom-6
        -right-10
        bg-white
        p-4
        rounded-2xl
        shadow-xl
    "
              >
                                               {" "}
                <h4 className="text-2xl font-bold text-purple-600">
                                                      10K+                      
                           {" "}
                </h4>
                                               {" "}
                <p className="text-gray-600">
                                                      Users                    
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
    <option value="Technology">Technology</option>
    <option value="Music">Music</option>
    <option value="Sports">Sports</option>
    <option value="Business">Business</option>
    <option value="General">General</option>
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

    {[...new Set(featuredEvents.map(event => event.location))].map(location => (
        <option
            key={location}
            value={location}
        >
            {location}
        </option>
    ))}
</select>

</div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
    {filteredEvents.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  className="
    group
    bg-white
    rounded-3xl
    overflow-hidden
    shadow-lg
    border
    border-gray-100
    hover:-translate-y-4
    hover:scale-[1.02]
    hover:shadow-[0_35px_70px_rgba(124,58,237,0.30)]
    transition-all
    duration-300
"
                >
                  <div className="relative overflow-hidden">
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
                      className={`
        inline-block
        px-3
        py-1
        rounded-full
        text-sm
        font-semibold

        ${
          event.category === "Technology"
            ? "bg-blue-100 text-blue-700"
            : event.category === "Music"
              ? "bg-pink-100 text-pink-700"
              : event.category === "Sports"
                ? "bg-green-100 text-green-700"
                : event.category === "Business"
                  ? "bg-orange-100 text-orange-700"
                  : "bg-purple-100 text-purple-700"
        }
    `}
                    >
                      {event.category}
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

                    <div className="mt-4 space-y-2 text-gray-600">
                      <p>
                        📅{" "}
                        {new Date(event.event_date).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </p>

                      <p>📍 {event.location}</p>

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
    transition-all
    duration-300
"
                    >
                      View Details
                    </button>
                  </div>
                </div>
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
                   {" "}
      </main>
             {" "}
    </>
  );
}

export default Home;
