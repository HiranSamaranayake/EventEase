import { FaHome, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import NotificationCenter from "../../../components/NotificationCenter";

const Topbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || { id: 7 };

  return (
    <header className="h-20 bg-white border-b border-gray-100 shadow-sm flex items-center justify-between px-8">
      <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>

      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex gap-2 items-center transition"
        >
          <FaHome /> Home
        </button>

        {/* Real-time Notification Center */}
        <NotificationCenter userId={user.id || 7} />

        <div className="flex items-center gap-2">
          <FaUserCircle className="text-3xl text-purple-700" />
          <div className="flex flex-col">
            <span className="font-bold text-sm text-gray-800">{user.full_name || "Admin"}</span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 bg-purple-100 px-2 py-0.5 rounded-md">
              {user.admin_role ? user.admin_role.replace('_', ' ') : "Super Admin"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
