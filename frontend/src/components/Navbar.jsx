import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import NotificationCenter from "./NotificationCenter";
import { FaSun, FaMoon, FaUserSecret } from "react-icons/fa";

function Navbar() {
  const [scrollY, setScrollY] = useState(0);

  let isDark = false;
  let toggleTheme = () => {};

  try {
    const themeContext = useTheme();
    if (themeContext) {
      isDark = themeContext.theme === "dark";
      toggleTheme = themeContext.toggleTheme;
    }
  } catch (e) {
    console.warn("ThemeContext not available in Navbar", e);
  }

  const [pathname, setPathname] = useState(() => {
    return typeof window !== "undefined" ? window.location.pathname : "";
  });

  const [user, setUser] = useState(() => {
    try {
      if (typeof window !== "undefined" && window.location.pathname === "/guest") return null;
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);

    const updatePathAndUser = () => {
      const currentPath = window.location.pathname;
      setPathname(currentPath);
      if (currentPath === "/guest") {
        setUser(null);
      } else {
        try {
          const stored = localStorage.getItem("user");
          setUser(stored ? JSON.parse(stored) : null);
        } catch {
          setUser(null);
        }
      }
    };

    updatePathAndUser();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("popstate", updatePathAndUser);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("popstate", updatePathAndUser);
    };
  }, []);

  const isGuestUser = !user || pathname === "/guest";

  return (
    <nav
      className={`
        fixed left-1/2 w-full px-4 max-w-7xl z-50 transition-all duration-500 ease-in-out -translate-x-1/2 top-4
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
    >
      <div className="flex items-center justify-between h-16 px-6">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 font-black text-xl tracking-tight">
          <span className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
            EventEase
          </span>
        </Link>

        {/* Center Links */}
        <div className={`hidden md:flex items-center gap-8 font-semibold text-sm ${isDark ? "text-slate-200" : "text-gray-700"}`}>
          <Link to="/" className="hover:text-purple-500 transition duration-300">
            Home
          </Link>
          <Link to="/guest" className="text-purple-600 font-extrabold hover:text-purple-500 transition duration-300 flex items-center gap-1">
            <span>✨</span> Guest Explorer
          </Link>
          <Link to="/events" className="hover:text-purple-500 transition duration-300">
            Events Catalog
          </Link>
          {!isGuestUser && (
            <>
              <Link to="/saved-events" className="hover:text-purple-500 transition duration-300">
                Wishlist
              </Link>
              <Link to="/my-bookings" className="hover:text-purple-500 transition duration-300">
                My Bookings
              </Link>
            </>
          )}
        </div>

        {/* Right Action Buttons & Theme Switcher & Notification Center */}
        <div className="flex items-center gap-3">
          {/* In-App Notification Center for Logged-In User ONLY */}
          {!isGuestUser && user && user.id && (
            <NotificationCenter userId={user.id} />
          )}

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

          {isGuestUser ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 hidden sm:flex items-center gap-1.5">
                <FaUserSecret /> Guest Customer
              </span>

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
          ) : (
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
              👤 {user.full_name || user.email}
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
