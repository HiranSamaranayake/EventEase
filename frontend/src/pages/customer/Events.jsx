import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaCalendarAlt, FaMapMarkerAlt, FaTags, FaSearch, FaFilter, FaChair } from "react-icons/fa";

const Events = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favoriteIds, setFavoriteIds] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [priceFilter, setPriceFilter] = useState("All");

    useEffect(() => {
        fetch("http://localhost/EventEase/backend/api/events.php")
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setEvents(data.events);
                    setFilteredEvents(data.events);
                }
                setLoading(false);
            });

        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser && storedUser.id) {
            fetch(`http://localhost/EventEase/backend/api/my_favorites.php?user_id=${storedUser.id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.favorite_ids) {
                        setFavoriteIds(data.favorite_ids.map(id => parseInt(id)));
                    }
                });
        }
    }, []);

    useEffect(() => {
        let result = events;

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(e =>
                e.title.toLowerCase().includes(query) ||
                (e.description && e.description.toLowerCase().includes(query)) ||
                (e.location && e.location.toLowerCase().includes(query)) ||
                (e.category && e.category.toLowerCase().includes(query))
            );
        }

        if (selectedCategory !== "All") {
            result = result.filter(e => (e.category || "General").toLowerCase() === selectedCategory.toLowerCase());
        }

        if (priceFilter === "Free") {
            result = result.filter(e => parseFloat(e.price) === 0);
        } else if (priceFilter === "Paid") {
            result = result.filter(e => parseFloat(e.price) > 0);
        }

        setFilteredEvents(result);
    }, [searchQuery, selectedCategory, priceFilter, events]);

    const categories = ["All", "Concert", "Sports", "Theater", "Workshop", "Seminar", "Cultural", "General"];

    const toggleFavorite = async (e, eventId) => {
        e.stopPropagation();
        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (!currentUser || !currentUser.id) {
            navigate("/login");
            return;
        }

        const targetEventId = parseInt(eventId);

        try {
            const res = await fetch("http://localhost/EventEase/backend/api/toggle_favorite.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: currentUser.id, event_id: targetEventId })
            });
            const data = await res.json();
            if (data.success) {
                setFavoriteIds(prev => {
                    const unique = new Set(prev.map(id => parseInt(id)));
                    if (data.is_favorite) {
                        unique.add(targetEventId);
                    } else {
                        unique.delete(targetEventId);
                    }
                    return Array.from(unique);
                });
            }
        } catch (err) {
            console.error("Error toggling favorite", err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        Explore Events
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Find, search, view seat availability, and book tickets for upcoming concerts, sports, dramas, and workshops.
                    </p>
                </div>
            </div>

            {/* Search and Filters Bar */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-4 top-3.5 text-gray-400 text-sm" />
                        <input
                            type="text"
                            placeholder="Search by event name, category, or location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-slate-50 border border-gray-200 rounded-2xl px-4 py-2">
                            <FaFilter className="text-purple-600 text-xs" />
                            <select
                                value={priceFilter}
                                onChange={(e) => setPriceFilter(e.target.value)}
                                className="bg-transparent text-xs font-semibold text-gray-700 focus:outline-none cursor-pointer"
                            >
                                <option value="All">All Prices</option>
                                <option value="Free">Free Only</option>
                                <option value="Paid">Paid Only</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-1">Categories:</span>
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

            {filteredEvents.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center shadow border border-gray-100">
                    <p className="text-gray-500 font-medium">No events found matching your search query or criteria.</p>
                    <button
                        onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setPriceFilter("All"); }}
                        className="mt-4 text-xs font-bold text-purple-700 hover:underline"
                    >
                        Reset Search Filters
                    </button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredEvents.map((event) => {
                        const targetId = parseInt(event.id);
                        const isFav = favoriteIds.includes(targetId);
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

                                    <button
                                        onClick={(e) => toggleFavorite(e, event.id)}
                                        className={`absolute top-4 right-4 w-10 h-10 rounded-full shadow-md backdrop-blur-md flex items-center justify-center transition ${
                                            isFav ? "bg-rose-500 text-white" : "bg-white/80 text-gray-700 hover:text-rose-500"
                                        }`}
                                        title={isFav ? "Remove from Wishlist" : "Save to Wishlist"}
                                    >
                                        {isFav ? <FaHeart className="text-sm text-white" /> : <FaRegHeart className="text-sm" />}
                                    </button>
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

                                    <div className="flex flex-col gap-3 pt-3 border-t border-gray-100">
                                        <div className="flex items-center justify-between">
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
                                                View Details
                                            </button>
                                        </div>

                                        <button
                                            onClick={(e) => toggleFavorite(e, event.id)}
                                            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs shadow-sm transition flex items-center justify-center gap-2 ${
                                                isFav
                                                    ? "bg-rose-100 text-rose-700 hover:bg-rose-200 border border-rose-300"
                                                    : "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200"
                                            }`}
                                        >
                                            {isFav ? (
                                                <>
                                                    <FaHeart className="text-rose-500 text-sm" /> Saved in Wishlist
                                                </>
                                            ) : (
                                                <>
                                                    <FaRegHeart className="text-purple-600 text-sm" /> Add to Wishlist
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Events;