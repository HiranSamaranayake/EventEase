import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  FaHome,
  FaCalendarAlt,
  FaTicketAlt,
  FaHeart,
  FaCreditCard,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import { motion } from "framer-motion";

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

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

    // {
    //   name: "My Tickets",
    //   icon: <FaTicketAlt />,
    //   path: "/my-tickets",
    // },

    // {
    //   name: "Wishlist",
    //   icon: <FaHeart />,
    //   path: "/wishlist",
    // },

    // {
    //   name: "Payments",
    //   icon: <FaCreditCard />,
    //   path: "/payments",
    // },

    {
      name: "Profile",
      icon: <FaUser />,
      path: "/profile",
    },

    // {
    //   name: "Settings",
    //   icon: <FaCog />,
    //   path: "/settings",
    // },
  ];

  const logout = () => {
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div
      className="
min-h-screen
bg-gradient-to-br
from-slate-100
via-purple-50
to-slate-100
flex
"
    >
      {/* MOBILE BUTTON */}

      <button
        onClick={() => setMobileOpen(true)}
        className="
lg:hidden
fixed
top-5
left-5
z-50
bg-purple-600
text-white
p-3
rounded-xl
shadow-lg
"
      >
        <FaBars />
      </button>

      {/* SIDEBAR */}

      <motion.aside
        initial={{
          x: -300,
        }}
        animate={{
          x: 0,
        }}
        transition={{
          duration: 0.5,
        }}
        className={`

fixed
lg:static

top-0
left-0

z-50

w-72

h-screen

p-5

transition-transform

${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}

`}
      >
        <div
          className="
h-full
bg-white/80
backdrop-blur-xl
rounded-[2rem]
shadow-2xl
border
border-white
p-5
flex
flex-col
"
        >
          {/* LOGO */}

          <div
            className="
flex
items-center
gap-3
mb-10
"
          >
            <div
              className="
w-12
h-12
rounded-2xl
bg-gradient-to-br
from-purple-600
to-indigo-600
flex
items-center
justify-center
text-white
text-2xl
shadow-lg
"
            >
              🎟
            </div>

            <div>
              <h1
                className="
text-2xl
font-black
bg-gradient-to-r
from-purple-700
to-indigo-600
text-transparent
bg-clip-text
"
              >
                EventEase
              </h1>

              <p
                className="
text-xs
text-gray-500
"
              >
                Event Management
              </p>
            </div>
          </div>

          {/* USER CARD */}

          <div
            className="
bg-gradient-to-br
from-purple-600
to-indigo-700
rounded-3xl
p-5
text-white
mb-8
"
          >
            <div
              className="
flex
items-center
gap-3
"
            >
              <div
                className="
w-12
h-12
rounded-full
bg-white/20
flex
items-center
justify-center
text-xl
"
              >
                👤
              </div>

              <div>
                <h3
                  className="
font-bold
"
                >
                  {user?.full_name || "Customer"}
                </h3>

                <p
                  className="
text-sm
text-purple-200
"
                >
                  Premium User
                </p>
              </div>
            </div>
          </div>

          {/* MENU */}

          <nav
            className="
flex-1
space-y-2
"
          >
            {menu.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen(false)}
              >
                {({ isActive }) => (
                  <motion.div
                    whileHover={{
                      x: 8,
                    }}
                    className={`

flex
items-center
gap-4

px-5
py-4

rounded-2xl

font-semibold

transition-all


${
  isActive
    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
    : "text-gray-600 hover:bg-purple-100 hover:text-purple-700"
}


`}
                  >
                    <span
                      className="
text-xl
"
                    >
                      {item.icon}
                    </span>

                    <span>{item.name}</span>

                    {isActive && (
                      <div
                        className="
ml-auto
w-2
h-2
bg-white
rounded-full
"
                      ></div>
                    )}
                  </motion.div>
                )}
              </NavLink>
            ))}
          </nav>

          {/* LOGOUT */}

          <div
            className="
border-t
pt-5
"
          >
            <button
              onClick={logout}
              className="
w-full
flex
items-center
gap-4
px-5
py-4
rounded-2xl
text-red-600
font-bold
hover:bg-red-50
transition
"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>
      </motion.aside>

      {/* MOBILE CLOSE */}

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="
fixed
inset-0
bg-black/40
z-40
lg:hidden
"
        ></div>
      )}

      {/* MAIN CONTENT */}

      <div
        className="
flex-1
min-h-screen
"
      >
        <div
          className="
hidden
lg:block
"
        ></div>

        <main
          className="
p-5
md:p-8
"
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
