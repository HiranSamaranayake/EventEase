import {
  FaHome,
  FaUsers,
  FaUserTie,
  FaCalendarAlt,
  FaTicketAlt,
  FaMoneyBillWave,
  FaChartBar,
  FaCog,
  FaHeadset,
  FaShieldAlt,
  FaSignOutAlt,
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const adminRole = user.admin_role || "super_admin";

  const allMenuItems = [
    { name: "Dashboard", path: "/admin-dashboard", icon: <FaHome />, roles: ["super_admin", "junior_admin", "financial_admin", "security_admin"] },
    { name: "Users", path: "/admin-users", icon: <FaUsers />, roles: ["super_admin", "security_admin"] },
    { name: "Organizers", path: "/admin-organizers", icon: <FaUserTie />, roles: ["super_admin", "junior_admin"] },
    { name: "Events", path: "/admin-events", icon: <FaCalendarAlt />, roles: ["super_admin", "junior_admin"] },
    { name: "Bookings", path: "/admin-bookings", icon: <FaTicketAlt />, roles: ["super_admin", "financial_admin"] },
    { name: "Complaints & Support", path: "/admin-complaints", icon: <FaHeadset />, roles: ["super_admin", "junior_admin"] },
    { name: "Security Audit Logs", path: "/admin-security", icon: <FaShieldAlt />, roles: ["super_admin", "security_admin"] },
    { name: "Financial Ledger & Payouts", path: "/admin-financials", icon: <FaMoneyBillWave />, roles: ["super_admin", "financial_admin"] },
    { name: "Payments", path: "/admin-payments", icon: <FaMoneyBillWave />, roles: ["super_admin", "financial_admin"] },
    { name: "Settings", path: "/admin-settings", icon: <FaCog />, roles: ["super_admin", "security_admin"] },
  ];

  const menuItems = allMenuItems.filter((item) => item.roles.includes(adminRole));

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

        {/* LOGOUT BUTTON DIRECTLY BELOW SETTINGS */}
        <button
          onClick={handleLogout}
          className="
w-full
flex
items-center
gap-4
px-4
py-3
rounded-xl
bg-rose-600/90
hover:bg-rose-700
text-white
font-medium
transition-all
duration-300
shadow-md
mt-4
cursor-pointer
"
        >
          <span className="text-xl">
            <FaSignOutAlt />
          </span>
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
