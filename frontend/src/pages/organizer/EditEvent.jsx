import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const EditEvent = () => {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`http://localhost/EventEase/backend/api/get_event.php?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTitle(data.event.title);
          setDescription(data.event.description);
          setEventDate(data.event.event_date);
          setLocation(data.event.location);
        }

        setLoading(false);
      });
  }, [id]);

  const updateEvent = () => {
    fetch("http://localhost/EventEase/backend/api/update_event.php", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        event_id: id,
        title,
        description,
        event_date: eventDate,
        location,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessage("✅ Event updated successfully!");
        } else {
          setMessage(data.message);
        }
      });
  };

  if (loading) {
    return <div className="p-10">Loading Event...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-8">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-purple-700 text-center mb-8">
          Edit Event
        </h1>
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 p-3 rounded mb-6">
            {message}
          </div>
        )}

        <div className="space-y-5">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg p-3"
          />

          <textarea
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full border rounded-lg p-3"
          />

          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border rounded-lg p-3"
          />

          <button
            onClick={updateEvent}
            className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;
