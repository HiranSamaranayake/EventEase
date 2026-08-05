import { FaBell, FaSearch, FaUserCircle, FaBars } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";

const OrganizerTopbar = ({ onToggleSidebar }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header
      className={`h-20 border-b flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30 transition-colors duration-300 ${
        isDark
          ? "bg-slate-900 border-slate-800 text-white"
          : "bg-white border-gray-200 text-gray-800 shadow-sm"
      }`}
    >
      {/* Left: Mobile Hamburger Toggle + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className={`lg:hidden p-2.5 rounded-xl transition ${
            isDark ? "bg-slate-800 hover:bg-slate-700 text-white" : "bg-purple-50 hover:bg-purple-100 text-purple-900"
          }`}
          title="Open Menu Drawer"
        >
          <FaBars className="text-lg" />
        </button>

        <div>
          <h1 className={`text-lg sm:text-2xl font-black ${isDark ? "text-white" : "text-gray-900"}`}>
            Organizer Dashboard
          </h1>

          <p className={`text-[11px] ${isDark ? "text-slate-400" : "text-gray-500"}`}>
            {today}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search Input (Desktop) */}
        <div className="relative hidden xl:block">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          <input
            type="text"
            placeholder="Search..."
            className={`w-56 rounded-xl py-2 pl-10 pr-4 text-xs font-semibold outline-none transition ${
              isDark
                ? "bg-slate-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500"
                : "bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
            }`}
          />
        </div>

        {/* Theme Toggle Button */}
        <ThemeToggle />

        {/* Notification Button */}
        <button
          className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition flex items-center justify-center ${
            isDark ? "bg-slate-800 hover:bg-slate-700" : "bg-purple-50 hover:bg-purple-100"
          }`}
          title="Notifications"
        >
          <FaBell className={`text-sm ${isDark ? "text-gray-300" : "text-purple-700"}`} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
        </button>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2.5 border-l border-gray-200/40 pl-2 sm:pl-4">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-purple-700 text-white flex items-center justify-center text-base sm:text-lg font-bold shadow-md shrink-0">
            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : <FaUserCircle />}
          </div>

          <div className="hidden sm:block text-left">
            <p className={`font-bold text-xs ${isDark ? "text-white" : "text-gray-800"}`}>
              {user?.full_name || "Organizer"}
            </p>
            <p className="text-purple-600 text-[10px] font-extrabold uppercase">
              Verified Organizer
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default OrganizerTopbar;