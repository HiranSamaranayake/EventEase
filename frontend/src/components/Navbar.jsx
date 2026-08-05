import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NotificationCenter from "./NotificationCenter";

function Navbar() {
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();

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

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const isGuestUser = !user || pathname === "/guest";

  return (
    <nav
      className={`
        fixed left-1/2 w-full px-4 max-w-7xl z-50 transition-all duration-500 ease-in-out -translate-x-1/2 top-4
        ${
          scrollY < 40
            ? "bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-sm"
            : scrollY < 300
            ? "bg-white/95 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-md"
            : "bg-white backdrop-blur-2xl border border-gray-300 rounded-2xl shadow-xl"
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
        <div className="hidden md:flex items-center gap-8 font-semibold text-sm text-gray-700">
          <Link to="/" className="hover:text-purple-600 transition duration-300">
            Home
          </Link>
          <Link to="/guest" className="text-purple-600 font-extrabold hover:text-purple-500 transition duration-300 flex items-center gap-1">
            <span>✨</span> Guest Explorer
          </Link>
          <Link to="/events" className="hover:text-purple-600 transition duration-300">
            Events Catalog
          </Link>
          {!isGuestUser && (
            <>
              <Link to="/saved-events" className="hover:text-purple-600 transition duration-300">
                Wishlist
              </Link>
              <Link to="/my-bookings" className="hover:text-purple-600 transition duration-300">
                My Bookings
              </Link>
              <Link to="/profile" className="hover:text-purple-600 transition duration-300">
                Profile
              </Link>
            </>
          )}
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Notification Center */}
          {!isGuestUser && user && user.id && (
            <NotificationCenter userId={user.id} />
          )}

          {/* Login & Register Buttons */}
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-2 text-xs font-bold rounded-xl border border-gray-300 bg-gray-50 text-gray-800 hover:bg-gray-100 transition-all shadow-sm"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white px-5 py-2 text-xs font-extrabold rounded-xl shadow-md hover:opacity-95 transition-all"
            >
              Register
            </Link>

            {!isGuestUser && (
              <button
                onClick={handleLogout}
                className="px-3.5 py-2 text-xs font-bold rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-all"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
