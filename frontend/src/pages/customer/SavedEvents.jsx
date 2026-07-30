import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaTrash,
  FaArrowLeft,
  FaBookmark,
  FaTags,
  FaPlus,
  FaSearch,
  FaFilter,
  FaStar,
  FaList
} from "react-icons/fa";

const SavedEvents = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [removedNotification, setRemovedNotification] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost/EventEase/backend/api/my_favorites.php?user_id=${user.id}`
      );
      const data = await response.json();
      if (data.success) {
        setFavorites(data.favorites);
      }
    } catch (err) {
      console.error("Failed to load wishlist", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (eventId, eventTitle) => {
    try {
      const response = await fetch(
        "http://localhost/EventEase/backend/api/toggle_favorite.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.id, event_id: eventId })
        }
      );
      const data = await response.json();
      if (data.success) {
        setFavorites((prev) => prev.filter((item) => parseInt(item.id) !== parseInt(eventId)));
        setRemovedNotification(`"${eventTitle || 'Event'}" removed from Wishlist`);
        setTimeout(() => setRemovedNotification(null), 3000);
      }
    } catch (err) {
      console.error("Failed to remove favorite", err);
    }
  };

  // Get unique categories present in saved events
  const categories = ["All", ...Array.from(new Set(favorites.map((f) => f.category).filter(Boolean)))];

  // Filtered favorites
  const filteredFavorites = favorites.filter((event) => {
    const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-rose-600/15 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10 relative z-10">
        
        {/* Navigation Top Bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/customer-dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-purple-300 hover:text-white transition backdrop-blur-md"
          >
            <FaArrowLeft /> Back to Dashboard
          </Link>

          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold uppercase tracking-wider">
            <FaHeart className="text-rose-500 animate-pulse" /> Personal Wishlist
          </span>
        </div>

        {/* Hero Banner Section */}
        <div className="relative rounded-[2.5rem] bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-slate-900/90 p-8 sm:p-12 border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-purple-200 text-xs font-bold uppercase tracking-wider border border-white/10">
                <FaBookmark className="text-rose-400" /> Bookmarked Experiences
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                My Saved <span className="bg-gradient-to-r from-rose-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent">Wishlist</span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Your curated collection of upcoming concerts, tournaments, dramas, and festivals. Reserve tickets before seats run out!
              </p>
            </div>

            {/* Quick Action & Stats Cards */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 px-6 text-center backdrop-blur-md">
                <span className="text-xs text-slate-400 font-medium block uppercase tracking-wider">Saved Items</span>
                <span className="text-3xl font-black text-white mt-1 block">
                  {favorites.length}
                </span>
              </div>

              <Link
                to="/events"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-purple-600/30 hover:scale-[1.02] active:scale-95 transition flex items-center justify-center gap-2 group"
              >
                <FaPlus className="text-base group-hover:rotate-90 transition duration-300" /> Add More Events
              </Link>
            </div>
          </div>
        </div>

        {/* Removed Toast Feedback */}
        {removedNotification && (
          <div className="bg-rose-500/20 border border-rose-500/40 text-rose-200 px-6 py-3.5 rounded-2xl shadow-xl backdrop-blur-md flex items-center justify-between animate-fadeIn">
            <span className="text-xs font-semibold flex items-center gap-2">
              <FaHeart className="text-rose-400" /> {removedNotification}
            </span>
            <button onClick={() => setRemovedNotification(null)} className="text-xs opacity-60 hover:opacity-100">✕</button>
          </div>
        )}

        {/* Search & Category Filter Bar */}
        {favorites.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search saved events..."
                className="w-full pl-11 pr-4 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs">
                  ✕
                </button>
              )}
            </div>

            {/* Categories Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mr-1 shrink-0">
                <FaFilter className="text-purple-400" /> Filter:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                    selectedCategory === cat
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                      : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Grid / Empty State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-14 h-14 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 text-xs font-semibold">Loading your saved events...</p>
          </div>
        ) : filteredFavorites.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-12 sm:p-16 text-center max-w-2xl mx-auto space-y-6 backdrop-blur-xl shadow-2xl">
            <div className="w-24 h-24 bg-gradient-to-tr from-rose-500/20 to-purple-500/20 border border-rose-500/30 rounded-3xl flex items-center justify-center mx-auto text-rose-400 text-4xl shadow-inner">
              <FaHeart />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">
                {favorites.length === 0 ? "Your Wishlist is Empty" : "No Matching Saved Events"}
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                {favorites.length === 0
                  ? "You haven't bookmarked any events yet. Browse our top concerts, sports, and festivals and click the heart button to save them!"
                  : "No saved events match your search filters. Try clearing your search term."}
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/events"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-purple-600/30 hover:scale-105 transition"
              >
                <FaPlus /> Explore & Add Events
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFavorites.map((event) => (
              <div
                key={event.id}
                onClick={() => navigate(`/event/${event.id}`)}
                className="bg-slate-900/90 border border-white/10 rounded-[2rem] overflow-hidden shadow-xl hover:shadow-purple-500/10 hover:-translate-y-2 transition duration-300 flex flex-col cursor-pointer group backdrop-blur-md"
              >
                {/* Event Image Banner */}
                <div className="relative h-56 bg-slate-800 overflow-hidden">
                  {event.image ? (
                    <img
                      src={`http://localhost/EventEase/backend/uploads/${event.image}`}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-purple-900 via-indigo-900 to-slate-900 flex items-center justify-center text-white text-5xl">
                      🎟️
                    </div>
                  )}

                  {/* Dark Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30"></div>

                  {/* Category Pill */}
                  <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 text-purple-300 font-extrabold text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1.5">
                    <FaTags className="text-purple-400" /> {event.category || "General"}
                  </span>

                  {/* Trash Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(event.id, event.title);
                    }}
                    className="absolute top-4 right-4 w-10 h-10 bg-black/60 backdrop-blur-md hover:bg-rose-600 text-rose-400 hover:text-white border border-white/10 rounded-full shadow-md flex items-center justify-center transition hover:scale-110"
                    title="Remove from Wishlist"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </div>

                {/* Event Info Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-white group-hover:text-purple-400 transition line-clamp-1">
                      {event.title}
                    </h3>
                    <p className="text-xs font-semibold text-indigo-400 line-clamp-1">
                      By {event.organization_name || "Verified Event Organizer"}
                    </p>
                    {event.description && (
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed pt-1">
                        {event.description}
                      </p>
                    )}
                  </div>

                  {/* Date & Location */}
                  <div className="space-y-2 text-xs text-slate-300 border-t border-white/10 pt-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                        <FaCalendarAlt className="text-xs" />
                      </div>
                      <span className="font-medium">{event.event_date}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                        <FaMapMarkerAlt className="text-xs" />
                      </div>
                      <span className="font-medium line-clamp-1">{event.location || "Venue TBD"}</span>
                    </div>
                  </div>

                  {/* Price Tag & Book Ticket Action */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Price</span>
                      <span className="text-lg font-black text-white">
                        {parseFloat(event.price) > 0 ? `LKR ${parseFloat(event.price).toLocaleString()}` : "FREE"}
                      </span>
                    </div>

                    <Link
                      to={`/event/${event.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-purple-600/20 transition flex items-center gap-1.5 hover:scale-105"
                    >
                      <FaTicketAlt /> Book Ticket
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedEvents;
