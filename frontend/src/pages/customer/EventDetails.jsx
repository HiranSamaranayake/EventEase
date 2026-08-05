import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart, FaClock, FaCheckCircle, FaUserClock, FaTicketAlt, FaExclamationTriangle, FaUserPlus, FaSignInAlt, FaInfoCircle, FaShieldAlt, FaGraduationCap, FaBriefcase, FaLock, FaTag } from "react-icons/fa";

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);
    const [waitingPos, setWaitingPos] = useState(null);
    const [schedules, setSchedules] = useState([]);

    // Promo Code state
    const [promoInput, setPromoInput] = useState("");
    const [promoApplied, setPromoApplied] = useState(null);
    const [promoError, setPromoError] = useState("");

    // Modal state for Guest Customer attempting Verified Customer actions
    const [guestModal, setGuestModal] = useState({ open: false, featureName: "" });

    const currentUser = JSON.parse(localStorage.getItem("user"));

    const handleApplyPromoCode = async () => {
        if (!promoInput) return;
        setPromoError("");
        const orderVal = event ? Number(event.price || 1000) : 1000;
        try {
            const res = await fetch("http://localhost/EventEase/backend/api/validate_promo_code.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code: promoInput,
                    order_amount: orderVal,
                    event_id: id
                })
            });
            const data = await res.json();
            if (data.status === "success") {
                setPromoApplied(data);
                setPromoError("");
            } else {
                setPromoError(data.message || "Invalid promo code");
                setPromoApplied(null);
            }
        } catch (err) {
            setPromoError("Failed to validate promo code.");
        }
    };

    useEffect(() => {
        fetch(`http://localhost/EventEase/backend/api/event_details.php?id=${id}`)
            .then(res => res.json())
            .then(data => {
                if (data && data.event) {
                    setEvent(data.event);
                } else if (data && data.title) {
                    setEvent(data);
                }
            })
            .catch(err => {
                console.error("Error fetching event details:", err);
            });

        fetch(`http://localhost/EventEase/backend/api/get_event_schedules.php?event_id=${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success' && data.data) {
                    setSchedules(data.data);
                }
            })
            .catch(err => console.error("Failed to load schedules", err));

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
        if (!currentUser || !currentUser.id) {
            setGuestModal({ open: true, featureName: "Save to Wishlist" });
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
        if (!currentUser || !currentUser.id) {
            setGuestModal({ open: true, featureName: "Join Priority Waiting List" });
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

    const handleBookTicketClick = (e) => {
        if (!currentUser || !currentUser.id) {
            e.preventDefault();
            setGuestModal({ open: true, featureName: "Ticket Booking & Checkout" });
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
    const isRestricted = event.audience_restriction_type && event.audience_restriction_type !== 'public';

    // Parse ONLY the categories added by the organizer for this event
    let categoriesList = [];
    if (event.custom_categories) {
        try {
            const parsed = typeof event.custom_categories === "string" ? JSON.parse(event.custom_categories) : event.custom_categories;
            if (Array.isArray(parsed) && parsed.length > 0) {
                categoriesList = parsed;
            }
        } catch (e) {
            console.error("Error parsing categories", e);
        }
    }

    if (categoriesList.length === 0) {
        categoriesList = [{ name: "General Admission", price: event.price || 0 }];
    }

    return (
        <div className="bg-gray-100 min-h-screen py-10">
            <div className="max-w-7xl mx-auto px-6 space-y-6">
                {/* Guest Customer Level Banner */}
                {!currentUser && (
                    <div className="bg-purple-900 text-white rounded-2xl p-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                        <div className="flex items-center gap-3">
                            <span className="bg-purple-700 text-white p-2 rounded-xl text-lg"><FaInfoCircle /></span>
                            <div>
                                <h4 className="font-extrabold text-sm text-white">Guest Customer Mode</h4>
                                <p className="text-xs text-purple-200">You are browsing event details as a Guest Customer. To book tickets, register an account to become a <strong>Verified Customer</strong>!</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <Link to="/register" className="bg-white text-purple-900 hover:bg-purple-100 text-xs font-black px-4 py-2 rounded-xl shadow transition">
                                Register as Customer
                            </Link>
                            <Link to="/login" className="bg-purple-800 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl border border-purple-600 transition">
                                Log In
                            </Link>
                        </div>
                    </div>
                )}

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

                            {isRestricted && (
                                <span className="bg-amber-600 text-white px-4 py-2 rounded-full font-extrabold uppercase shadow-lg flex items-center gap-1.5">
                                    <FaLock /> {event.restriction_label || "Restricted Target Audience"}
                                </span>
                            )}

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

                                {isRestricted && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-2">
                                        <h4 className="font-extrabold text-amber-900 text-sm flex items-center gap-2">
                                            <FaLock className="text-amber-600" /> Target Audience Limitation: {event.restriction_label || "Restricted Event"}
                                        </h4>
                                        <p className="text-xs text-amber-800 leading-relaxed">
                                            This event is restricted. Outside attendees without an authorized email domain or student/company passcode are not permitted to reserve tickets.
                                        </p>
                                    </div>
                                )}

                                <div className="bg-gray-50 rounded-2xl p-8 border">
                                    <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                                    <p className="text-gray-700 leading-8 text-base">{event.description}</p>
                                </div>

                                {/* MULTI-SESSION EVENT SCHEDULE TIMETABLE */}
                                {schedules.length > 0 && (
                                    <div className="bg-white border border-purple-100 rounded-3xl p-8 shadow-xl space-y-6">
                                        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                            <div>
                                                <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                                                    <FaClock className="text-purple-600" /> Event Schedule & Session Timetable
                                                </h2>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Official multi-slot program lineup and stage schedules provided by the organizer.
                                                </p>
                                            </div>
                                            <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                                                {schedules.length} Sessions
                                            </span>
                                        </div>

                                        <div className="space-y-4">
                                            {schedules.map((session, idx) => (
                                                <div key={session.id || idx} className="bg-purple-50/50 border border-purple-100 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-purple-200 transition">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-purple-600 text-white">
                                                                {session.status || 'Scheduled'}
                                                            </span>
                                                            {session.hall_stage && (
                                                                <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                                                                    📍 {session.hall_stage}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h3 className="text-lg font-bold text-gray-900">{session.session_title}</h3>
                                                        <p className="text-xs text-gray-500 font-mono">
                                                            ⏰ {new Date(session.start_time).toLocaleString()} &rarr; {new Date(session.end_time).toLocaleTimeString()}
                                                        </p>
                                                        {session.speaker_performer && (
                                                            <p className="text-xs font-semibold text-purple-900">
                                                                🎤 Speaker / Performer: {session.speaker_performer}
                                                            </p>
                                                        )}
                                                        {session.description && (
                                                            <p className="text-xs text-gray-600 mt-2 bg-white p-3 rounded-xl border border-purple-100">
                                                                {session.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Side Sticky Booking/Waiting Card */}
                            <div className="bg-white rounded-3xl shadow-xl border p-8 h-fit sticky top-8 space-y-6">
                                <h3 className="text-2xl font-bold text-gray-900">Ticket Reservation</h3>

                                {/* DYNAMIC ORGANIZER TICKET CATEGORIES ONLY */}
                                <div className="space-y-3 text-xs border-t border-b py-4">
                                    <h4 className="font-extrabold text-gray-900 uppercase tracking-wider text-[11px] mb-1 flex items-center gap-1.5">
                                        <FaTag className="text-purple-600" /> Ticket Categories Added by Organizer
                                    </h4>
                                    
                                    <div className="space-y-2">
                                        {categoriesList.map((cat, idx) => (
                                            <div key={idx} className="bg-purple-50/80 border border-purple-200 rounded-xl p-3 flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-5 h-5 rounded-full bg-purple-200 text-purple-900 font-bold text-[10px] flex items-center justify-center shrink-0">
                                                        {idx + 1}
                                                    </span>
                                                    <div>
                                                        <p className="font-extrabold text-purple-950 text-xs">{cat.name || `Category ${idx + 1}`}</p>
                                                        <p className="text-[10px] text-purple-700 font-semibold">Organizer Set Pricing Tier</p>
                                                    </div>
                                                </div>
                                                <span className="font-black text-purple-900 text-sm">
                                                    {Number(cat.price) === 0 ? "FREE" : `Rs. ${Number(cat.price).toLocaleString()}`}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* PROMO CODE CAMPAIGN SECTION */}
                                <div className="bg-purple-50/70 border border-purple-200 p-4 rounded-2xl space-y-3">
                                    <label className="block text-[11px] font-extrabold uppercase text-purple-950 flex items-center gap-1.5">
                                        <FaTag className="text-purple-600" /> Have a Promo Code / Voucher?
                                    </label>
                                    
                                    <div className="flex gap-2">
                                        <input
                                            id="promo-code-input"
                                            type="text"
                                            placeholder="Enter Code (e.g. EVENT20)"
                                            value={promoInput}
                                            onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                                            className="w-full bg-white border border-purple-200 rounded-xl px-3 py-2 text-xs font-mono font-bold uppercase text-purple-950 focus:outline-none focus:border-purple-600"
                                        />
                                        <button
                                            id="apply-promo-btn"
                                            onClick={handleApplyPromoCode}
                                            disabled={!promoInput}
                                            className="px-4 py-2 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition shadow-md shrink-0 cursor-pointer"
                                        >
                                            Apply Code
                                        </button>
                                    </div>

                                    {promoError && (
                                        <p className="text-[11px] text-rose-600 font-semibold">{promoError}</p>
                                    )}

                                    {promoApplied && (
                                        <div className="bg-emerald-100 border border-emerald-300 text-emerald-950 p-3 rounded-xl text-xs space-y-1">
                                            <div className="flex justify-between items-center font-bold">
                                                <span>🎟️ Code '{promoApplied.code}' Applied!</span>
                                                <button
                                                    onClick={() => { setPromoApplied(null); setPromoInput(''); }}
                                                    className="text-emerald-700 hover:text-emerald-950 text-xs underline cursor-pointer"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                            <p className="text-[11px] text-emerald-800 font-medium">
                                                Discount Savings: <strong className="text-emerald-950">-LKR {Number(promoApplied.discount_amount).toLocaleString()}</strong>
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {isSoldOut ? (
                                    <div className="space-y-4">
                                        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-center text-xs text-rose-700 font-bold">
                                            ⚠️ All seats for this event are fully booked!
                                        </div>

                                        <button
                                            onClick={handleJoinWaitingList}
                                            className={`w-full py-4 rounded-2xl font-extrabold text-sm transition shadow-lg flex items-center justify-center gap-2 ${
                                                isWaiting
                                                    ? "bg-amber-500 hover:bg-amber-600 text-white"
                                                    : "bg-purple-700 hover:bg-purple-800 text-white"
                                            }`}
                                        >
                                            <FaUserClock />
                                            {isWaiting
                                                ? `In Waiting List (Position #${waitingPos || 1}) - Leave`
                                                : "Join Priority Waiting List"}
                                        </button>
                                    </div>
                                ) : (
                                    <Link
                                        to={`/book/${event.id}`}
                                        onClick={handleBookTicketClick}
                                        className="w-full block text-center py-4 bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-sm rounded-2xl shadow-xl transition cursor-pointer"
                                    >
                                        <FaTicketAlt className="inline mr-2" /> Reserve Seats & Book Ticket
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* GUEST CUSTOMER VERIFICATION MODAL */}
            {guestModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative border border-purple-100">
                        <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto text-3xl">
                            <FaShieldAlt />
                        </div>

                        <div>
                            <h3 className="text-2xl font-black text-gray-900">Verified Customer Required</h3>
                            <p className="text-gray-600 text-xs mt-2 leading-relaxed">
                                You are currently browsing as a <strong>Guest Customer</strong>. Accessing <strong>"{guestModal.featureName}"</strong> requires a registered customer account!
                            </p>
                        </div>

                        <div className="space-y-3 pt-2">
                            <Link
                                to="/register"
                                className="w-full py-3.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                            >
                                <FaUserPlus /> Register New Account
                            </Link>
                            <Link
                                to="/login"
                                className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm rounded-xl transition flex items-center justify-center gap-2"
                            >
                                <FaSignInAlt /> Log In to Existing Account
                            </Link>
                        </div>

                        <button
                            onClick={() => setGuestModal({ open: false, featureName: "" })}
                            className="text-xs text-gray-400 hover:text-gray-600 font-semibold underline cursor-pointer pt-2 block mx-auto"
                        >
                            Continue Browsing as Guest
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventDetails;