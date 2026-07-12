import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

/* global payhere */

const BookEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [event, setEvent] = useState(null);

  useEffect(() => {
    fetch(`http://localhost/EventEase/backend/api/event_details.php?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setEvent(data.event);
        }
      });
  }, [id]);

  const handleBooking = () => {
    if (!user) {
      alert("User not logged in");
      navigate("/login");
      return;
    }

    if (!event) {
      alert("Event not found");
      return;
    }

    fetch("http://localhost/EventEase/backend/api/create_booking.php", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        user_id: user.id,
        event_id: event.id,
        ticket_quantity: 1,
      }),
    })
      .then((res) => res.json())

      .then((data) => {
        if (!data.success) {
          alert(data.message);

          return;
        }

        /*
        -----------------------------------------
        Create PayHere Payment
        -----------------------------------------
        */

        fetch("http://localhost/EventEase/backend/api/create_payment.php", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            booking_id: data.booking_id,
          }),
        })
          .then((res) => res.json())

          .then((payment) => {
            if (!payment.success) {
              alert(payment.message);

              return;
            }

            /*
            -----------------------------------------
            PayHere Events
            -----------------------------------------
            */

            payhere.onCompleted = function (orderId) {
              navigate(`/payment-success?booking=${orderId}`);
            };

            payhere.onDismissed = function () {
              navigate("/payment-cancel");
            };

            payhere.onError = function (error) {
              console.log(error);

              alert("Payment Error");
            };

            /*
            -----------------------------------------
            Open PayHere
            -----------------------------------------
            */
            console.log("Payment Object:", payment);
            console.log("PayHere Object:", payhere);
            payhere.startPayment(payment);
          });
      })

      .catch((err) => {
        console.log(err);

        alert("Server Error");
      });
  };

  if (!event) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div
      className="
      min-h-screen
      bg-gray-100
      p-8
      "
    >
      <div
        className="
        max-w-3xl
        mx-auto
        bg-white
        rounded-3xl
        shadow-xl
        p-8
        "
      >
        <h1
          className="
          text-3xl
          font-bold
          mb-6
          "
        >
          Confirm Booking
        </h1>

        <div className="space-y-4">
          <p>
            <strong>Event:</strong> {event.title}
          </p>

          <p>
            <strong>Date:</strong> {event.event_date}
          </p>

          <p>
            <strong>Location:</strong> {event.location}
          </p>

          <p>
            <strong>Price:</strong> Rs. {event.price}
          </p>
        </div>

        <button
          onClick={handleBooking}
          className="
          mt-8
          bg-purple-600
          hover:bg-purple-700
          text-white
          px-8
          py-4
          rounded-xl
          transition
          "
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default BookEvent;
