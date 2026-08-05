import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaPlusCircle,
  FaUsers,
  FaTicketAlt,
  FaChartLine,
  FaSignOutAlt,
  FaQrcode,
  FaShieldAlt,
  FaClock,
  FaTag,
  FaTimes,
  FaBuilding
} from "react-icons/fa";

const OrganizerSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const menuItems = [
    {
      title: "Dashboard",
      icon: <FaTachometerAlt />,
      path: "/organizer/dashboard",
    },
    {
      title: "My Events",
      icon: <FaCalendarAlt />,
      path: "/organizer/my-events",
    },
    {
      title: "Create Event",
      icon: <FaPlusCircle />,
      path: "/organizer/create-event",
    },
    {
      title: "Event Schedules",
      icon: <FaClock />,
      path: "/organizer/schedules",
    },
    {
      title: "Promo Codes",
      icon: <FaTag />,
      path: "/organizer/promos",
    },
    {
      title: "Venue Seating Config",
      icon: <FaTicketAlt />,
      path: "/organizer/seating",
    },
    {
      title: "Broadcast Announcements",
      icon: <FaTag />,
      path: "/organizer/announcements",
    },
    {
      title: "Analytics",
      icon: <FaChartLine />,
      path: "/organizer/analytics",
    },
    {
      title: "Bookings",
      icon: <FaUsers />,
      path: "/organizer/bookings",
    },
    {
      title: "Tickets",
      icon: <FaTicketAlt />,
      path: "/organizer/tickets",
    },
    {
      title: "QR Scanner",
      icon: <FaQrcode />,
      path: "/organizer/scan-ticket",
    },
    {
      title: "Verification",
      icon: <FaShieldAlt />,
      path: "/organizer/verify",
    },
  ];

  const logout = () => {
    localStorage.removeItem("user");
    if (onClose) onClose();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Dark Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed lg:static top-0 left-0 z-50
          w-72 h-screen lg:min-h-screen
          bg-gradient-to-b from-purple-800 via-indigo-800 to-slate-900
          text-white flex flex-col shadow-2xl
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* LOGO & MOBILE CLOSE BUTTON */}
        <div className="p-6 border-b border-purple-700/40 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black tracking-wide flex items-center gap-2">
              <FaBuilding className="text-purple-300" /> EventEase
            </h1>
            <p className="text-xs text-purple-200 mt-1 font-semibold">Verified Organizer Portal</p>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden text-purple-200 hover:text-white p-2 rounded-lg text-xl"
            title="Close Menu"
          >
            <FaTimes />
          </button>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.path}
              onClick={() => {
                if (onClose) onClose();
              }}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-white text-purple-900 shadow-lg shadow-purple-900/20 scale-[1.02]"
                    : "text-purple-100 hover:bg-purple-700/50 hover:text-white"
                }`
              }
            >
              <span className="text-base shrink-0">{item.icon}</span>
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>

        {/* USER LOGOUT SECTION */}
        <div className="p-4 border-t border-purple-700/40 bg-slate-900/40">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs py-3 rounded-xl shadow-lg transition cursor-pointer"
          >
            <FaSignOutAlt className="text-sm" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default OrganizerSidebar;
