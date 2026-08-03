import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";

const OrganizerTopbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header
      className={`h-20 border-b flex items-center justify-between px-8 sticky top-0 z-30 transition-colors duration-300 ${
        isDark
          ? "bg-slate-900 border-slate-800 text-white"
          : "bg-white border-gray-200 text-gray-800 shadow-sm"
      }`}
    >
      {/* Left */}
      <div>
        <h1 className={`text-2xl sm:text-3xl font-extrabold ${isDark ? "text-white" : "text-gray-800"}`}>
          Organizer Dashboard
        </h1>

        <p className={`text-xs ${isDark ? "text-slate-400" : "text-gray-500"}`}>
          {today}
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden lg:block">
          <FaSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
          />
          <input
            type="text"
            placeholder="Search..."
            className={`w-64 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold outline-none transition ${
              isDark
                ? "bg-slate-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500"
                : "bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
            }`}
          />
        </div>

        {/* Theme Toggle Button */}
        <ThemeToggle />

        {/* Notification */}
        <button
          className={`relative w-10 h-10 rounded-xl transition flex items-center justify-center ${
            isDark ? "bg-slate-800 hover:bg-slate-700" : "bg-gray-100 hover:bg-purple-100"
          }`}
        >
          <FaBell className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
        </button>

        {/* User */}
        <div className="flex items-center gap-3 border-l border-gray-200/20 pl-4">
          <div
            className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center text-xl font-bold shadow-md"
          >
            {user?.full_name ? user.full_name.charAt(0).toUpperCase() : <FaUserCircle />}
          </div>

          <div className="hidden md:block text-left">
            <p className={`font-bold text-xs ${isDark ? "text-white" : "text-gray-800"}`}>
              {user?.full_name || "Organizer"}
            </p>
            <p className="text-purple-500 text-[10px] font-semibold uppercase">
              Organizer
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default OrganizerTopbar;