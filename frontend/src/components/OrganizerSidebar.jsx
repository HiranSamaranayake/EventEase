import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaPlusCircle,
  FaUsers,
  FaTicketAlt,
  FaChartLine,
  FaMoneyBillWave,
  FaUserCircle,
  FaCog,
  FaHome,
  FaSignOutAlt,
  FaQrcode,
  FaShieldAlt,
  FaClock,
  FaTag,
} from "react-icons/fa";

const OrganizerSidebar = () => {
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
    navigate("/login");
  };

  return (
    <aside
      className="
      w-72
      min-h-screen
      bg-gradient-to-b
      from-purple-800
      via-indigo-800
      to-slate-900
      text-white
      flex
      flex-col
      shadow-2xl
    "
    >
      {/* Logo */}
      <div className="p-8 border-b border-white/10">
        <h1 className="text-3xl font-black tracking-wide">🎟 EventEase</h1>

        <p className="text-purple-200 text-sm mt-2">Organizer Panel</p>
      </div>

      {/* User */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div
            className="
            w-14
            h-14
            rounded-full
            bg-white/20
            flex
            items-center
            justify-center
            text-2xl
          "
          >
            <FaUserCircle />
          </div>

          <div>
            <h3 className="font-semibold">{user?.full_name || "Organizer"}</h3>

            <p className="text-xs text-purple-200">Event Organizer</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 px-4 py-6">
        {menuItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.path}
            className={({ isActive }) =>
              `
              flex
              items-center
              gap-4
              px-5
              py-4
              rounded-2xl
              mb-3
              transition-all
              duration-300
              ${
                isActive
                  ? "bg-white text-purple-700 shadow-lg font-bold"
                  : "hover:bg-white/10"
              }
            `
            }
          >
            <span className="text-xl">{item.icon}</span>

            <span>{item.title}</span>
          </NavLink>
        ))}
      </div>

      {/* Bottom Buttons */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => navigate("/")}
          className="
          w-full
          flex
          items-center
          gap-3
          px-5
          py-4
          rounded-xl
          hover:bg-white/10
          transition
          mb-3
        "
        >
          <FaHome />
          Home Page
        </button>

        <button
          onClick={logout}
          className="
          w-full
          flex
          items-center
          gap-3
          px-5
          py-4
          rounded-xl
          bg-red-500
          hover:bg-red-600
          transition
        "
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default OrganizerSidebar;
