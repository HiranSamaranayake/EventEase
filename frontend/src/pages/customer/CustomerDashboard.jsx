import RoleNavbar from "../../components/RoleNavbar";
import { useAuth } from "../../contexts/AuthContext";

const CustomerDashboard = () => {

    const { user } = useAuth();

    return (
        <>
            <RoleNavbar />

            <div className="min-h-screen flex items-center justify-center bg-purple-50">

                <div className="text-center">

                    <h1 className="text-4xl font-bold text-purple-700">
                        Customer Dashboard
                    </h1>

                    <h2 className="mt-4 text-xl">
                        Welcome {user?.full_name}
                    </h2>

                </div>

            </div>
        </>
    );
};

export default CustomerDashboard;