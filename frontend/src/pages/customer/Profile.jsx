import { useEffect, useState } from "react";
import { FaUserCheck, FaPhone, FaEnvelope, FaIdBadge, FaCalendarAlt, FaSave, FaCheckCircle, FaUserCircle } from "react-icons/fa";

const Profile = () => {
    const user = JSON.parse(localStorage.getItem("user")) || {};

    const [profile, setProfile] = useState(null);
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const loadProfile = () => {
        if (!user.id) {
            setLoading(false);
            return;
        }
        fetch(`http://localhost/EventEase/backend/api/profile.php?user_id=${user.id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setProfile(data.user);
                    setFullName(data.user.full_name || "");
                    setPhone(data.user.phone || "");
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const updateProfile = () => {
        if (!fullName.trim()) {
            setMessage("❌ Full Name is required");
            return;
        }

        fetch("http://localhost/EventEase/backend/api/update_profile.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: user.id,
                full_name: fullName,
                phone: phone
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setMessage("✅ Profile updated successfully!");
                    const updatedUser = { ...user, full_name: fullName, phone: phone };
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                    loadProfile();
                } else {
                    setMessage("❌ Failed to update profile.");
                }
            })
            .catch(err => {
                console.error(err);
                setMessage("❌ Server error updating profile");
            });
    };

    if (loading || !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6 flex justify-center items-center">
            <div className="bg-white shadow-2xl rounded-3xl p-8 sm:p-12 w-full max-w-2xl border border-gray-100 space-y-8">
                {/* Header with Avatar */}
                <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-gray-100">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-4xl shadow-xl border-4 border-white">
                        {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : <FaUserCircle />}
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        {profile.full_name || "User Profile"}
                    </h1>
                    <span className="bg-purple-100 text-purple-800 text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full border border-purple-200 flex items-center gap-1.5">
                        <FaIdBadge className="text-purple-600" /> Role: {profile.role || "Customer"}
                    </span>
                </div>

                {message && (
                    <div className={`px-4 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 ${
                        message.includes("✅") ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"
                    }`}>
                        <FaCheckCircle /> {message}
                    </div>
                )}

                {/* Profile Form */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <FaUserCheck className="text-purple-600" /> Full Name
                        </label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-slate-50 border border-gray-200 rounded-2xl p-4 text-gray-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <FaEnvelope className="text-indigo-600" /> Email Address
                        </label>
                        <div className="w-full bg-slate-100 border border-gray-200 rounded-2xl p-4 text-gray-700 font-medium text-sm cursor-not-allowed">
                            {profile.email}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <FaPhone className="text-emerald-600" /> Phone Number
                        </label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-slate-50 border border-gray-200 rounded-2xl p-4 text-gray-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="bg-slate-50 border border-gray-200 p-4 rounded-2xl">
                            <span className="text-[10px] font-bold text-gray-400 uppercase block">Account Type</span>
                            <span className="text-sm font-extrabold text-gray-800 capitalize">{profile.role}</span>
                        </div>
                        <div className="bg-slate-50 border border-gray-200 p-4 rounded-2xl">
                            <span className="text-[10px] font-bold text-gray-400 uppercase block">Membership Tier</span>
                            <span className={`text-sm font-extrabold capitalize ${profile.user_tier === 'premium' ? 'text-amber-600 flex items-center gap-1' : 'text-gray-800'}`}>
                                {profile.user_tier === 'premium' ? '⭐ Premium VIP' : 'Standard Verified'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Premium Membership Card (Function 10 Requirement) */}
                <div className={`p-6 rounded-3xl border-2 transition-all ${
                    profile.user_tier === 'premium'
                        ? 'bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-amber-600/10 border-amber-400 shadow-xl'
                        : 'bg-slate-900 text-white border-slate-800 shadow-2xl'
                }`}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">👑</span>
                            <h3 className={`text-lg font-black tracking-tight ${profile.user_tier === 'premium' ? 'text-amber-900' : 'text-yellow-400'}`}>
                                {profile.user_tier === 'premium' ? 'Premium VIP Membership Active' : 'Upgrade to Premium Customer'}
                            </h3>
                        </div>
                        <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase ${
                            profile.user_tier === 'premium' ? 'bg-amber-400 text-amber-950' : 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/30'
                        }`}>
                            {profile.user_tier === 'premium' ? 'VIP Status' : 'Exclusive'}
                        </span>
                    </div>
                    <p className={`text-xs leading-relaxed mb-4 ${profile.user_tier === 'premium' ? 'text-amber-900/80 font-medium' : 'text-slate-300'}`}>
                        {profile.user_tier === 'premium'
                            ? 'You are enjoying 10% exclusive ticket discounts, early access booking, priority reservation privileges, and VIP support!'
                            : 'Unlock 10% exclusive event discounts, priority ticket reservations, early access event passes, and priority customer support.'
                        }
                    </p>
                    {profile.user_tier !== 'premium' ? (
                        <button
                            onClick={() => {
                                fetch("http://localhost/EventEase/backend/api/upgrade_tier.php", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ user_id: user.id, user_tier: "premium" })
                                })
                                    .then(res => res.json())
                                    .then(data => {
                                        if (data.success) {
                                            setMessage("🎉 Congratulations! Upgraded to Premium VIP Customer.");
                                            const updated = { ...user, user_tier: "premium" };
                                            localStorage.setItem("user", JSON.stringify(updated));
                                            loadProfile();
                                        }
                                    });
                            }}
                            className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 font-black py-3 rounded-2xl text-xs uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-2"
                        >
                            👑 Upgrade to Premium VIP Now
                        </button>
                    ) : (
                        <div className="bg-amber-500/20 border border-amber-400/40 rounded-2xl p-3 text-xs font-bold text-amber-900 text-center">
                            ✅ 10% Premium Discount Automatically Applied at Checkout
                        </div>
                    )}
                </div>

                <div className="pt-2">
                    <button
                        onClick={updateProfile}
                        className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-800 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-purple-600/30 transition flex items-center justify-center gap-2"
                    >
                        <FaSave /> Save Profile Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;