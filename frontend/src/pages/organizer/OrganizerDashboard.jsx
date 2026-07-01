import { useNavigate } from "react-router-dom";

const OrganizerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center text-purple-700 mb-10">
        Organizer Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
          <h2 className="text-gray-500">My Events</h2>

          <h1 className="text-5xl font-bold text-purple-600 mt-4">0</h1>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
          <h2 className="text-gray-500">Total Bookings</h2>

          <h1 className="text-5xl font-bold text-green-600 mt-4">0</h1>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
          <h2 className="text-gray-500">Tickets Issued</h2>

          <h1 className="text-5xl font-bold text-blue-600 mt-4">0</h1>
        </div>
      </div>

      <div className="mt-12 bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => navigate("/create-event")}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700"
          >
            Create Event
          </button>
          <button
            onClick={() => navigate("/my-events")}
            className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700"
          >
            My Events
          </button>

          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700">
            View Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
