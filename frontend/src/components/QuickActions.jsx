import { useNavigate } from "react-router-dom";
import { FaPlusCircle, FaCalendarAlt, FaBullhorn, FaHeadset } from "react-icons/fa";

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-7">
      <h2 className="text-xl font-black text-gray-900 mb-5">
        ⚡ Quick Actions
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate("/organizer/create-event")}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-3 rounded-2xl transition flex items-center justify-center gap-2 text-xs shadow-md"
        >
          <FaPlusCircle /> Create Event
        </button>

        <button
          onClick={() => navigate("/organizer/my-events")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-3 rounded-2xl transition flex items-center justify-center gap-2 text-xs shadow-md"
        >
          <FaCalendarAlt /> My Events
        </button>

        <button
          onClick={() => navigate("/organizer/announcements")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-3 rounded-2xl transition flex items-center justify-center gap-2 text-xs shadow-md"
        >
          <FaBullhorn /> Broadcasts
        </button>

        <button
          onClick={() => navigate("/organizer/complaints")}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-3 rounded-2xl transition flex items-center justify-center gap-2 text-xs shadow-md"
        >
          <FaHeadset /> Complaints
        </button>
      </div>
    </div>
  );
};

export default QuickActions;