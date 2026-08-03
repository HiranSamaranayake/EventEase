import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaUserSecret, FaSearch, FaCalendarAlt, FaUserPlus } from "react-icons/fa";

function RoleNavbar() {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="bg-purple-950 text-white px-6 py-3 border-b border-purple-800/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-full font-black uppercase text-[10px] tracking-wider flex items-center gap-1.5 shadow">
                        <FaUserSecret /> Role: Guest Customer
                    </span>
                    <span className="text-purple-200 hidden md:inline">
                        Allowed features: Browse events, search, and view event details without login or registration!
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <Link to="/guest" className="text-white hover:text-purple-300 font-bold flex items-center gap-1">
                        <FaCalendarAlt /> Browse Events
                    </Link>
                    <Link to="/events" className="text-white hover:text-purple-300 font-bold flex items-center gap-1">
                        <FaSearch /> Search Catalog
                    </Link>
                    <Link to="/register" className="bg-amber-400 hover:bg-amber-300 text-purple-950 font-black px-3 py-1 rounded-lg shadow transition flex items-center gap-1">
                        <FaUserPlus /> Upgrade to Verified Customer
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-purple-800 text-white px-6 py-3 flex justify-between items-center text-xs">
            <h2 className="font-extrabold text-sm">EventEase Platform</h2>
            <div className="flex gap-4 font-semibold">
                {user.role === "customer" && (
                    <>
                        <Link to="/customer-dashboard">Dashboard</Link>
                        <Link to="/events">Explore Events</Link>
                    </>
                )}

                {user.role === "organizer" && (
                    <>
                        <Link to="/organizer/dashboard">Dashboard</Link>
                        <Link to="/organizer/my-events">My Events</Link>
                        <Link to="/organizer/create-event">Create Event</Link>
                    </>
                )}

                {user.role === "admin" && (
                    <>
                        <Link to="/admin-dashboard">Admin Dashboard</Link>
                        <Link to="/admin/users">Users</Link>
                        <Link to="/admin/events">Events</Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default RoleNavbar;