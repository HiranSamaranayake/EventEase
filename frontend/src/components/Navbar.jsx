import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="
            fixed top-0 left-0 w-full z-50
            bg-black/80 backdrop-blur-md
            border-b border-white/10
        ">
            <div className="
                max-w-7xl mx-auto
                px-6 py-4
                flex items-center justify-between
            ">

                {/* Logo */}
                <Link
                    to="/"
                    className="
                        text-3xl font-extrabold
                        text-purple-500
                    "
                >
                    EventEase
                </Link>

                {/* Center Links */}
                <div className="
                    hidden md:flex
                    items-center gap-8
                    text-white
                ">
                    <Link
                        to="/"
                        className="hover:text-purple-400 transition"
                    >
                        Home
                    </Link>

                    <a
                        href="#events"
                        className="hover:text-purple-400 transition"
                    >
                        Events
                    </a>

                    <a
                        href="#features"
                        className="hover:text-purple-400 transition"
                    >
                        Features
                    </a>

                    <a
                        href="#contact"
                        className="hover:text-purple-400 transition"
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
                            px-4 py-2
                            rounded-lg
                            hover:bg-white/10
                            transition
                        "
                    >
                        Login
                    </Link>

                    <Link
                        to="/register"
                        className="
                            bg-purple-600
                            text-white
                            px-5 py-2
                            rounded-xl
                            hover:bg-purple-700
                            transition
                            shadow-lg
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