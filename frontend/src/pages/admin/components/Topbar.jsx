import { FaHome, FaBell, FaUserCircle, FaSun, FaMoon } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../../../context/ThemeContext";

const Topbar = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <header className="h-20 bg-white border-b border-gray-100 shadow-sm flex items-center justify-between px-8">
      <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>

      <div className="flex items-center gap-4">
        {/* Enable/Disable Dark Mode System Button */}
        <button
          onClick={toggleTheme}
          className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 border transition shadow-sm ${
            isDark
              ? "bg-slate-900 text-amber-300 border-slate-700"
              : "bg-purple-50 text-purple-700 border-purple-200"
          }`}
          title={isDark ? "Disable Dark Mode" : "Enable Dark Mode"}
        >
          {isDark ? (
            <>
              <FaSun className="text-amber-400" /> Disable Dark Mode
            </>
          ) : (
            <>
              <FaMoon className="text-purple-600" /> Enable Dark Mode
            </>
          )}
        </button>

        <button
          onClick={() => navigate("/")}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex gap-2 items-center transition"
        >
          <FaHome /> Home
        </button>

        <div className="relative">
          <button onClick={() => setShow(!show)}>
            <FaBell className="text-2xl text-gray-600 hover:text-purple-600 transition" />
          </button>

          {show && (
            <div className="absolute right-0 top-10 bg-white shadow-2xl rounded-2xl w-64 p-4 z-50 border border-gray-100">
              <p className="font-bold text-gray-900 mb-3 text-sm">Notifications</p>
              <p className="text-xs text-gray-600 py-1">New booking received</p>
              <p className="text-xs text-gray-600 py-1">New organizer registered</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <FaUserCircle className="text-3xl text-purple-700" />
          <span className="font-bold text-sm text-gray-800">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
