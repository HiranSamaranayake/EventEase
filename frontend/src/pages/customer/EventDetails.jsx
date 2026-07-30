import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaClock, FaCheckCircle, FaUserClock, FaTicketAlt, FaExclamationTriangle } from "react-icons/fa";

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);
    const [waitingPos, setWaitingPos] = useState(null);

    useEffect(() => {
        fetch(`http://localhost/EventEase/backend/api/event_details.php?id=${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setEvent(data.event);
                }
            });

        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (currentUser && currentUser.id) {
            fetch(`http://localhost/EventEase/backend/api/my_favorites.php?user_id=${currentUser.id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.favorite_ids) {
                        setIsFavorite(data.favorite_ids.some(favId => parseInt(favId) === parseInt(id)));
                    }
                });

            fetch(`http://localhost/EventEase/backend/api/my_waiting_list.php?user_id=${currentUser.id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.waiting_list) {
                        const match = data.waiting_list.find(item => parseInt(item.event_id) === parseInt(id));
                        if (match) {
                            setIsWaiting(true);
                            setWaitingPos(match.position);
                        }
                    }
                });
        }
    }, [id]);

    const handleToggleFavorite = async () => {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (!currentUser || !currentUser.id) {
            navigate("/login");
            return;
        }

        try {
            const res = await fetch("http://localhost/EventEase/backend/api/toggle_favorite.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: currentUser.id, event_id: id })
            });
            const data = await res.json();
            if (data.success) {
                setIsFavorite(data.is_favorite);
            }
        } catch (err) {
            console.error("Error toggling favorite", err);
        }
    };

    const handleJoinWaitingList = async () => {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        if (!currentUser || !currentUser.id) {
            navigate("/login");
            return;
        }

        try {
            const res = await fetch("http://localhost/EventEase/backend/api/join_waiting_list.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: currentUser.id, event_id: id, action: isWaiting ? "leave" : "join" })
            });
            const data = await res.json();
            if (data.success) {
                setIsWaiting(data.is_waiting);
                setWaitingPos(data.position || null);
                alert(data.message);
            }
        } catch (err) {
            console.error("Error toggling waiting list", err);
        }
    };

    if (!event) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const isSoldOut = event.is_sold_out || (event.capacity > 0 && event.available_seats <= 0);

    return (
        <div className="bg-gray-100 min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-6 space-y-6">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    {/* Banner */}
                    <div className="relative">
                        <button
                            onClick={handleToggleFavorite}
                            className={`absolute top-6 right-6 z-20 px-5 py-3 rounded-full shadow-2xl backdrop-blur-md transition flex items-center gap-2 font-bold text-sm ${
                                isFavorite
                                    ? "bg-rose-500 text-white hover:bg-rose-600 scale-105"
                                    : "bg-white/80 hover:bg-white text-gray-800 hover:text-rose-500"
                            }`}
                        >
                            {isFavorite ? (
                                <>
                                    <FaHeart className="text-white text-lg" /> Saved to Wishlist
                                </>
                            ) : (
                                <>
                                    <FaRegHeart className="text-rose-500 text-lg" /> Save to Wishlist
                                </>
                            )}
                        </button>

                        <img
                            src={
                                event.image
                                    ? `http://localhost/EventEase/backend/uploads/${event.image}`
                                    : "https://via.placeholder.com/1200x500?text=No+Image"
                            }
                            alt={event.title}
                            className="w-full h-[420px] object-cover"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                        <div className="absolute bottom-6 left-6 flex flex-wrap gap-3">
                            <span className="bg-purple-600 text-white px-4 py-2 rounded-full font-semibold">
                                {event.category || "General"}
                            </span>

                            <span className="bg-green-600 text-white px-4 py-2 rounded-full font-semibold">
                                {Number(event.price) === 0
                                    ? "FREE"
                                    : `Rs. ${Number(event.price).toLocaleString()}`}
                            </span>

                            {isSoldOut && (
                                <span className="bg-rose-600 text-white px-4 py-2 rounded-full font-extrabold uppercase animate-pulse shadow-lg flex items-center gap-1">
                                    <FaExclamationTriangle /> SOLD OUT
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Left Side */}
                            <div className="lg:col-span-2 space-y-8">
                                <div>
                                    <h1 className="text-4xl font-black text-gray-900 mb-3">{event.title}</h1>
                                    <p className="text-purple-600 font-semibold">
                                        Organized by {event.organization_name || "Verified Organizer"}
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5">
                                        <p className="text-xs text-gray-500 mb-1">📅 Event Date</p>
                                        <h3 className="text-base font-bold text-purple-900">{event.event_date}</h3>
                                    </div>
                                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                                        <p className="text-xs text-gray-500 mb-1">📍 Venue Location</p>
                                        <h3 className="text-base font-bold text-blue-900">{event.location || "TBD"}</h3>
                                    </div>
                                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
                                        <p className="text-xs text-gray-500 mb-1">🪑 Seat Availability</p>
                                        <h3 className="text-base font-bold text-emerald-900">
                                            {isSoldOut ? "0 Seats Left (Full)" : `${event.available_seats || event.capacity || 'Unlimited'} Available`}
                                        </h3>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-8 border">
                                    <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                                    <p className="text-gray-700 leading-8 text-base">{event.description}</p>
                                </div>
                            </div>

                            {/* Right Side Sticky Booking/Waiting Card */}
                            <div className="bg-white rounded-3xl shadow-xl border p-8 h-fit sticky top-8 space-y-6">
                                <h3 className="text-2xl font-bold text-gray-900">Ticket Reservation</h3>

                                <div className="space-y-4 text-sm border-t border-b py-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Price</span>
                                        <span className="font-bold text-green-700">
                                            {Number(event.price) === 0 ? "FREE" : `Rs. ${Number(event.price).toLocaleString()}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Total Capacity</span>
                                        <span className="font-medium text-gray-800">{event.capacity ? `${event.capacity} Seats` : 'Unlimited'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Remaining</span>
                                        <span className={`font-bold ${isSoldOut ? 'text-rose-600' : 'text-emerald-600'}`}>
                                            {isSoldOut ? "Sold Out" : `${event.available_seats} Seats`}
                                        </span>
                                    </div>
                                </div>

                                {!isSoldOut ? (
                                    <Link
                                        to={`/book-event/${event.id}`}
                                        className="w-full py-4 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-2xl shadow-lg transition flex items-center justify-center gap-2 text-base"
                                    >
                                        <FaTicketAlt /> Book Ticket Now
                                    </Link>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-center">
                                            <p className="text-xs font-bold text-rose-700">⚠️ All tickets for this event are currently booked.</p>
                                        </div>

                                        <button
                                            onClick={handleJoinWaitingList}
                                            className={`w-full py-4 font-bold rounded-2xl shadow-lg transition flex items-center justify-center gap-2 text-sm ${
                                                isWaiting
                                                    ? "bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300"
                                                    : "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-black shadow-amber-500/20"
                                            }`}
                                        >
                                            {isWaiting ? (
                                                <>
                                                    <FaUserClock className="text-amber-700 text-base" /> Joined Queue (Position #{waitingPos || 1}) - Leave
                                                </>
                                            ) : (
                                                <>
                                                    <FaClock className="text-base" /> Join Priority Waiting List
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;