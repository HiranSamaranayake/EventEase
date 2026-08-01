import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaTicketAlt,
  FaMoneyBillWave,
  FaUsers,
  FaEye,
  FaArrowUp,
} from "react-icons/fa";

const cards = [
  {
    title: "Total Events",
    key: "events",
    icon: <FaCalendarAlt />,
    color: "from-violet-500 to-purple-600",
    increase: "+12%",
  },
  {
    title: "Bookings",
    key: "bookings",
    icon: <FaTicketAlt />,
    color: "from-blue-500 to-cyan-500",
    increase: "+18%",
  },
  {
    title: "Tickets Sold",
    key: "tickets",
    icon: <FaUsers />,
    color: "from-green-500 to-emerald-600",
    increase: "+21%",
  },
  {
    title: "Revenue",
    key: "revenue",
    icon: <FaMoneyBillWave />,
    color: "from-orange-500 to-red-500",
    prefix: "Rs ",
    increase: "+34%",
  },
  {
    title: "Customers",
    key: "customers",
    icon: <FaUsers />,
    color: "from-pink-500 to-rose-500",
    increase: "+8%",
  },
  {
    title: "Profile Views",
    key: "views",
    icon: <FaEye />,
    color: "from-indigo-500 to-blue-700",
    increase: "+16%",
  },
];

const DashboardCards = ({ stats = {} }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: index * 0.08,
            duration: 0.4,
          }}
          whileHover={{
            y: -8,
            scale: 1.02,
          }}
          className={`
                relative
                overflow-hidden
                rounded-3xl
                bg-gradient-to-br
                ${card.color}
                text-white
                shadow-xl
                p-6
                cursor-pointer
            `}
        >
          {/* Background Circle */}

          <div
            className="
                    absolute
                    -right-10
                    -top-10
                    w-36
                    h-36
                    rounded-full
                    bg-white/10
                "
          />

          <div
            className="
                    flex
                    justify-between
                    items-start
                "
          >
            <div>
              <p className="text-sm opacity-90">{card.title}</p>

              <h2 className="text-4xl font-bold mt-3">
                {card.prefix ?? ""}
                {stats?.[card.key] ?? 0}
              </h2>
            </div>

            <div
              className="
                        w-14
                        h-14
                        rounded-2xl
                        bg-white/20
                        flex
                        items-center
                        justify-center
                        text-2xl
                    "
            >
              {card.icon}
            </div>
          </div>

          <div className="mt-8 flex items-center gap-2">
            <FaArrowUp />

            <span className="font-semibold">{card.increase}</span>

            <span className="text-white/80 text-sm">this month</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardCards;
