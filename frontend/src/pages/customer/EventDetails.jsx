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

            if (data.success) {

                setEvent(data.event);

            }

        });

    }, [id]);

    if (!event) {

        return (

            <div className="min-h-screen flex items-center justify-center">

                Loading...

            </div>

        );

    }

    return (

        <div className="bg-gray-100 min-h-screen py-10">

            <div className="max-w-7xl mx-auto px-6">

                <div
                    className="
                        bg-white
                        rounded-3xl
                        shadow-xl
                        overflow-hidden
                    "
                >

                    {/* Banner */}

                    <div className="relative">

                        <img
                            src={
                                event.image
                                    ? `http://localhost/EventEase/backend/uploads/${event.image}`
                                    : "https://via.placeholder.com/1200x500?text=No+Image"
                            }
                            alt={event.title}
                            className="
                                w-full
                                h-[420px]
                                object-cover
                            "
                        />

                        <div
                            className="
                                absolute
                                inset-0
                                bg-gradient-to-t
                                from-black/80
                                via-black/20
                                to-transparent
                            "
                        ></div>

                        <div
                            className="
                                absolute
                                bottom-6
                                left-6
                                flex
                                gap-3
                            "
                        >

                            <span
                                className="
                                    bg-purple-600
                                    text-white
                                    px-4
                                    py-2
                                    rounded-full
                                    font-semibold
                                "
                            >
                                {event.category || "General"}
                            </span>

                            <span
                                className="
                                    bg-green-600
                                    text-white
                                    px-4
                                    py-2
                                    rounded-full
                                    font-semibold
                                "
                            >
                                {Number(event.price) === 0
                                    ? "FREE"
                                    : `Rs. ${Number(event.price).toLocaleString()}`}
                            </span>

                        </div>

                    </div>

                    {/* Content */}

                    <div className="p-8">

                        <div className="grid lg:grid-cols-3 gap-8">

                            {/* Left Side */}

                            <div className="lg:col-span-2">

                                <h1
                                    className="
                                        text-4xl
                                        font-bold
                                        mb-6
                                    "
                                >
                                    {event.title}
                                </h1>

                                {/* Information Cards */}

                                <div className="grid md:grid-cols-3 gap-6 mb-10">

                                    <div
                                        className="
                                            bg-purple-50
                                            border
                                            border-purple-100
                                            rounded-2xl
                                            p-6
                                            shadow-sm
                                        "
                                    >

                                        <p className="text-sm text-gray-500 mb-2">

                                            📅 Event Date

                                        </p>

                                        <h3 className="text-xl font-bold">

                                            {event.event_date}

                                        </h3>

                                    </div>

                                    <div
                                        className="
                                            bg-blue-50
                                            border
                                            border-blue-100
                                            rounded-2xl
                                            p-6
                                            shadow-sm
                                        "
                                    >

                                        <p className="text-sm text-gray-500 mb-2">

                                            📍 Location

                                        </p>

                                        <h3 className="text-xl font-bold">

                                            {event.location}

                                        </h3>

                                    </div>

                                    <div
                                        className="
                                            bg-green-50
                                            border
                                            border-green-100
                                            rounded-2xl
                                            p-6
                                            shadow-sm
                                        "
                                    >

                                        <p className="text-sm text-gray-500 mb-2">

                                            💰 Ticket Price

                                        </p>

                                        <h3 className="text-xl font-bold text-green-700">

                                            {Number(event.price) === 0
                                                ? "FREE"
                                                : `Rs. ${Number(event.price).toLocaleString()}`}

                                        </h3>

                                    </div>

                                </div>

                                {/* Description */}

                                <div
                                    className="
                                        bg-gray-50
                                        rounded-2xl
                                        p-8
                                        border
                                    "
                                >

                                    <h2 className="text-2xl font-bold mb-5">

                                        About This Event

                                    </h2>

                                    <p className="text-gray-700 leading-8 text-lg">

                                        {event.description}

                                    </p>

                                </div>

                            </div>

                            {/* Right Side */}

                            <div
                                className="
                                    bg-white
                                    rounded-3xl
                                    shadow-xl
                                    border
                                    p-8
                                    h-fit
                                    sticky
                                    top-8
                                "
                            >

                                <h3 className="text-2xl font-bold mb-6">

                                    Book This Event

                                </h3>

                                <div className="space-y-5 mb-8">

                                    <div className="flex justify-between">

                                        <span className="text-gray-500">

                                            Price

                                        </span>

                                        <span className="font-bold text-green-700">

                                            {Number(event.price) === 0
                                                ? "FREE"
                                                : `Rs. ${Number(event.price).toLocaleString()}`}

                                        </span>

                                    </div>

                                    <div className="flex justify-between">

                                        <span className="text-gray-500">

                                            Date

                                        </span>

                                        <span>

                                            {event.event_date}

                                        </span>

                                    </div>

                                    <div className="flex justify-between">

                                        <span className="text-gray-500">

                                            Location

                                        </span>

                                        <span>

                                            {event.location}

                                        </span>

                                    </div>

                                </div>

                                <Link
                                    to={`/book-event/${event.id}`}
                                    className="
                                        w-full
                                        flex
                                        justify-center
                                        items-center
                                        bg-gradient-to-r
                                        from-purple-600
                                        to-fuchsia-600
                                        text-white
                                        py-4
                                        rounded-2xl
                                        text-lg
                                        font-semibold
                                        shadow-xl
                                        hover:scale-105
                                        hover:shadow-purple-500/30
                                        transition-all
                                        duration-300
                                    "
                                >
                                    🎟 Book Your Ticket
                                </Link>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default EventDetails;