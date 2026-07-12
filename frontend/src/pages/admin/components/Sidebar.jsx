import {
  FaHome,
  FaUsers,
  FaUserTie,
  FaCalendarAlt,
  FaTicketAlt,
  FaMoneyBillWave,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin-dashboard",
      icon: <FaHome />,
    },

    {
      name: "Users",
      path: "/admin-users",
      icon: <FaUsers />,
    },

    {
      name: "Organizers",
      path: "/admin-organizers",
      icon: <FaUserTie />,
    },

    {
      name: "Events",
      path: "/admin-events",
      icon: <FaCalendarAlt />,
    },

    {
      name: "Bookings",
      path: "/admin-bookings",
      icon: <FaTicketAlt />,
    },

    {
      name: "Payments",
      path: "/admin-payments",
      icon: <FaMoneyBillWave />,
    },

    // {
    //   name: "Reports",
    //   path: "/admin-reports",
    //   icon: <FaChartBar />,
    // },

    {
      name: "Settings",
      path: "/admin-settings",
      icon: <FaCog />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");

    localStorage.removeItem("token");

    navigate("/login");
  };

  return (
    <aside
      className="
fixed
left-0
top-0
h-screen
w-72
bg-gradient-to-b
from-purple-700
via-purple-800
to-purple-950
text-white
p-6
shadow-2xl
overflow-y-auto
"
    >
      {/* LOGO */}

      <div
        className="
mb-10
"
      >
        <h1
          className="
text-3xl
font-bold
tracking-wide
"
        >
          EventEase
        </h1>

        <p
          className="
text-purple-200
text-sm
mt-2
"
        >
          Admin SaaS Dashboard
        </p>
      </div>

      {/* MENU */}

      <nav
        className="
space-y-3
"
      >
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `

flex
items-center
gap-4
px-4
py-3
rounded-xl
transition-all
duration-300
group

${isActive ? "bg-white text-purple-700 shadow-lg" : "hover:bg-purple-600"}

`
            }
          >
            <span
              className="
text-xl
group-hover:scale-110
transition
"
            >
              {item.icon}
            </span>

            <span
              className="
font-medium
"
            >
              {item.name}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* BOTTOM SECTION */}

      <div
        className="
absolute
bottom-6
left-6
right-6
"
      >
        <button
          onClick={handleLogout}
          className="
w-full
flex
items-center
justify-center
gap-3
bg-red-500
hover:bg-red-600
py-3
rounded-xl
font-semibold
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

export default Sidebar;
