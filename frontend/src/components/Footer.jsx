import { motion } from "framer-motion";


const Footer = () => {

    return (

       <footer
    className="
        relative
        overflow-hidden
        bg-gradient-to-br
        from-slate-950
        via-purple-950
        to-black
        text-white
        pt-24
        pb-10
    "
>
    <div
    className="
        absolute
        -top-40
        -left-40
        w-[400px]
        h-[400px]
        rounded-full
        bg-purple-600/20
        blur-3xl
    "
></div>

<div
    className="
        absolute
        bottom-[-150px]
        right-[-150px]
        w-[450px]
        h-[450px]
        rounded-full
        bg-fuchsia-600/20
        blur-3xl
    "
></div>
<div
    className="
        relative
        z-10
        max-w-7xl
        mx-auto
        px-6
    "
>
    <div
    className="
        grid
        md:grid-cols-2
        lg:grid-cols-4
        gap-12
    "
>
    <motion.div

    initial={{ opacity:0, y:40 }}
    whileInView={{ opacity:1, y:0 }}
    transition={{ duration:0.6 }}

>

    <h2
        className="
            text-4xl
            font-black
            bg-gradient-to-r
            from-purple-400
            to-fuchsia-400
            bg-clip-text
            text-transparent
        "
    >
        EventEase
    </h2>

    <p
        className="
            mt-5
            text-gray-300
            leading-8
        "
    >
        Smart Event Management Platform for creating,
        managing and booking unforgettable events.
    </p>

</motion.div>
<motion.div

    initial={{ opacity:0, y:40 }}
    whileInView={{ opacity:1, y:0 }}
    transition={{ delay:0.1 }}

>

    <h3 className="text-xl font-bold mb-6">
        Quick Links
    </h3>

    <ul className="space-y-4 text-gray-300">

        <li>Home</li>

        <li>Events</li>

        <li>Categories</li>

        <li>Organizers</li>

    </ul>

</motion.div>
<motion.div

    initial={{ opacity:0, y:40 }}
    whileInView={{ opacity:1, y:0 }}
    transition={{ delay:0.2 }}

>

    <h3 className="text-xl font-bold mb-6">
        Support
    </h3>

    <ul className="space-y-4 text-gray-300">

        <li>Help Center</li>

        <li>Privacy Policy</li>

        <li>Terms & Conditions</li>

        <li>Contact Us</li>

    </ul>

</motion.div>
<motion.div

    initial={{ opacity:0, y:40 }}
    whileInView={{ opacity:1, y:0 }}
    transition={{ delay:0.3 }}

>

    <h3 className="text-xl font-bold mb-6">
        Newsletter
    </h3>

    <p className="text-gray-300 mb-5">

        Get updates about upcoming events.

    </p>

    <input

        type="email"

        placeholder="Enter your email"

        className="
            w-full
            rounded-xl
            bg-white/10
            border
            border-white/20
            px-4
            py-3
            outline-none
            mb-4
        "

    />

    <button

        className="
            w-full
            py-3
            rounded-xl
            bg-gradient-to-r
            from-purple-600
            to-fuchsia-600
            font-semibold
            hover:scale-105
            transition
        "

    >

        Subscribe

    </button>

</motion.div>


</div>


</div>


        </footer>

    );

};

export default Footer;
