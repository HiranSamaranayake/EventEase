import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";

function Navbar() {
  const [scrollY, setScrollY] = useState(0);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`
        fixed left-1/2 w-full px-4 max-w-7xl z-50 transition-all duration-500 ease-in-out
        ${
          scrollY < 40
            ? isDark
              ? "bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl"
              : "bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl shadow-sm"
            : scrollY < 300
            ? isDark
              ? "bg-slate-950/70 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl"
              : "bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-md"
            : isDark
            ? "bg-slate-950/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl"
            : "bg-white/95 backdrop-blur-2xl border border-gray-300 rounded-2xl shadow-xl"
        }
      `}
      style={{
        top: "16px",
        transform: "translateX(-50%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent transition-all duration-300 hover:scale-105"
        >
          EventEase
        </Link>

        {/* Center Links */}
        <div className={`hidden md:flex items-center gap-8 font-semibold text-sm ${isDark ? "text-slate-200" : "text-gray-700"}`}>
          <Link to="/" className="hover:text-purple-500 transition duration-300">
            Home
          </Link>
          <Link to="/events" className="hover:text-purple-500 transition duration-300">
            Events
          </Link>
          <Link to="/saved-events" className="hover:text-purple-500 transition duration-300">
            Wishlist
          </Link>
          <Link to="/my-bookings" className="hover:text-purple-500 transition duration-300">
            My Bookings
          </Link>
        </div>

        {/* Right Action Buttons & Theme Switcher */}
        <div className="flex items-center gap-3">
          {/* Dark/Light Mode Toggle Switch */}
          <button
            onClick={toggleTheme}
            type="button"
            className={`p-2.5 rounded-xl border transition-all duration-300 flex items-center gap-2 text-xs font-bold ${
              isDark
                ? "bg-slate-900 border-white/10 text-amber-300 hover:bg-slate-800"
                : "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
            }`}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? (
              <>
                <FaSun className="text-amber-400 text-sm animate-spin-slow" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <FaMoon className="text-purple-600 text-sm" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          <Link
            to="/login"
            className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
              isDark
                ? "text-white border-white/20 bg-white/5 hover:bg-white/10"
                : "text-gray-800 border-gray-300 bg-gray-50 hover:bg-gray-100"
            }`}
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white px-5 py-2 text-xs font-extrabold rounded-xl shadow-lg hover:scale-105 transition-all"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
