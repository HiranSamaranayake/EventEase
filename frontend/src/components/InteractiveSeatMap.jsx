import { useState, useEffect } from "react";
import { FaCouch, FaCheck, FaLock, FaLayerGroup, FaTicketAlt, FaInfoCircle } from "react-icons/fa";

const InteractiveSeatMap = ({ eventId, basePrice, onSeatSelectionChange }) => {
  const [loading, setLoading] = useState(true);
  const [tiers, setTiers] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    if (!eventId) return;
    fetchSeatMap();
  }, [eventId]);

  const fetchSeatMap = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost/EventEase/backend/api/get_event_seat_map.php?event_id=${eventId}`);
      const data = await res.json();
      if (data.success) {
        setTiers(data.tiers);
        setBookedSeats(data.booked_seats || []);
      }
    } catch (err) {
      console.error("Failed to load seat map", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seatCode, tierName, price) => {
    if (bookedSeats.includes(seatCode)) return;

    setSelectedSeats((prev) => {
      const exists = prev.some((s) => s.seat_code === seatCode);
      let updated;
      if (exists) {
        updated = prev.filter((s) => s.seat_code !== seatCode);
      } else {
        updated = [...prev, { seat_code: seatCode, tier_name: tierName, price: price }];
      }

      if (onSeatSelectionChange) {
        onSeatSelectionChange(updated);
      }
      return updated;
    });
  };

  const totalPrice = selectedSeats.reduce((sum, s) => sum + floatVal(s.price), 0);

  function floatVal(val) {
    return parseFloat(val) || 0;
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-slate-900/60 rounded-3xl border border-white/10 space-y-3">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-400 font-semibold">Generating Venue Seat Map...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 border border-white/10 rounded-[2.5rem] p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-8 text-slate-100">
      
      {/* Header & Stage Visual */}
      <div className="space-y-4 text-center">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <FaLayerGroup className="text-purple-400" /> Interactive Venue Seat Selection Map
            </h3>
            <p className="text-xs text-slate-400 mt-1">Select your preferred tiered seats on the interactive venue grid.</p>
          </div>

          <span className="px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider">
            {selectedSeats.length} Seat{selectedSeats.length === 1 ? "" : "s"} Selected
          </span>
        </div>

        {/* Stage Curved Screen */}
        <div className="relative py-4 max-w-xl mx-auto">
          <div className="h-3 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500 rounded-full shadow-[0_0_25px_rgba(168,85,247,0.5)] transform -curve-y"></div>
          <span className="text-[11px] font-black text-purple-300 uppercase tracking-widest block mt-2">
            🎬 STAGE / MAIN PERFORMANCE SCREEN 🎭
          </span>
        </div>
      </div>

      {/* Tier Legend Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/5 p-4 rounded-2xl border border-white/10 text-xs">
        {tiers.map((t) => (
          <div key={t.tier_key} className="flex items-center gap-2">
            <span className={`w-3.5 h-3.5 rounded-md shrink-0 shadow ${
              t.tier_key === "VIP" ? "bg-purple-600" :
              t.tier_key === "PLATINUM" ? "bg-indigo-600" :
              t.tier_key === "GOLD" ? "bg-amber-500" : "bg-emerald-600"
            }`}></span>
            <div>
              <p className="font-bold text-white leading-tight">{t.name}</p>
              <p className="text-[10px] text-slate-400">Rs. {Number(t.price).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Seat Map Layout Grid */}
      <div className="space-y-6 overflow-x-auto pb-4 scrollbar-none">
        {tiers.map((tier) => (
          <div key={tier.tier_key} className="space-y-3 bg-white/[0.02] p-4 rounded-2xl border border-white/5 min-w-[500px]">
            <div className="flex items-center justify-between text-xs font-bold px-2">
              <span className="text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  tier.tier_key === "VIP" ? "bg-purple-500" :
                  tier.tier_key === "PLATINUM" ? "bg-indigo-500" :
                  tier.tier_key === "GOLD" ? "bg-amber-400" : "bg-emerald-500"
                }`}></span>
                {tier.name}
              </span>
              <span className="text-slate-400 font-mono">Rs. {Number(tier.price).toLocaleString()} / seat</span>
            </div>

            {/* Rows A to H */}
            {tier.rows.map((rowLetter) => (
              <div key={rowLetter} className="flex items-center justify-center gap-2">
                <span className="w-6 text-xs font-black text-slate-400 text-center font-mono">{rowLetter}</span>
                
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                    const seatCode = `${rowLetter}${num}`;
                    const isBooked = bookedSeats.includes(seatCode);
                    const isSelected = selectedSeats.some((s) => s.seat_code === seatCode);

                    return (
                      <button
                        key={seatCode}
                        type="button"
                        onClick={() => handleSeatClick(seatCode, tier.name, tier.price)}
                        disabled={isBooked}
                        title={
                          isBooked
                            ? `Seat ${seatCode} (Occupied)`
                            : `Seat ${seatCode} - ${tier.name} (Rs. ${Number(tier.price).toLocaleString()})`
                        }
                        className={`w-9 h-9 rounded-xl text-xs font-mono font-bold transition duration-200 flex items-center justify-center relative shadow-md ${
                          isBooked
                            ? "bg-slate-800 text-slate-600 border border-slate-700/50 cursor-not-allowed"
                            : isSelected
                            ? "bg-purple-600 text-white border-2 border-purple-300 ring-2 ring-purple-500/50 scale-110 shadow-purple-500/30"
                            : tier.tier_key === "VIP"
                            ? "bg-purple-950/80 text-purple-200 border border-purple-700/50 hover:bg-purple-700 hover:text-white"
                            : tier.tier_key === "PLATINUM"
                            ? "bg-indigo-950/80 text-indigo-200 border border-indigo-700/50 hover:bg-indigo-700 hover:text-white"
                            : tier.tier_key === "GOLD"
                            ? "bg-amber-950/80 text-amber-200 border border-amber-700/50 hover:bg-amber-600 hover:text-white"
                            : "bg-emerald-950/80 text-emerald-200 border border-emerald-700/50 hover:bg-emerald-600 hover:text-white"
                        }`}
                      >
                        {isBooked ? (
                          <FaLock className="text-[10px]" />
                        ) : isSelected ? (
                          <FaCheck className="text-xs" />
                        ) : (
                          seatCode
                        )}
                      </button>
                    );
                  })}
                </div>

                <span className="w-6 text-xs font-black text-slate-400 text-center font-mono">{rowLetter}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Selected Seat Summary & Total */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <FaTicketAlt className="text-purple-400" /> Selected Seats Cart Summary
        </h4>

        {selectedSeats.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No seats selected yet. Click any available seat above to add to your order.</p>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {selectedSeats.map((s) => (
                <span
                  key={s.seat_code}
                  className="bg-purple-600/30 border border-purple-500/40 text-purple-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <FaCouch className="text-purple-400 text-xs" /> {s.seat_code} ({s.tier_name}) - Rs. {Number(s.price).toLocaleString()}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-3 text-sm">
              <span className="font-bold text-slate-300">Total Seat Price:</span>
              <span className="text-xl font-black text-purple-400">
                LKR {totalPrice.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveSeatMap;
