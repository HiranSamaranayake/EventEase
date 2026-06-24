import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BookEvent = () => {

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

        <div className="
            min-h-screen
            bg-gray-100
            p-8
        ">

            <div className="
                max-w-3xl
                mx-auto
                bg-white
                rounded-3xl
                shadow-xl
                p-8
            ">

                <h1 className="
                    text-3xl
                    font-bold
                    mb-6
                ">
                    Confirm Booking
                </h1>

                <div className="
                    space-y-4
                ">

                    <p>
                        <strong>Event:</strong>
                        {" "}
                        {event.title}
                    </p>

                    <p>
                        <strong>Date:</strong>
                        {" "}
                        {event.event_date}
                    </p>

                    <p>
                        <strong>Location:</strong>
                        {" "}
                        {event.location}
                    </p>

                    <p>
                        <strong>Price:</strong>
                        {" "}
                        Rs. {event.price}
                    </p>

                </div>

                <button
                    className="
                        mt-8
                        bg-purple-600
                        text-white
                        px-8
                        py-4
                        rounded-xl
                        hover:bg-purple-700
                    "
                >
                    Confirm Booking
                </button>

            </div>

        </div>

    );

};

export default BookEvent;