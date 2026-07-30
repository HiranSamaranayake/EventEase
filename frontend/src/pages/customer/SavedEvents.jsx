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
  FaPlus
} from "react-icons/fa";

const SavedEvents = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const removeFavorite = async (eventId) => {
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
      }
    } catch (err) {
      console.error("Failed to remove favorite", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <div>
            <Link
              to="/customer-dashboard"
              className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-800 mb-2 transition"
            >
              <FaArrowLeft /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              <FaHeart className="text-rose-500" /> My Saved Wishlist
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Events you've bookmarked to attend or purchase tickets for later.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="bg-purple-50 border border-purple-200 px-5 py-3 rounded-2xl text-purple-700 font-bold text-sm flex items-center gap-2">
              <FaBookmark className="text-purple-600" /> {favorites.length} Saved Event{favorites.length === 1 ? "" : "s"}
            </div>

            <Link
              to="/events"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-purple-600/20 transition flex items-center gap-2 text-sm"
            >
              <FaPlus /> Add More Events to Wishlist
            </Link>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-xl border border-gray-100 max-w-2xl mx-auto space-y-4">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500 text-3xl">
              <FaHeart />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Your Wishlist is Empty</h2>
            <p className="text-gray-500 text-sm">
              Explore upcoming concerts, sports events, workshops and click the heart icon on any event to save it here!
            </p>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-2xl shadow-lg hover:shadow-purple-700/20 transition"
            >
              <FaPlus /> Explore & Add Events Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition duration-300 flex flex-col group"
              >
                {/* Image & Category */}
                <div className="relative h-52 bg-slate-800 overflow-hidden">
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

                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-purple-700 font-bold text-xs px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                    <FaTags className="text-purple-500" /> {event.category || "General"}
                  </span>

                  <button
                    onClick={() => removeFavorite(event.id)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md hover:bg-rose-500 hover:text-white text-rose-500 rounded-full shadow-md flex items-center justify-center transition"
                    title="Remove from Wishlist"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition line-clamp-1">
                      {event.title}
                    </h3>
                    <p className="text-xs text-purple-600 font-semibold mt-1">
                      Organized by {event.organization_name || "Verified Organizer"}
                    </p>

                    <div className="space-y-2 mt-4 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-indigo-500" />
                        <span>{event.event_date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-rose-500" />
                        <span className="line-clamp-1">{event.location || "Venue TBD"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 font-semibold block uppercase">Price</span>
                      <span className="text-lg font-black text-gray-900">
                        {parseFloat(event.price) > 0 ? `LKR ${parseFloat(event.price).toLocaleString()}` : "Free"}
                      </span>
                    </div>

                    <Link
                      to={`/event/${event.id}`}
                      className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
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
