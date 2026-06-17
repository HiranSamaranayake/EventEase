
import { motion } from "framer-motion";

function Login() {
    return (
        <div
            className="
                min-h-screen
                flex
                items-center
                justify-center
                bg-gradient-to-br
                from-white
                via-purple-50
                to-white
                relative
                overflow-hidden
                p-6
            "
        >
            {/* Purple Glow */}
            <div
                className="
                    absolute
                    top-[-100px]
                    left-[-100px]
                    w-[400px]
                    h-[400px]
                    rounded-full
                    bg-purple-500/20
                    blur-3xl
                "
            ></div>

            {/* Pink Glow */}
            <div
                className="
                    absolute
                    bottom-[-100px]
                    right-[-100px]
                    w-[400px]
                    h-[400px]
                    rounded-full
                    bg-fuchsia-500/20
                    blur-3xl
                "
            ></div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="
                    bg-white/80
                    backdrop-blur-xl
                    rounded-3xl
                    shadow-2xl
                    w-full
                    max-w-6xl
                    overflow-hidden
                    relative
                    z-10
                "
            >
                <div className="grid lg:grid-cols-2">

                    {/* LEFT SIDE */}
                    <div
                        className="
                            hidden
                            lg:flex
                            flex-col
                            justify-center
                            p-12
                            bg-gradient-to-br
                            from-purple-700
                            via-purple-600
                            to-fuchsia-600
                            text-white
                        "
                    >
                        <h2 className="text-5xl font-black leading-tight">
                            EventEase
                        </h2>

                        <p className="mt-6 text-lg text-white/90">
                            Smart Event Management Platform designed to simplify
                            event creation, ticket booking and attendee
                            management.
                        </p>

                        <div className="mt-10 space-y-4">
                            <div className="flex items-center gap-3">
                                <span>✓</span>
                                <span>Create Events Easily</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span>✓</span>
                                <span>Book Tickets Online</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span>✓</span>
                                <span>Manage Attendees</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span>✓</span>
                                <span>Real-Time Analytics</span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="p-10 lg:p-14">

                        <h1
                            className="
                                text-4xl
                                font-black
                                text-center
                                bg-gradient-to-r
                                from-purple-600
                                to-fuchsia-600
                                bg-clip-text
                                text-transparent
                            "
                        >
                            EventEase
                        </h1>

                        <p
                            className="
                                text-center
                                text-gray-600
                                mt-3
                                leading-relaxed
                            "
                        >
                            Sign in to manage events, book tickets and discover
                            amazing experiences.
                        </p>

                        <form className="mt-8 space-y-5">

                            <div>
                                <label className="block mb-2 font-medium text-gray-700">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="
                                        w-full
                                        px-4
                                        py-3
                                        rounded-xl
                                        border
                                        border-gray-300
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-purple-500
                                    "
                                />
                            </div>

                            <div>
                                <label className="block mb-2 font-medium text-gray-700">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    className="
                                        w-full
                                        px-4
                                        py-3
                                        rounded-xl
                                        border
                                        border-gray-300
                                        focus:outline-none
                                        focus:ring-2
                                        focus:ring-purple-500
                                    "
                                />
                            </div>

                            <div className="flex justify-between items-center">
                                <label className="flex items-center gap-2 text-sm text-gray-600">
                                    <input type="checkbox" />
                                    Remember Me
                                </label>

                                <button
                                    type="button"
                                    className="text-purple-600 text-sm hover:underline"
                                >
                                    Forgot Password?
                                </button>
                            </div>

                            <button
                                type="submit"
                                className="
                                    w-full
                                    py-3
                                    rounded-xl
                                    bg-gradient-to-r
                                    from-purple-600
                                    to-fuchsia-600
                                    text-white
                                    font-semibold
                                    shadow-lg
                                    hover:scale-105
                                    transition-all
                                    duration-300
                                "
                            >
                                Login
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                Don't have an account?
                            </p>

                            <a
                                href="/register"
                                className="
                                    inline-block
                                    mt-2
                                    text-purple-600
                                    font-semibold
                                    hover:text-fuchsia-600
                                "
                            >
                                Create Account
                            </a>
                        </div>

                        <div className="mt-8 border-t pt-5">
                            <p className="text-center text-sm text-gray-500">
                                Smart Event Management Platform
                            </p>
                        </div>

                    </div>

                </div>
            </motion.div>
        </div>
    );
}

export default Login;

