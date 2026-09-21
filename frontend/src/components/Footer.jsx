import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-black text-white pt-16 pb-10">
      {/* Background Glow Accents */}
      <div className="absolute -top-40 -left-40 w-[400px] h-[400px] rounded-full bg-purple-600/20 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-150px] right-[-150px] w-[450px] h-[450px] rounded-full bg-fuchsia-600/20 blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-white/10 pb-12">
          {/* Brand Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" onClick={scrollToTop} className="inline-block">
              <h2 className="text-3xl font-black bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                EventEase
              </h2>
            </Link>
            <p className="mt-4 text-gray-300 leading-relaxed text-sm">
              Smart Event Management Platform for creating, managing, and booking unforgettable events seamlessly.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <h3 className="text-lg font-bold mb-5 text-purple-300 tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li>
                <Link
                  to="/"
                  onClick={scrollToTop}
                  className="hover:text-purple-400 transition-colors duration-200 inline-block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  onClick={scrollToTop}
                  className="hover:text-purple-400 transition-colors duration-200 inline-block"
                >
                  Events Catalog
                </Link>
              </li>
              <li>
                <Link
                  to="/guest"
                  onClick={scrollToTop}
                  className="hover:text-purple-400 transition-colors duration-200 inline-block"
                >
                  Guest Explorer
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* User Services & Support */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h3 className="text-lg font-bold mb-5 text-purple-300 tracking-wide">
              Customer Services
            </h3>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li>
                <Link
                  to="/my-bookings"
                  onClick={scrollToTop}
                  className="hover:text-purple-400 transition-colors duration-200 inline-block"
                >
                  My Bookings
                </Link>
              </li>
              <li>
                <Link
                  to="/saved-events"
                  onClick={scrollToTop}
                  className="hover:text-purple-400 transition-colors duration-200 inline-block"
                >
                  Saved Events
                </Link>
              </li>
              <li>
                <Link
                  to="/waiting-list"
                  onClick={scrollToTop}
                  className="hover:text-purple-400 transition-colors duration-200 inline-block"
                >
                  Waiting List
                </Link>
              </li>
              <li>
                <Link
                  to="/support"
                  onClick={scrollToTop}
                  className="hover:text-purple-400 transition-colors duration-200 inline-block"
                >
                  Support Desk
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  onClick={scrollToTop}
                  className="hover:text-purple-400 transition-colors duration-200 inline-block"
                >
                  My Profile
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar / Copyright */}
        <div className="pt-8 text-center text-xs text-gray-400">
          <p>© {new Date().getFullYear()} EventEase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

