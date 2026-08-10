import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUsers, FaMoneyBillWave, FaTag, FaLock, FaCheckCircle, FaArrowLeft } from "react-icons/fa";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("18:00");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("General");

  const [pricingType, setPricingType] = useState("common");
  const [customCategories, setCustomCategories] = useState([]);
  const [audienceRestrictionType, setAudienceRestrictionType] = useState("public");
  const [allowedEmailDomain, setAllowedEmailDomain] = useState("");
  const [audiencePasscode, setAudiencePasscode] = useState("");
  const [restrictionLabel, setRestrictionLabel] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  useEffect(() => {
    fetch(`http://localhost/EventEase/backend/api/get_event.php?id=${id}&user_id=${user.id || 0}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.event) {
          const ev = data.event;
          setTitle(ev.title || "");
          setDescription(ev.description || "");
          setEventDate(ev.event_date || "");
          setEventTime(ev.event_time || "18:00");
          setLocation(ev.location || "");
          setCapacity(ev.capacity || "");
          setPrice(ev.price || "");
          setCategory(ev.category || "General");
          setPricingType(ev.pricing_type || "common");

          if (ev.custom_categories) {
            try {
              setCustomCategories(JSON.parse(ev.custom_categories));
            } catch (e) {
              setCustomCategories([]);
            }
          }

          setAudienceRestrictionType(ev.audience_restriction_type || "public");
          setAllowedEmailDomain(ev.allowed_email_domain || "");
          setAudiencePasscode(ev.audience_passcode || "");
          setRestrictionLabel(ev.restriction_label || "");
        } else {
          setIsUnauthorized(true);
          setMessage(data.message || "Unauthorized access: You do not have permission to view or edit this event.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const updateEvent = (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setMessage("");

    fetch("http://localhost/EventEase/backend/api/update_event.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_id: id,
        user_id: user?.id,
        title,
        description,
        event_date: eventDate,
        event_time: eventTime,
        location,
        capacity,
        price,
        category,
        pricing_type: pricingType,
        custom_categories: JSON.stringify(customCategories),
        audience_restriction_type: audienceRestrictionType,
        allowed_email_domain: allowedEmailDomain,
        audience_passcode: audiencePasscode,
        restriction_label: restrictionLabel
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessage("✅ Event updated successfully!");
          setTimeout(() => navigate("/organizer/my-events"), 1200);
        } else {
          setMessage(data.message || "Failed to update event");
        }
      })
      .catch((err) => {
        console.error(err);
        setMessage("Server error updating event.");
      })
      .finally(() => setSaving(false));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isUnauthorized) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-rose-50 border-2 border-rose-300 rounded-3xl text-center space-y-4 shadow-xl">
        <div className="text-5xl">🚫</div>
        <h2 className="text-xl font-extrabold text-rose-900">Access Denied</h2>
        <p className="text-xs text-rose-800 font-semibold">{message}</p>
        <button
          onClick={() => navigate("/organizer/my-events")}
          className="px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow transition"
        >
          Return to My Events
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <button
        onClick={() => navigate("/organizer/my-events")}
        className="flex items-center gap-2 text-xs font-bold text-purple-700 hover:text-purple-900 transition"
      >
        <FaArrowLeft /> Back to My Events
      </button>

      <div className="bg-white shadow-xl rounded-3xl p-8 border border-gray-100 space-y-6">
        <h1 className="text-2xl font-extrabold text-purple-900 border-b pb-4">
          Edit Event Details & Pricing Tiers
        </h1>

        {message && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold text-xs flex items-center gap-2 shadow-sm">
            <FaCheckCircle className="text-emerald-600" /> {message}
          </div>
        )}

        <form onSubmit={updateEvent} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Event Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded-2xl p-3.5 text-xs outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded-2xl p-3.5 text-xs outline-none focus:ring-2 focus:ring-purple-600 bg-white"
              >
                <option value="Music">Music</option>
                <option value="Conference">Conference</option>
                <option value="Workshop">Workshop</option>
                <option value="Sports">Sports</option>
                <option value="Festival">Festival</option>
                <option value="Technology">Technology</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase flex items-center gap-1.5">
                <FaCalendarAlt className="text-purple-600" /> Event Date *
              </label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full border rounded-2xl p-3.5 text-xs outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase flex items-center gap-1.5">
                <FaClock className="text-purple-600" /> Event Start Time *
              </label>
              <input
                type="time"
                required
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="w-full border rounded-2xl p-3.5 text-xs outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase flex items-center gap-1.5">
                <FaMapMarkerAlt className="text-purple-600" /> Venue / Location *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border rounded-2xl p-3.5 text-xs outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2 uppercase flex items-center gap-1.5">
                <FaUsers className="text-purple-600" /> Total Capacity (Seats) *
              </label>
              <input
                type="number"
                required
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full border rounded-2xl p-3.5 text-xs outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">Event Description *</label>
            <textarea
              rows="4"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-2xl p-3.5 text-xs outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Pricing Config */}
          <div className="border-2 border-purple-100 rounded-3xl p-6 bg-purple-50/40 space-y-4">
            <h3 className="text-xs font-black uppercase text-purple-900 flex items-center gap-2">
              <FaMoneyBillWave className="text-purple-600" /> Standard / Common Ticket Price (LKR)
            </h3>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 1500"
              className="w-full border rounded-2xl p-3.5 text-xs outline-none focus:ring-2 focus:ring-purple-600 bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-sm rounded-2xl shadow-xl transition flex items-center justify-center gap-2"
          >
            {saving ? "Saving Changes..." : "Save Event Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
