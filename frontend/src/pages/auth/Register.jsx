import { motion } from "framer-motion";

function Register() {
return ( <div
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
             px-4
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
                max-w-5xl
                overflow-hidden
                relative
                z-10
            "
        >

            <div className="grid lg:grid-cols-2">

                {/* Left Side */}
                <div
                    className="
                        hidden
                        lg:flex
                        flex-col
                        justify-center
                        p-10
                        bg-gradient-to-br
                        from-purple-700
                        via-purple-600
                        to-fuchsia-600
                        text-white
                    "
                >
                    <h2 className="text-5xl font-black">
                        EventEase
                    </h2>

                    <p className="mt-6 text-lg text-white/90">
                        Book events, reserve seats, receive QR tickets
                        and manage event experiences through EventEase.
                    </p>

                    <div className="mt-10 space-y-4">

                        <div className="flex items-center gap-3">
                            <span>✓</span>
                            <span>Browse Events</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <span>✓</span>
                            <span>Reserve Seats</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <span>✓</span>
                            <span>QR Ticket Access</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <span>✓</span>
                            <span>Secure Online Booking</span>
                        </div>

                    </div>
                </div>

                {/* Right Side */}
                <div className="p-8 lg:p-10">

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
                        Create Account
                    </h1>

                    <p className="text-center text-gray-600 mt-3">
                        Join EventEase today
                    </p>

                    <form className="mt-8">

                        <div className="grid md:grid-cols-2 gap-4">

                            {/* Full Name */}
                            <div>
                                <label className="block mb-2 font-medium text-gray-700">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter full name"
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

                            {/* Email */}
                            <div>
                                <label className="block mb-2 font-medium text-gray-700">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    placeholder="Enter email"
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

                            {/* Phone */}
                            <div>
                                <label className="block mb-2 font-medium text-gray-700">
                                    Phone Number
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter phone number"
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

                            {/* Role */}
                            <div>
                                <label className="block mb-2 font-medium text-gray-700">
                                    Register As
                                </label>

                                <select
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
                                >
                                    <option>Customer</option>
                                    <option>Organizer</option>
                                </select>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block mb-2 font-medium text-gray-700">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    placeholder="Enter password"
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

                            {/* Confirm Password */}
                            <div>
                                <label className="block mb-2 font-medium text-gray-700">
                                    Confirm Password
                                </label>

                                <input
                                    type="password"
                                    placeholder="Confirm password"
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

                        </div>

                        <button
                            type="submit"
                            className="
                                mt-6
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
                            Create Account
                        </button>

                    </form>

                    <div className="mt-5 text-center">

                        <p className="text-gray-600">
                            Already have an account?
                        </p>

                        <a
                            href="/login"
                            className="
                                text-purple-600
                                font-semibold
                                hover:text-fuchsia-600
                            "
                        >
                            Login Here
                        </a>

                    </div>

                    <div className="mt-6 border-t pt-4">

                        <p className="text-center text-sm text-gray-500">
                            EventEase Online Ticket Reservation Platform
                        </p>

                    </div>

                </div>

            </div>

        </motion.div>

    </div>
);


}

export default Register;
