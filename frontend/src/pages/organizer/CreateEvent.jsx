import { useState } from "react";

const CreateEvent = () => {

    const user = JSON.parse(localStorage.getItem("user"));

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [location, setLocation] = useState("");
    const [message, setMessage] = useState("");

    const createEvent = () => {

        fetch(
            "http://localhost/EventEase/backend/api/create_event.php",
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    title,
                    description,
                    event_date: eventDate,
                    location,
                    organizer_id: user.id

                })

            }
        )
        .then(res => res.json())
        .then(data => {

            if (data.success) {

                setMessage("✅ Event created successfully!");

                setTitle("");
                setDescription("");
                setEventDate("");
                setLocation("");

            } else {

                setMessage(data.message);

            }

        });

    };

    return (

        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-8">

            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl">

                <h1 className="text-3xl font-bold text-center text-purple-700 mb-8">
                    Create Event
                </h1>

                {message && (

                    <div className="bg-green-100 border border-green-400 text-green-700 p-3 rounded mb-6">
                        {message}
                    </div>

                )}

                <div className="space-y-5">

                    <input
                        type="text"
                        placeholder="Event Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border rounded-lg p-3"
                    />

                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border rounded-lg p-3"
                        rows="5"
                    />

                    <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full border rounded-lg p-3"
                    />

                    <input
                        type="text"
                        placeholder="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full border rounded-lg p-3"
                    />

                    <button
                        onClick={createEvent}
                        className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700"
                    >
                        Create Event
                    </button>

                </div>

            </div>

        </div>

    );

};

export default CreateEvent;