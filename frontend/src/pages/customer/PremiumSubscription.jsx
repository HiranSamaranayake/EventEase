import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaCrown, FaCheckCircle, FaStar, FaBolt, FaTag, FaClock, FaShieldAlt, FaCreditCard, FaSyncAlt } from "react-icons/fa";

const PremiumSubscription = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const subSuccess = searchParams.get("sub_success");
  const subId = searchParams.get("sub_id");

  useEffect(() => {
    if (!currentUser || !currentUser.id) {
      navigate("/login");
      return;
    }

    if (subSuccess === "true" && subId) {
      confirmSubscriptionPayment(subId);
    } else {
      fetchUserSubscription();
    }
  }, []);

  const fetchUserSubscription = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost/EventEase/backend/api/get_user_subscription.php?user_id=${currentUser.id}`);
      const data = await res.json();
      if (data.success) {
        setSubscription(data.subscription);

        // Sync local storage user tier if active
        if (data.subscription?.is_active) {
          currentUser.user_tier = "premium";
          localStorage.setItem("user", JSON.stringify(currentUser));
        }
      }
    } catch (err) {
      console.error("Error fetching subscription:", err);
    } finally {
      setLoading(false);
    }
  };

  const confirmSubscriptionPayment = async (subscriptionId) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost/EventEase/backend/api/confirm_premium_payment.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: currentUser.id, subscription_id: subscriptionId })
      });
      const data = await res.json();
      if (data.success) {
        setSubscription(data.subscription);
        currentUser.user_tier = "premium";
        localStorage.setItem("user", JSON.stringify(currentUser));
        setToastMessage("🎉 Congratulations! Your Premium VIP Membership is now ACTIVE!");
      }
    } catch (err) {
      console.error("Error confirming subscription:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    setPaying(true);
    try {
      const res = await fetch("http://localhost/EventEase/backend/api/create_premium_subscription.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: currentUser.id })
      });

      const data = await res.json();
      if (!data.success || !data.payhere_data) {
        alert(data.message || "Failed to initiate PayHere payment.");
        setPaying(false);
        return;
      }

      // Configure PayHere JS SDK or form submission
      const p = data.payhere_data;
      if (window.payhere) {
        window.payhere.onCompleted = function (orderId) {
          confirmSubscriptionPayment(p.order_id);
        };
        window.payhere.onDismissed = function () {
          setPaying(false);
        };
        window.payhere.onError = function (error) {
          alert("PayHere Error: " + error);
          setPaying(false);
        };
        window.payhere.startPayment(p);
      } else {
        // Fallback for simulation / environment without PayHere JS SDK script loaded
        confirmSubscriptionPayment(p.order_id);
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Error processing subscription payment.");
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-slate-400">Loading Premium Membership status...</p>
        </div>
      </div>
    );
  }

  const isActive = subscription?.is_active === true;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Toast Alert */}
        {toastMessage && (
          <div className="bg-emerald-500 text-slate-950 font-black p-4 rounded-2xl shadow-2xl text-center text-sm animate-bounce flex items-center justify-center gap-2">
            <FaCheckCircle className="text-xl" /> {toastMessage}
          </div>
        )}

        {/* Hero Header */}
        <div className="text-center space-y-3 bg-gradient-to-r from-purple-900/40 via-amber-900/30 to-indigo-900/40 border border-amber-500/30 p-8 sm:p-12 rounded-3xl backdrop-blur-xl shadow-2xl">
          <span className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/40 font-black text-xs uppercase px-4 py-1.5 rounded-full">
            <FaCrown className="text-amber-400 text-sm" /> Exclusive Customer Tier
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            EventEase <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">Premium VIP Membership</span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-base max-w-2xl mx-auto font-medium">
            Unlock early access event bookings, 10% exclusive checkout discounts, #1 queue priority pass, and urgent customer support routing.
          </p>
        </div>

        {/* Membership Status Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Membership Status</p>
              <h2 className="text-2xl font-black text-white mt-1 flex items-center gap-2">
                {isActive ? (
                  <span className="text-emerald-400 flex items-center gap-2">
                    <FaCheckCircle className="text-emerald-400" /> Premium Membership Active
                  </span>
                ) : (
                  <span className="text-slate-400 flex items-center gap-2">
                    ⚪ Standard Customer (Inactive)
                  </span>
                )}
              </h2>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-center shrink-0">
              <span className="text-xs text-amber-300 font-bold block uppercase">Subscription Pricing</span>
              <span className="text-2xl font-black text-amber-400">LKR 1,500 <span className="text-xs font-normal text-slate-400">/ month</span></span>
            </div>
          </div>

          {/* Active Subscription Details */}
          {isActive ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl text-xs">
              <div>
                <span className="text-slate-400 font-bold block">Start Date:</span>
                <span className="text-white font-black text-sm">{new Date(subscription.subscription_start_date).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Expiry / Renewal Date:</span>
                <span className="text-amber-300 font-black text-sm">{new Date(subscription.subscription_expiry_date).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Validity Remaining:</span>
                <span className="text-emerald-400 font-black text-sm">{subscription.days_remaining} Days Active</span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-800/60 border border-slate-700 p-5 rounded-2xl text-xs text-slate-300 space-y-2">
              <p className="font-bold text-amber-300 flex items-center gap-2">
                ⚠️ Your Premium Membership is currently inactive or expired.
              </p>
              <p>
                Subscribe now to activate your 1-month Premium VIP pass and instantly access Early Access event bookings and 10% checkout discounts.
              </p>
            </div>
          )}

          {/* Subscribe / Renew Action Button */}
          <div className="pt-2">
            {!isActive ? (
              <button
                onClick={handleSubscribe}
                disabled={paying}
                className="w-full py-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-purple-600 hover:from-amber-600 hover:to-purple-700 disabled:opacity-50 text-slate-950 font-black text-base rounded-2xl shadow-xl shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <FaCreditCard className="text-lg" /> {paying ? "Redirecting to PayHere Checkout..." : "Become Premium - Pay LKR 1,500 via PayHere"}
              </button>
            ) : (
              <button
                onClick={handleSubscribe}
                disabled={paying}
                className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 font-extrabold text-sm rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <FaSyncAlt /> Extend / Renew Monthly Subscription (LKR 1,500)
              </button>
            )}
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center text-xl">
              <FaBolt />
            </div>
            <h3 className="text-lg font-black text-white">Early Access Booking</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Book tickets 24+ hours before general public release during exclusive organizer early access windows.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xl">
              <FaTag />
            </div>
            <h3 className="text-lg font-black text-white">10% VIP Discount</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Enjoy an automatic 10% exclusive discount on all event ticket purchases applied instantly at checkout.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center text-xl">
              <FaStar />
            </div>
            <h3 className="text-lg font-black text-white">Priority Queue Pass</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Gain top queue rank (#1 Priority Position) when joining waiting lists for high-demand sold out events.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center justify-center text-xl">
              <FaShieldAlt />
            </div>
            <h3 className="text-lg font-black text-white">Urgent Support Priority</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Your customer support complaints are automatically routed to the top of the Junior Support Admin queue with Urgent status.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PremiumSubscription;
