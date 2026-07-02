import { useEffect, useState } from "react";

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetch("http://localhost/EventEase/backend/api/admin_stats.php")
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setStats(data);
                }
            });
    }, []);

    if (!stats) {
        return (
            <div className="p-10 text-xl">
                Loading Dashboard...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-10">

            <h1 className="text-4xl font-bold text-purple-700 mb-10">
                Admin Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">

                <div className="bg-white rounded-xl shadow p-6 text-center">
                    <h2 className="text-gray-500">Users</h2>

                    <p className="text-4xl font-bold text-purple-700 mt-3">
                        {stats.users}
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow p-6 text-center">
                    <h2 className="text-gray-500">Customers</h2>

                    <p className="text-4xl font-bold text-green-600 mt-3">
                        {stats.customers}
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow p-6 text-center">
                    <h2 className="text-gray-500">Organizers</h2>

                    <p className="text-4xl font-bold text-blue-600 mt-3">
                        {stats.organizers}
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow p-6 text-center">
                    <h2 className="text-gray-500">Events</h2>

                    <p className="text-4xl font-bold text-orange-600 mt-3">
                        {stats.events}
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow p-6 text-center">
                    <h2 className="text-gray-500">Bookings</h2>

                    <p className="text-4xl font-bold text-red-600 mt-3">
                        {stats.bookings}
                    </p>
                </div>

            </div>

        </div>
    );
};

export default AdminDashboard;