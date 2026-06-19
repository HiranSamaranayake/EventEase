import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function RoleNavbar() {

    const { user } = useAuth();

    if (!user) return null;

    return (
        <div className="bg-purple-700 text-white px-6 py-4 flex justify-between">

            <h2 className="font-bold">
                EventEase
            </h2>

            <div className="flex gap-4">

                {user.role === "customer" && (
                    <>
                        <Link to="/customer-dashboard">
                            Dashboard
                        </Link>

                        <Link to="/">
                            Events
                        </Link>
                    </>
                )}

                {user.role === "organizer" && (
                    <>
                        <Link to="/organizer-dashboard">
                            Dashboard
                        </Link>

                        <Link to="#">
                            My Events
                        </Link>

                        <Link to="#">
                            Create Event
                        </Link>
                    </>
                )}

                {user.role === "admin" && (
                    <>
                        <Link to="/admin-dashboard">
                            Dashboard
                        </Link>

                        <Link to="#">
                            Users
                        </Link>

                        <Link to="#">
                            Reports
                        </Link>
                    </>
                )}

            </div>

        </div>
    );
}

export default RoleNavbar;