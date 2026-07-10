import { FaHome, FaBell, FaUserCircle } from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import { useState } from "react";

const Topbar = () => {
  const navigate = useNavigate();

  const [show, setShow] = useState(false);

  return (
    <header
      className="
h-20
bg-white
shadow
flex
items-center
justify-between
px-8
"
    >
      <h2
        className="
text-2xl
font-bold
"
      >
        Admin Panel
      </h2>

      <div
        className="
flex
items-center
gap-6
"
      >
        <button
          onClick={() => navigate("/")}
          className="
bg-purple-600
text-white
px-4
py-2
rounded-lg
flex
gap-2
items-center
"
        >
          <FaHome />
          Home
        </button>

        <div className="relative">
          <button onClick={() => setShow(!show)}>
            <FaBell
              className="
text-2xl
text-gray-600
"
            />
          </button>

          {show && (
            <div
              className="
absolute
right-0
top-10
bg-white
shadow-xl
rounded-xl
w-64
p-4
z-50
"
            >
              <p className="font-bold mb-3">Notifications</p>

              <p className="text-sm">New booking received</p>

              <p className="text-sm mt-2">New organizer registered</p>
            </div>
          )}
        </div>

        <div
          className="
flex
items-center
gap-2
"
        >
          <FaUserCircle
            className="
text-3xl
text-purple-700
"
          />
          Admin
        </div>
      </div>
    </header>
  );
};

export default Topbar;
