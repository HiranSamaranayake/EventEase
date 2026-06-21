import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const TicketDetails = () => {

    const { id } = useParams();

    const [ticket, setTicket] = useState(null);

    useEffect(() => {

        fetch(
            `http://localhost/EventEase/backend/api/ticket_details.php?id=${id}`
        )
            .then((res) => res.json())
            .then((data) => {

                if(data.success){
 
                    setTicket(data.ticket);

                }

            });

    }, [id]);

    if(!ticket){

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
                rounded-2xl
                shadow-xl
                p-8
            ">

                <h1 className="
                    text-3xl
                    font-bold
                    mb-6
                ">
                    Ticket Details
                </h1>

                <div className="space-y-4">

                    <p>
                        <strong>Ticket Code:</strong>
                        {" "}
                        {ticket.ticket_code}
                    </p>

                    <p>
                        <strong>Event:</strong>
                        {" "}
                        {ticket.title}
                    </p>

                    <p>
                        <strong>Date:</strong>
                        {" "}
                        {ticket.event_date}
                    </p>

                    <p>
                        <strong>Location:</strong>
                        {" "}
                        {ticket.location}
                    </p>

                </div>

                <div className="mt-8">

                    <img
                        src={`http://localhost/EventEase/backend/${ticket.qr_code}`}
                        alt="QR Code"
                        className="
                            w-56
                            h-56
                            border
                            rounded-xl
                        "
                    />
                         <a
    href={`http://localhost/EventEase/backend/api/download_ticket.php?id=${ticket.id}`}
    className="
        mt-6
        inline-block
        bg-purple-600
        text-white
        px-6
        py-3
        rounded-xl
        hover:bg-purple-700
    "
>
    Download Ticket PDF
</a>

                </div>
           

            </div>

        </div>

    );

};

export default TicketDetails;