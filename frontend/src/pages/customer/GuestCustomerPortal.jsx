import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { FaSearch, FaFilter, FaCalendarAlt, FaMapMarkerAlt, FaChair, FaTags, FaUserPlus, FaSignInAlt, FaCheckCircle, FaInfoCircle } from "react-icons/fa";

const GuestCustomerPortal = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        fetch("http://localhost/EventEase/backend/api/events.php")
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setEvents(data.events);
                    setFilteredEvents(data.events);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        let result = events;
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(e =>
                e.title.toLowerCase().includes(query) ||
                (e.description && e.description.toLowerCase().includes(query)) ||
                (e.location && e.location.toLowerCase().includes(query))
            );
        }
        if (selectedCategory !== "All") {
            result = result.filter(e => (e.category || "General").toLowerCase() === selectedCategory.toLowerCase());
        }
        setFilteredEvents(result);
    }, [searchQuery, selectedCategory, events]);

    const categories = ["All", "Concert", "Sports", "Theater", "Workshop", "Seminar", "Cultural", "General"];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 pt-28 pb-16 space-y-8">
                {/* Guest Customer Level Banner */}
                <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10 space-y-3 max-w-3xl">
                        <span className="bg-white/20 text-purple-100 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-white/20 inline-flex items-center gap-1.5">
                            <FaInfoCircle /> Guest Customer Level Access
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                            Welcome to EventEase Event Explorer
                        </h1>
                        <p className="text-purple-100 text-sm leading-relaxed">
                            As a <strong>Guest Customer</strong>, you are free to <strong>browse all upcoming events</strong>, <strong>search by keyword/category/location</strong>, <strong>view complete event details</strong>, and <strong>inspect live seat availability</strong> without needing to log in!
                        </p>

                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-300 border border-white/10">
                                <FaCheckCircle /> Browse Catalog
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-300 border border-white/10">
                                <FaCheckCircle /> Search & Filters
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-300 border border-white/10">
                                <FaCheckCircle /> Inspect Seat Map
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-300 border border-white/10">
                                <FaCheckCircle /> Register When Ready
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                        <p className="text-xs text-purple-200">Ready to book tickets? Upgrade to <strong>Verified Customer</strong> status by creating an account!</p>
                        <div className="flex items-center gap-3">
                            <Link to="/register" className="bg-white text-purple-900 hover:bg-purple-50 font-black text-xs px-5 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2">
                                <FaUserPlus /> Register Account
                            </Link>
                            <Link to="/login" className="bg-purple-900/60 hover:bg-purple-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/20 transition flex items-center gap-2">
                                <FaSignInAlt /> Log In
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Search & Category Filter Section */}
                <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 space-y-4">
                    <div className="relative">
                        <FaSearch className="absolute left-4 top-3.5 text-gray-400 text-sm" />
                        <input
                            type="text"
                            placeholder="Search events by title, description, location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition"
                        />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                        <span className="text-xs font-bold text-gray-400 uppercase shrink-0 mr-2">Filter Categories:</span>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition shrink-0 ${
                                    selectedCategory === cat
                                        ? "bg-purple-700 text-white shadow-md"
                                        : "bg-slate-100 text-gray-600 hover:bg-slate-200"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Event Catalog Grid */}
                {loading ? (
                    <div className="py-16 flex justify-center">
                        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center shadow border border-gray-100">
                        <p className="text-gray-500 font-medium">No events found matching your search criteria.</p>
                        <button
                            onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                            className="mt-3 text-xs font-bold text-purple-700 hover:underline"
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredEvents.map((event) => {
                            const isSoldOut = event.is_sold_out || (event.capacity > 0 && event.available_seats <= 0);

                            return (
                                <div
                                    key={event.id}
                                    onClick={() => navigate(`/event/${event.id}`)}
                                    className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition duration-300 flex flex-col cursor-pointer group"
                                >
                                    <div className="relative h-48 bg-slate-800 overflow-hidden">
                                        {event.image ? (
                                            <img
                                                src={`http://localhost/EventEase/backend/uploads/${event.image}`}
                                                alt={event.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-tr from-purple-800 to-indigo-900 flex items-center justify-center text-white text-4xl">
                                                🎟️
                                            </div>
                                        )}

                                        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-purple-700 font-bold text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                                            <FaTags className="text-purple-500" /> {event.category || "General"}
                                        </span>

                                        <span className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md text-slate-200 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-lg border border-white/10">
                                            Guest View
                                        </span>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition line-clamp-1">
                                                {event.title}
                                            </h2>
                                            <p className="text-gray-500 text-xs mt-2 line-clamp-2 leading-relaxed">
                                                {event.description}
                                            </p>
                                        </div>

                                        <div className="space-y-2 text-xs text-gray-600 border-t border-gray-100 pt-4">
                                            <div className="flex items-center gap-2">
                                                <FaCalendarAlt className="text-indigo-500" />
                                                <span>{event.event_date}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaMapMarkerAlt className="text-rose-500" />
                                                <span className="line-clamp-1">{event.location || "Venue TBD"}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaChair className="text-emerald-500" />
                                                <span className={isSoldOut ? "text-rose-600 font-bold" : "text-emerald-700 font-medium"}>
                                                    {isSoldOut ? "Sold Out" : `${event.available_seats || event.capacity || 'Seats available'}`}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                                            <div>
                                                <span className="text-[10px] text-gray-400 font-semibold block uppercase">Price</span>
                                                <span className="text-lg font-black text-gray-900">
                                                    {parseFloat(event.price) > 0 ? `LKR ${parseFloat(event.price).toLocaleString()}` : "Free"}
                                                </span>
                                            </div>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/event/${event.id}`);
                                                }}
                                                className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition"
                                            >
                                                View Event Details & Seats
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default GuestCustomerPortal;
