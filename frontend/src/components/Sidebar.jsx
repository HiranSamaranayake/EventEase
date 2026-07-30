import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Sidebar = () => {

    const { user } = useAuth();

    return (

        <div className="
            w-72
            min-h-screen
            bg-white
            shadow-xl
            border-r
        ">

            <div className="
                p-6
                border-b
            ">

                <h1 className="
                    text-2xl
                    font-black
                    text-purple-700
                ">
                    EventEase
                </h1>

                <p className="
                    text-sm
                    text-gray-500
                    mt-1
                ">
                    Event Management System
                </p>

            </div>

            <div className="p-4">

                <p className="
                    text-xs
                    text-gray-400
                    uppercase
                    mb-4
                ">
                    Navigation
                </p>

                <div className="space-y-2">

                    {/* CUSTOMER */}

                    {user?.role === "customer" && (
                        <>
                            <Link
                                to="/customer-dashboard"
                                className="
                                    flex items-center gap-3
                                    p-3 rounded-xl
                                    hover:bg-purple-100
                                    transition
                                "
                            >
                                🏠 Dashboard
                            </Link>

                            <Link
                                to="/events"
                                className="
                                    flex items-center gap-3
                                    p-3 rounded-xl
                                    hover:bg-purple-100
                                    transition
                                "
                            >
                                📅 Events
                            </Link>

                            <Link
                                to="/my-bookings"
                                className="
                                    flex items-center gap-3
                                    p-3 rounded-xl
                                    hover:bg-purple-100
                                    transition
                                "
                            >
                                🎫 My Bookings
                            </Link>

                            <Link
                                to="/saved-events"
                                className="
                                    flex items-center gap-3
                                    p-3 rounded-xl
                                    hover:bg-purple-100
                                    transition
                                "
                            >
                                ❤️ Saved Wishlist
                            </Link>
                        </>
                    )}

                    {/* ORGANIZER */}

                    {user?.role === "organizer" && (
                        <>
                            <Link
                                to="/organizer/dashboard"
                                className="
                                    flex items-center gap-3
                                    p-3 rounded-xl
                                    hover:bg-purple-100
                                    transition
                                "
                            >
                                🏠 Dashboard
                            </Link>

                            <Link
                                to="/create-event"
                                className="
                                    flex items-center gap-3
                                    p-3 rounded-xl
                                    hover:bg-purple-100
                                    transition
                                "
                            >
                                ➕ Create Event
                            </Link>

                            <Link
                                to="/my-events"
                                className="
                                    flex items-center gap-3
                                    p-3 rounded-xl
                                    hover:bg-purple-100
                                    transition
                                "
                            >
                                📅 My Events
                            </Link>

                            <Link
                                to="/bookings"
                                className="
                                    flex items-center gap-3
                                    p-3 rounded-xl
                                    hover:bg-purple-100
                                    transition
                                "
                            >
                                🎫 Bookings
                            </Link>
                        </>
                    )}

                    {/* ADMIN */}

                    {user?.role === "admin" && (
                        <>
                            <Link
                                to="/admin-dashboard"
                                className="
                                    flex items-center gap-3
                                    p-3 rounded-xl
                                    hover:bg-purple-100
                                    transition
                                "
                            >
                                🏠 Dashboard
                            </Link>

                            <Link
                                to="/users"
                                className="
                                    flex items-center gap-3
                                    p-3 rounded-xl
                                    hover:bg-purple-100
                                    transition
                                "
                            >
                                👥 Users
                            </Link>

                            <Link
                                to="/reports"
                                className="
                                    flex items-center gap-3
                                    p-3 rounded-xl
                                    hover:bg-purple-100
                                    transition
                                "
                            >
                                📊 Reports
                            </Link>
                        </>
                    )}

                </div>

            </div>

        </div>

    );
};

export default Sidebar;