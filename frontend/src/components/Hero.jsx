import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import heroVideo from "../assets/videos/hero.mp4";

function Hero() {
    const navigate = useNavigate();

    return (
        <section className="relative h-screen overflow-hidden">

            {/* Background Video */}

            <video
                autoPlay
                loop
                muted
                playsInline
                className="
                    absolute
                    inset-0
                    w-full
                    h-full
                    object-cover
                "
            >
                <source
                    src={heroVideo}
                    type="video/mp4"
                />
            </video>

            {/* Dark Overlay */}

            <div
                className="
                    absolute
                    inset-0
                    bg-black/55
                "
            ></div>

            {/* Purple Gradient */}

            <div
                className="
                    absolute
                    inset-0
                    bg-gradient-to-b
                    from-purple-900/20
                    via-black/20
                    to-black/70
                "
            ></div>

            {/* Hero Content */}

            <div
                className="
                    relative
                    z-10
                    h-full
                    flex
                    flex-col
                    items-center
                    justify-center
                    text-center
                    px-6
                "
            >

                <motion.h1

                    initial={{ opacity: 0, y: 40 }}

                    animate={{ opacity: 1, y: 0 }}

                    transition={{ duration: 0.8 }}

                    className="
                        text-white
                        text-5xl
                        md:text-7xl
                        font-black
                        leading-tight
                    "
                >

                    Smart Event

                    <br />

                    <span className="text-purple-400">

                        Management

                    </span>

                    <br />

                    Made Simple

                </motion.h1>

                <motion.p

                    initial={{ opacity: 0, y: 40 }}

                    animate={{ opacity: 1, y: 0 }}

                    transition={{
                        delay: 0.3,
                        duration: 0.8
                    }}

                    className="
                        mt-8
                        max-w-2xl
                        text-gray-200
                        text-xl
                        leading-relaxed
                    "
                >

                    Discover, organize and book unforgettable
                    events through one modern platform.

                </motion.p>

                <motion.div

                    initial={{ opacity: 0, y: 40 }}

                    animate={{ opacity: 1, y: 0 }}

                    transition={{
                        delay: 0.5,
                        duration: 0.8
                    }}

                    className="
                        mt-10
                        flex
                        flex-wrap
                        justify-center
                        gap-5
                    "
                >

                    <button

                        onClick={() => navigate("/events")}

                        className="
                            bg-gradient-to-r
                            from-purple-600
                            to-fuchsia-600
                            text-white
                            px-8
                            py-4
                            rounded-2xl
                            font-semibold
                            hover:scale-105
                            transition
                            shadow-2xl
                        "
                    >

                        Explore Events

                    </button>

                    <button

                        className="
                            border
                            border-white/30
                            bg-white/10
                            backdrop-blur-md
                            text-white
                            px-8
                            py-4
                            rounded-2xl
                            hover:bg-white/20
                            transition
                        "
                    >

                        Become Organizer

                    </button>

                </motion.div>

            </div>

        </section>
    );
}

export default Hero;