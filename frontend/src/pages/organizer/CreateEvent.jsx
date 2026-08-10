import { useState } from "react";
import { FaTag, FaPlus, FaTrash, FaCheckCircle, FaExclamationCircle, FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaImage, FaList, FaLayerGroup, FaLock, FaGraduationCap, FaBriefcase, FaGlobe } from "react-icons/fa";

const CreateEvent = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("18:00");
  const [premiumBookingOpenDate, setPremiumBookingOpenDate] = useState("");
  const [normalBookingOpenDate, setNormalBookingOpenDate] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [capacity, setCapacity] = useState("");
  const [category, setCategory] = useState("General");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pricing mode state: 'common' or 'custom'
  const [pricingType, setPricingType] = useState("common");
  const [commonPrice, setCommonPrice] = useState("");

  // Dynamic custom categories array state
  const [customCategories, setCustomCategories] = useState([
    { name: "VIP Front Row", price: "5000" },
    { name: "Platinum Tier", price: "3500" },
    { name: "Gold Tier", price: "2500" },
    { name: "Standard Tier", price: "1500" }
  ]);

  // Audience Restriction states: 'public', 'university_students', 'company_employees', 'custom_domain'
  const [audienceRestrictionType, setAudienceRestrictionType] = useState("public");
  const [allowedEmailDomain, setAllowedEmailDomain] = useState("ac.lk, edu.lk, edu");
  const [audiencePasscode, setAudiencePasscode] = useState("UNI2026");
  const [restrictionLabel, setRestrictionLabel] = useState("University Students Only");

  const handleRestrictionTypeChange = (type) => {
    setAudienceRestrictionType(type);
    if (type === "university_students") {
      setAllowedEmailDomain("ac.lk, edu.lk, edu, univ.ac.lk");
      setAudiencePasscode("UNI2026");
      setRestrictionLabel("University Students Only");
    } else if (type === "company_employees") {
      setAllowedEmailDomain("company.com, org.lk, inc.com, corp.com");
      setAudiencePasscode("CORP2026");
      setRestrictionLabel("Company / Corporate Employees Only");
    } else if (type === "custom_domain") {
      setAllowedEmailDomain("customdomain.com");
      setAudiencePasscode("ACCESS2026");
      setRestrictionLabel("Restricted Target Audience Event");
    }
  };

  const getMinNormalBookingDate = (premDateStr) => {
    if (!premDateStr) return "";
    const premDate = new Date(premDateStr);
    if (isNaN(premDate.getTime())) return "";
    const minNormDate = new Date(premDate.getTime() + 86400000); // Exactly +24 hours
    const pad = (n) => (n < 10 ? "0" + n : n);
    const y = minNormDate.getFullYear();
    const m = pad(minNormDate.getMonth() + 1);
    const d = pad(minNormDate.getDate());
    const h = pad(minNormDate.getHours());
    const min = pad(minNormDate.getMinutes());
    return `${y}-${m}-${d}T${h}:${min}`;
  };

  const handlePremiumDateChange = (val) => {
    setPremiumBookingOpenDate(val);
    if (val && normalBookingOpenDate) {
      const premTime = new Date(val).getTime();
      const normTime = new Date(normalBookingOpenDate).getTime();
      if (normTime - premTime < 86400000) {
        setMessage("Normal booking must open at least 24 hours after Premium booking.");
        setIsSuccess(false);
      } else {
        if (message === "Normal booking must open at least 24 hours after Premium booking.") {
          setMessage("");
        }
      }
    }
  };

  const handleNormalDateChange = (val) => {
    setNormalBookingOpenDate(val);
    if (premiumBookingOpenDate && val) {
      const premTime = new Date(premiumBookingOpenDate).getTime();
      const normTime = new Date(val).getTime();
      if (normTime - premTime < 86400000) {
        setMessage("Normal booking must open at least 24 hours after Premium booking.");
        setIsSuccess(false);
      } else {
        if (message === "Normal booking must open at least 24 hours after Premium booking.") {
          setMessage("");
        }
      }
    }
  };

  const handleAddCategory = () => {
    setCustomCategories([
      ...customCategories,
      { name: `Category ${customCategories.length + 1}`, price: "" }
    ]);
  };

  const handleRemoveCategory = (index) => {
    if (customCategories.length <= 1) {
      alert("At least one category is required.");
      return;
    }
    setCustomCategories(customCategories.filter((_, idx) => idx !== index));
  };

  const handleCategoryChange = (index, field, value) => {
    const updated = [...customCategories];
    updated[index][field] = value;
    setCustomCategories(updated);
  };

  const createEvent = () => {
    if (!user || !user.id) {
      setMessage("Please log in as an organizer to create events.");
      setIsSuccess(false);
      return;
    }

    if (!title || !description || !eventDate || !location) {
      setMessage("Please fill in all required event details.");
      setIsSuccess(false);
      return;
    }

    if (premiumBookingOpenDate && normalBookingOpenDate) {
      const premTime = new Date(premiumBookingOpenDate).getTime();
      const normTime = new Date(normalBookingOpenDate).getTime();
      if (normTime - premTime < 86400000) {
        setMessage("Normal booking must open at least 24 hours after Premium booking.");
        setIsSuccess(false);
        return;
      }
    }

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("event_date", eventDate);
    formData.append("event_time", eventTime);
    formData.append("premium_booking_open_date", premiumBookingOpenDate);
    formData.append("normal_booking_open_date", normalBookingOpenDate);
    formData.append("location", location);
    formData.append("capacity", capacity);
    formData.append("category", category);
    formData.append("user_id", user.id);
    formData.append("pricing_type", pricingType);

    // Target audience restrictions
    formData.append("audience_restriction_type", audienceRestrictionType);
    formData.append("allowed_email_domain", allowedEmailDomain);
    formData.append("audience_passcode", audiencePasscode);
    formData.append("restriction_label", restrictionLabel);

    if (pricingType === "common") {
      formData.append("price", commonPrice);
      formData.append("custom_categories", JSON.stringify([
        { name: "General Admission", price: commonPrice }
      ]));
    } else {
      const basePriceVal = customCategories[customCategories.length - 1]?.price || customCategories[0]?.price || "0";
      formData.append("price", basePriceVal);
      formData.append("custom_categories", JSON.stringify(customCategories));
    }

    if (image) {
      formData.append("image", image);
    }

    fetch("http://localhost/EventEase/backend/api/create_event.php", {
      method: "POST",
      body: formData
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setIsSuccess(true);
          setMessage("✅ Event is Created Successfully!");

          setTitle("");
          setDescription("");
          setEventDate("");
          setLocation("");
          setCommonPrice("");
          setCapacity("");
          setCategory("General");
          setImage(null);
        } else {
          setIsSuccess(false);
          setMessage(data.message || "Failed to create event");
        }
      })
      .catch((err) => {
        console.error(err);
        setIsSuccess(false);
        setMessage("Server error creating event.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex justify-center items-center p-4 sm:p-8">
      <div className="bg-white border border-gray-200 shadow-xl rounded-3xl p-6 sm:p-10 w-full max-w-3xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-1 border-b border-gray-100 pb-4">
          <h1 className="text-3xl font-extrabold text-purple-800 tracking-tight">
            Create Event
          </h1>
          <p className="text-xs text-gray-500">
            Approved Organizers: Define event details, ticket categories, and target audience restrictions.
          </p>
        </div>

        <div className="space-y-6">
          {/* Event Title */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1 flex items-center gap-1.5">
              <FaTag className="text-purple-600" /> Event Title *
            </label>
            <input
              type="text"
              placeholder="e.g. University Tech Symposium 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
            />
          </div>

          {/* Event Description */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1 flex items-center gap-1.5">
              <FaList className="text-purple-600" /> Description *
            </label>
            <textarea
              placeholder="Provide a compelling description for attendees..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-3 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
              rows="4"
            />
          </div>

          {/* Event Date, Time & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1 flex items-center gap-1.5">
                <FaCalendarAlt className="text-purple-600" /> Event Date *
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1 flex items-center gap-1.5">
                <FaCalendarAlt className="text-purple-600" /> Event Start Time *
              </label>
              <input
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1 flex items-center gap-1.5">
                <FaMapMarkerAlt className="text-purple-600" /> Location / Venue *
              </label>
              <input
                type="text"
                placeholder="e.g. University Main Auditorium"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
              />
            </div>
          </div>

          {/* TWO BOOKING OPENING DATES SECTION */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-3">
            <div className="border-b border-amber-200 pb-2">
              <h3 className="text-sm font-extrabold text-amber-900 flex items-center gap-1.5">
                ⭐ Staggered Ticket Booking Opening Schedule
              </h3>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Rule: General booking opening date must be at least <strong>1 full day (24 hours)</strong> after the Premium member booking opening date.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-amber-950 uppercase mb-1 flex items-center gap-1">
                  ⭐ Premium Booking Opening Date *
                </label>
                <input
                  type="datetime-local"
                  value={premiumBookingOpenDate}
                  onChange={(e) => handlePremiumDateChange(e.target.value)}
                  className="w-full bg-white border border-amber-300 rounded-xl p-3 text-xs font-bold text-amber-950 focus:ring-2 focus:ring-amber-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1 flex items-center gap-1">
                  🌐 General Customer Booking Opening Date *
                </label>
                <input
                  type="datetime-local"
                  value={normalBookingOpenDate}
                  min={getMinNormalBookingDate(premiumBookingOpenDate)}
                  onChange={(e) => handleNormalDateChange(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl p-3 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-purple-500 outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* Maximum Capacity & Event Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1 flex items-center gap-1.5">
                <FaUsers className="text-purple-600" /> Maximum Capacity
              </label>
              <input
                type="number"
                placeholder="e.g. 500"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1 flex items-center gap-1.5">
                <FaLayerGroup className="text-purple-600" /> Genre / Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition"
              >
                <option value="General">General</option>
                <option value="Education">Education / University</option>
                <option value="Technology">Technology</option>
                <option value="Business">Business / Corporate</option>
                <option value="Sports">Sports</option>
                <option value="Music">Music</option>
                <option value="Entertainment">Entertainment</option>
              </select>
            </div>
          </div>

          {/* TARGET AUDIENCE & ACCESS RESTRICTION SECTION */}
          <div className="bg-indigo-50/60 border border-indigo-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-indigo-200 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-indigo-900 flex items-center gap-1.5">
                  <FaLock className="text-indigo-600" /> Target Audience Access & Email Limitations
                </h3>
                <p className="text-[11px] text-gray-500 mt-0.5">Limit bookings to specific university or company email domains.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm">
              <button
                type="button"
                onClick={() => handleRestrictionTypeChange("public")}
                className={`py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  audienceRestrictionType === "public"
                    ? "bg-indigo-700 text-white shadow"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FaUsers /> Public (All Attendees)
              </button>

              <button
                type="button"
                onClick={() => handleRestrictionTypeChange("university_students")}
                className={`py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  audienceRestrictionType === "university_students"
                    ? "bg-indigo-700 text-white shadow"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FaGraduationCap /> University Email Only
              </button>

              <button
                type="button"
                onClick={() => handleRestrictionTypeChange("company_employees")}
                className={`py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  audienceRestrictionType === "company_employees"
                    ? "bg-indigo-700 text-white shadow"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FaBriefcase /> Company Email Only
              </button>
            </div>

            {audienceRestrictionType !== "public" && (
              <div className="space-y-3 pt-2 bg-white p-4 rounded-xl border border-indigo-200 shadow-sm text-xs">
                <p className="font-extrabold text-indigo-900 flex items-center gap-1.5 text-xs">
                  <FaLock className="text-indigo-600" /> Target Audience Email Limitation & Verification Setup:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Allowed Email Domains (Comma-Separated) *</label>
                    <input
                      type="text"
                      value={allowedEmailDomain}
                      onChange={(e) => setAllowedEmailDomain(e.target.value)}
                      placeholder="e.g. ac.lk, edu.lk, company.com"
                      className="w-full border border-gray-300 rounded-lg p-2.5 font-mono text-gray-800 outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Access Passcode (Alternative Verification) *</label>
                    <input
                      type="text"
                      value={audiencePasscode}
                      onChange={(e) => setAudiencePasscode(e.target.value)}
                      placeholder="e.g. UNI2026 or CORP2026"
                      className="w-full border border-gray-300 rounded-lg p-2.5 font-mono font-bold text-indigo-900 outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-1">Restriction Notice Banner Label</label>
                  <input
                    type="text"
                    value={restrictionLabel}
                    onChange={(e) => setRestrictionLabel(e.target.value)}
                    placeholder="e.g. University Students Only (Verified University Email Required)"
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-800 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* DYNAMIC TICKET PRICING & CUSTOM CATEGORIES */}
          <div className="bg-purple-50/60 border border-purple-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-purple-200 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-purple-900 flex items-center gap-1.5">
                  <FaTag className="text-purple-600" /> Ticket Pricing Options
                </h3>
                <p className="text-[11px] text-gray-500 mt-0.5">Choose single common price for all seats or define custom categories with custom prices.</p>
              </div>
            </div>

            {/* Pricing Mode Toggle */}
            <div className="grid grid-cols-2 gap-3 bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm">
              <button
                type="button"
                onClick={() => setPricingType("common")}
                className={`py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  pricingType === "common"
                    ? "bg-purple-700 text-white shadow"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FaTag /> Common Price (One Price for All)
              </button>

              <button
                type="button"
                onClick={() => setPricingType("custom")}
                className={`py-2.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  pricingType === "custom"
                    ? "bg-purple-700 text-white shadow"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FaLayerGroup /> Custom Categories & Prices
              </button>
            </div>

            {/* Common Price Input */}
            {pricingType === "common" && (
              <div className="space-y-1 pt-1">
                <label className="block text-xs font-bold text-gray-700">Common Ticket Price (LKR)</label>
                <input
                  type="number"
                  placeholder="e.g. 2000 (Single uniform price for all tickets)"
                  value={commonPrice}
                  onChange={(e) => setCommonPrice(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm text-gray-900 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            )}

            {/* Dynamic Custom Categories List */}
            {pricingType === "custom" && (
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-900">Define Ticket Categories & Category Prices:</span>
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="px-3 py-1 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-lg transition flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    <FaPlus className="text-[10px]" /> Add Category
                  </button>
                </div>

                <div className="space-y-2">
                  {customCategories.map((cat, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-gray-200 shadow-sm">
                      <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        placeholder="Category Name (e.g. VVIP, Balcony)"
                        value={cat.name}
                        onChange={(e) => handleCategoryChange(idx, "name", e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg p-2 text-xs font-semibold text-gray-800 outline-none focus:border-purple-500"
                      />
                      <div className="w-36 flex items-center gap-1">
                        <span className="text-[11px] text-gray-500 font-bold">LKR</span>
                        <input
                          type="number"
                          placeholder="Price"
                          value={cat.price}
                          onChange={(e) => handleCategoryChange(idx, "price", e.target.value)}
                          className="w-full border border-gray-300 rounded-lg p-2 text-xs font-bold text-gray-900 outline-none focus:border-purple-500"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(idx)}
                        className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition text-xs shrink-0"
                        title="Remove Category"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Banner Image */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1 flex items-center gap-1.5">
              <FaImage className="text-purple-600" /> Event Banner Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full border border-gray-300 rounded-xl p-2.5 text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-purple-700 file:text-white hover:file:bg-purple-800"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={createEvent}
            disabled={loading}
            className="w-full bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-extrabold py-3.5 rounded-xl shadow-lg transition text-sm cursor-pointer"
          >
            {loading ? "Creating Event..." : "Create Event"}
          </button>

          {/* GREEN COLOR SUCCESS MESSAGE BANNER AT THE END OF THE BOX */}
          {message && (
            <div className={`p-4 rounded-2xl text-xs font-extrabold flex items-center gap-2 border shadow-md animate-fadeIn mt-4 ${
              isSuccess
                ? "bg-green-100 border-green-400 text-green-800"
                : "bg-red-100 border-red-400 text-red-800"
            }`}>
              {isSuccess ? (
                <FaCheckCircle className="text-green-600 text-lg shrink-0" />
              ) : (
                <FaExclamationCircle className="text-red-600 text-lg shrink-0" />
              )}
              <span>{message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
