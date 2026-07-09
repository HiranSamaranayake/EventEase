import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import heroVideo from "../assets/videos/hero.mp4";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Video */}

     {/* Background Video */}

<div className="absolute inset-0 overflow-hidden">

    <motion.div
        className="w-full h-full"
        animate={{
            scale: 1.08,
        }}
        transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
        }}
    >

        <video
            autoPlay
            loop
            muted
            playsInline
            style={{
    display: "block",
}}
            className="
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

    </motion.div>

</div>

      {/* Dark Overlay */}

      <div
        className="
                    absolute
                    inset-0
                    bg-black/45
                "
      ></div>

      {/* Purple Gradient */}

      <div
        className="
                    absolute
                    inset-0
                    bg-gradient-to-b
                   from-black/20
via-purple-900/25
to-black/80
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
                       text-6xl
md:text-4xl
lg:text-7xl
                        font-black
                        leading-tight
                    "
        >
          Smart Event
          <br />
          <span
            className="
        bg-gradient-to-r
        from-purple-400
        via-fuchsia-400
        to-pink-400
        bg-clip-text
        text-transparent
        drop-shadow-[0_0_25px_rgba(192,132,252,0.6)]
    "
          >
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
            duration: 0.8,
          }}
          className="
                        mt-8
                        max-w-2xl
                        text-gray-200
                        text-xl
                        leading-relaxed
                    "
        >
          Create, manage and experience unforgettable events. From conferences
          and concerts to festivals and sports, EventEase connects organizers
          and attendees in one powerful platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.5,
            duration: 0.8,
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
group
relative
overflow-hidden
bg-gradient-to-r
from-purple-600
to-fuchsia-600
px-10
py-4
rounded-2xl
font-semibold
text-white
shadow-2xl
hover:scale-105
hover:shadow-purple-500/50
transition-all
duration-300
"
          >
            Explore Events
          </button>

          <button
            className="
px-10
py-4
rounded-2xl
border
border-white/30
bg-white/10
backdrop-blur-xl
text-white
font-semibold
hover:bg-white/20
hover:border-white
transition-all
duration-300
"
          >
            Become Organizer
          </button>
        </motion.div>
      </div>
      <motion.div
    animate={{ y: [0, 10, 0] }}
    transition={{
        duration: 1.8,
        repeat: Infinity,
    }}
    className="
        absolute
        bottom-8
        left-1/2
        -translate-x-1/2
    "
>
    <div
        className="
            w-7
            h-12
            border-2
            border-white/70
            rounded-full
            flex
            justify-center
            pt-2
        "
    >
        <motion.div
            animate={{
                y: [0, 12, 0],
            }}
            transition={{
                duration: 1.8,
                repeat: Infinity,
            }}
            className="
                w-1.5
                h-3
                rounded-full
                bg-white
            "
        />
    </div>
</motion.div>
    </section>
  );
}

export default Hero;

