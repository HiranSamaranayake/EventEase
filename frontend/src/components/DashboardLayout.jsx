import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "./ThemeToggle";
import NotificationCenter from "./NotificationCenter";

import {
  FaHome,
  FaCalendarAlt,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaHeart,
  FaClock,
} from "react-icons/fa";

import { motion } from "framer-motion";

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const menu = [
    {
      name: "Dashboard",
      icon: <FaHome />,
      path: "/customer-dashboard",
    },
    {
      name: "Explore Events",
      icon: <FaCalendarAlt />,
      path: "/events",
    },
    {
      name: "My Bookings",
      icon: <FaCalendarAlt />,
      path: "/my-bookings",
    },
    {
      name: "Wishlist",
      icon: <FaHeart />,
      path: "/saved-events",
    },
    {
      name: "Waiting List",
      icon: <FaClock />,
      path: "/waiting-list",
    },
    {
      name: "Profile",
      icon: <FaUser />,
      path: "/profile",
    },
  ];

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${
      isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-gray-900"
    }`}>
      {/* MOBILE BUTTON */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-5 left-5 z-50 bg-purple-600 text-white p-3 rounded-xl shadow-lg"
      >
        <FaBars />
      </button>

      {/* SIDEBAR */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed lg:static top-0 left-0 z-50 w-72 h-screen p-5 transition-transform ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className={`h-full rounded-[2rem] shadow-2xl border p-5 flex flex-col transition-colors duration-300 ${
          isDark ? "bg-slate-900/90 border-slate-800 backdrop-blur-xl" : "bg-white/90 border-white backdrop-blur-xl shadow-purple-500/5"
        }`}>
          {/* LOGO */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-2xl shadow-lg">
              🎟
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-purple-500 to-indigo-500 text-transparent bg-clip-text">
                EventEase
              </h1>
              <p className="text-xs text-gray-400 font-medium">Customer Portal</p>
            </div>
          </div>

          {/* USER CARD */}
          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-4 text-white mb-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
                👤
              </div>
              <div className="overflow-hidden">
                <h3 className="font-bold text-sm truncate">{user?.full_name || "Customer"}</h3>
                <p className="text-xs text-purple-200 capitalize font-medium">{user?.role || "Customer"}</p>
              </div>
            </div>
          </div>

          {/* MENU */}
          <nav className="flex-1 space-y-2">
            {menu.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen(false)}
              >
                {({ isActive }) => (
                  <motion.div
                    whileHover={{ x: 6 }}
                    className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-semibold text-xs transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20"
                        : isDark
                        ? "text-slate-300 hover:bg-slate-800 hover:text-white"
                        : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span>{item.name}</span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </motion.div>
                )}
              </NavLink>
            ))}
          </nav>

          {/* LOGOUT */}
          <div className="border-t border-gray-200/10 pt-4">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-rose-500 font-bold text-xs hover:bg-rose-500/10 transition"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>
      </motion.aside>

      {/* MOBILE BACKDROP */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        ></div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 min-h-screen flex flex-col">
        {/* TOPBAR WITH THEME TOGGLE & NOTIFICATIONS */}
        <header className={`h-16 px-8 flex items-center justify-between border-b sticky top-0 z-30 transition-colors duration-300 ${
          isDark ? "bg-slate-900/80 border-slate-800 backdrop-blur-md" : "bg-white/80 border-gray-200 backdrop-blur-md shadow-sm"
        }`}>
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-500">EventEase Customer Platform</span>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {user?.id && <NotificationCenter userId={user.id} />}
          </div>
        </header>

        <main className="p-5 md:p-8 flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

