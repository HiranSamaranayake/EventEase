import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const EventDetails = () => {

    const { id } = useParams();

    const [event, setEvent] = useState(null);

    useEffect(() => {

        fetch(
            `http://localhost/EventEase/backend/api/event_details.php?id=${id}`
        )
            .then(res => res.json())
            .then(data => {

                if(data.success){

                    setEvent(data.event);

                }

            });

    }, [id]);

    if(!event){

        return (
            <div className="p-10">
                Loading...
            </div>
        );

    }

    return (

        <div className="bg-gray-100 min-h-screen">

            <div className="max-w-6xl mx-auto p-8">

                <div className="
                    bg-white
                    rounded-3xl
                    shadow-xl
                    overflow-hidden
                ">

                    <img
                        src="https://images.unsplash.com/photo-1511578314322-379afb476865"
                        alt="Event"
                        className="
                            w-full
                            h-96
                            object-cover
                        "
                    />

                    <div className="p-8">

                        <h1 className="
                            text-4xl
                            font-bold
                            mb-4
                        ">
                            {event.title}
                        </h1>

                        <div className="
                            grid
                            md:grid-cols-3
                            gap-4
                            mb-8
                        ">

                            <div className="
                                bg-purple-100
                                p-4
                                rounded-xl
                            ">
                                📅 {event.event_date}
                            </div>

                            <div className="
                                bg-blue-100
                                p-4
                                rounded-xl
                            ">
                                📍 {event.location}
                            </div>

                            <div className="
                                bg-green-100
                                p-4
                                rounded-xl
                            ">
                                Rs. {event.price}
                            </div>

                        </div>

                        <h2 className="
                            text-2xl
                            font-bold
                            mb-4
                        ">
                            Event Description
                        </h2>

                        <p className="
                            text-gray-600
                            leading-8
                            mb-8
                        ">
                            {event.description}
                        </p>

                        <Link
                            to={`/book-event/${event.id}`}
                            className="
                                inline-block
                                bg-purple-600
                                text-white
                                px-8
                                py-4
                                rounded-xl
                                hover:bg-purple-700
                                transition
                            "
                        >
                            Book Now
                        </Link>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default EventDetails;