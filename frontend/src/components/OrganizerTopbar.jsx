import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";

const OrganizerTopbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header
      className="
      h-20
      bg-white
      border-b
      border-gray-200
      shadow-sm
      flex
      items-center
      justify-between
      px-8
      sticky
      top-0
      z-30
    "
    >
      {/* Left */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Organizer Dashboard
        </h1>

        <p className="text-gray-500 text-sm">
          {today}
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative hidden lg:block">
          <FaSearch
            className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-gray-400
          "
          />

          <input
            type="text"
            placeholder="Search..."
            className="
            w-72
            bg-gray-100
            rounded-xl
            py-3
            pl-12
            pr-4
            outline-none
            focus:ring-2
            focus:ring-purple-500
          "
          />
        </div>

        {/* Notification */}
        <button
          className="
          relative
          w-12
          h-12
          rounded-xl
          bg-gray-100
          hover:bg-purple-100
          transition
        "
        >
          <FaBell className="mx-auto text-gray-600 text-lg" />

          <span
            className="
            absolute
            top-2
            right-2
            w-2.5
            h-2.5
            rounded-full
            bg-red-500
          "
          />
        </button>

        {/* User */}
        <div className="flex items-center gap-3">
          <div
            className="
            w-12
            h-12
            rounded-full
            bg-purple-100
            flex
            items-center
            justify-center
            text-purple-700
            text-2xl
          "
          >
            <FaUserCircle />
          </div>

          <div className="hidden md:block">
            <p className="font-semibold">
              {user?.full_name}
            </p>

            <p className="text-gray-500 text-sm">
              Organizer
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default OrganizerTopbar;