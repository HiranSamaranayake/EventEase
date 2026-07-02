import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Events = () => {

    const navigate = useNavigate();

    const [events, setEvents] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetch(
            "http://localhost/EventEase/backend/api/events.php"
        )
        .then(res => res.json())
        .then(data => {

            if (data.success) {

                setEvents(data.events);

            }

            setLoading(false);

        });

    }, []);

    if (loading) {

        return (

            <div className="p-10">

                Loading Events...

            </div>

        );

    }

    return (

        <div className="min-h-screen bg-gray-100 p-10">

            <h1 className="text-4xl font-bold text-purple-700 mb-10">

                Available Events

            </h1>

            {
                events.length === 0 ?

                (

                    <div className="bg-white rounded-xl shadow p-6">

                        No events available.

                    </div>

                )

                :

                (

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                        {

                            events.map((event)=>(

                                <div
                                    key={event.id}
                                    className="bg-white rounded-2xl shadow-lg p-6"
                                >

                                    <h2 className="text-2xl font-bold mb-3">

                                        {event.title}

                                    </h2>

                                    <p className="text-gray-600 mb-4">

                                        {event.description}

                                    </p>

                                    <p className="mb-2">

                                        <strong>Date:</strong>{" "}
                                        {event.event_date}

                                    </p>

                                    <p className="mb-6">

                                        <strong>Location:</strong>{" "}
                                        {event.location}

                                    </p>

                                    <button

                                        onClick={() =>
                                            navigate(`/event/${event.id}`)
                                        }

                                        className="
                                            bg-purple-600
                                            hover:bg-purple-700
                                            text-white
                                            px-6
                                            py-3
                                            rounded-lg
                                            w-full
                                        "

                                    >

                                        View Details

                                    </button>

                                </div>

                            ))

                        }

                    </div>

                )

            }

        </div>

    );

};

export default Events;