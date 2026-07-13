import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const TicketView = () => {

    const { id } = useParams();

    const [ticket, setTicket] = useState(null);


    useEffect(() => {

        fetch(
            `http://localhost/EventEase/backend/api/download_ticket.php?booking_id=${id}`
        )
        .then(res => res.json())
        .then(data => {

            console.log(data);

            if(data.success){

                setTicket(data.ticket);

            }

        })
        .catch(err => console.log(err));


    }, [id]);



    if(!ticket){

        return (

            <div className="p-10 text-xl">
                Loading Ticket...
            </div>

        );

    }



    return (

        <div className="
        min-h-screen
        bg-gray-100
        flex
        justify-center
        items-center
        p-6
        ">


            <div className="
            bg-white
            shadow-2xl
            rounded-3xl
            p-8
            w-full
            max-w-md
            ">


                <h1 className="
                text-3xl
                font-bold
                text-purple-700
                text-center
                mb-6
                ">
                    Event Ticket
                </h1>


                <div className="space-y-3">


                    <p>
                        <b>Event:</b> {ticket.title}
                    </p>


                    <p>
                        <b>Name:</b> {ticket.full_name}
                    </p>


                    <p>
                        <b>Email:</b> {ticket.email}
                    </p>


                    <p>
                        <b>Date:</b> {ticket.event_date}
                    </p>


                    <p>
                        <b>Location:</b> {ticket.location}
                    </p>


                    <p>
                        <b>Tickets:</b> {ticket.ticket_quantity}
                    </p>


                    <p>
                        <b>Amount:</b> Rs {ticket.total_amount}
                    </p>


                    <p>
                        <b>Ticket Code:</b>

                        <span className="
                        text-green-600
                        font-bold
                        ml-2
                        ">
                            {ticket.ticket_code}
                        </span>

                    </p>


                </div>



                <button

                    onClick={()=>window.print()}

                    className="
                    mt-8
                    w-full
                    bg-purple-600
                    hover:bg-purple-700
                    text-white
                    py-3
                    rounded-xl
                    "

                >

                    Download PDF

                </button>


            </div>


        </div>

    );


};


export default TicketView;