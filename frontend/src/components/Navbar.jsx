import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <nav
      className={`
       fixed
left-1/2
w-[95%]
max-w-7xl
        z-50
        transition-all
duration-700
ease-in-out
        shadow-[0_15px_45px_rgba(0,0,0,0.25)]

      ${
        scrollY < 40
          ? `
            bg-black/10
            backdrop-blur-sm
            border
            border-white/5
            rounded-2xl
        `
          : scrollY < 300
            ? `
            bg-black/25
            backdrop-blur-lg
            border
            border-white/10
            rounded-2xl
            shadow-xl
        `
            : `
            bg-black/70
            backdrop-blur-2xl
            border
            border-white/10
            rounded-2xl
            shadow-2xl
        `
      }
      
    `}
      style={{
    top: scrollY > 50 ? "20px" : "0px",
    transform: `translateX(-50%) scale(${scrollY > 50 ? 1 : 0.985})`,
}}
    >
      <div
        className="
                max-w-7xl mx-auto
               px-8 py-4
                flex items-center justify-between
            "
      >
        {/* Logo */}
        <Link
          to="/"
          className="
text-3xl
font-black
bg-gradient-to-r
from-purple-400
via-fuchsia-400
to-pink-400
bg-clip-text
text-transparent
transition-all
duration-300
hover:scale-105
hover:drop-shadow-[0_0_18px_rgba(168,85,247,0.8)]
"
        >
          EventEase
        </Link>

        {/* Center Links */}
        <div
          className="
                    hidden md:flex
                    items-center gap-8
                    text-white
                "
        >
          <Link
            className="
    relative
    hover:text-purple-400
    transition
    duration-300
    after:absolute
    after:left-0
    after:-bottom-1
    after:h-[2px]
    after:w-0
    after:bg-purple-400
    after:transition-all
    after:duration-300
    hover:after:w-full
"
          >
            Home
          </Link>

          <a
            className="
    relative
    hover:text-purple-400
    transition
    duration-300
    after:absolute
    after:left-0
    after:-bottom-1
    after:h-[2px]
    after:w-0
    after:bg-purple-400
    after:transition-all
    after:duration-300
    hover:after:w-full
"
          >
            Events
          </a>

          <a
            className="
    relative
    hover:text-purple-400
    transition
    duration-300
    after:absolute
    after:left-0
    after:-bottom-1
    after:h-[2px]
    after:w-0
    after:bg-purple-400
    after:transition-all
    after:duration-300
    hover:after:w-full
"
          >
            Features
          </a>

          <a
            className="
    relative
    hover:text-purple-400
    transition
    duration-300
    after:absolute
    after:left-0
    after:-bottom-1
    after:h-[2px]
    after:w-0
    after:bg-purple-400
    after:transition-all
    after:duration-300
    hover:after:w-full
"
          >
            Contact
          </a>
        </div>

        {/* Right Buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="
    text-white
    px-5
    py-2
    rounded-xl
    border
    border-white/20
    bg-white/5
    backdrop-blur-md
    hover:bg-white/10
    transition-all
    duration-300
"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="
bg-gradient-to-r
from-purple-600
via-fuchsia-600
to-pink-600
text-white
px-6
py-2.5
rounded-xl
font-semibold
shadow-lg
hover:scale-105
hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]
transition-all
duration-300
"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
