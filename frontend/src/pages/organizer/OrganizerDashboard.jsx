import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../contexts/AuthContext";

const OrganizerDashboard = () => {

    const { user } = useAuth();

    return (
        <DashboardLayout>

            <h1 className="text-4xl font-bold text-purple-700">
                Organizer Dashboard
            </h1>

            <p className="mt-4">
                Welcome {user?.full_name}
            </p>

        </DashboardLayout>
    );
};

export default OrganizerDashboard;