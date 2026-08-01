import { Link, useLocation } from "react-router-dom";

const BookingConfirmation = () => {
  const location = useLocation();

  const booking = location.state;

  const bookingId = booking?.bookingId;
  const ticketId = booking?.ticketId;
  const ticketCode = booking?.ticketCode;

  return (
    <div
      className="
            min-h-screen
            flex
            items-center
            justify-center
            bg-gray-100
            p-6
        "
    >
      <div
        className="
                bg-white
                rounded-3xl
                shadow-2xl
                p-10
                max-w-2xl
                w-full
                text-center
            "
      >
        <div
          className="
                    w-24
                    h-24
                    bg-green-100
                    rounded-full
                    flex
                    items-center
                    justify-center
                    mx-auto
                    mb-6
                "
        >
          <span className="text-5xl">✅</span>
        </div>

        <h1
          className="
                    text-4xl
                    font-bold
                    text-green-600
                    mb-4
                "
        >
          Booking Successful
        </h1>

        <p
          className="
                    text-gray-500
                    mb-8
                "
        >
          Your event booking has been confirmed.
        </p>

        <div
          className="
                    bg-gray-50
                    rounded-2xl
                    p-6
                    text-left
                    mb-8
                "
        >
          <p>
            <strong>Booking ID:</strong> {bookingId}
          </p>

          <p className="mt-2">
            <strong>Ticket Code:</strong> {ticketCode}
          </p>
        </div>

        <div
          className="
                    flex
                    flex-col
                    md:flex-row
                    gap-4
                    justify-center
                "
        >
          <Link
            to={`/ticket/${ticketId}`}
            className="
                            bg-purple-600
                            text-white
                            px-6
                            py-3
                            rounded-xl
                            hover:bg-purple-700
                        "
          >
            View Ticket
          </Link>

          <Link
            to="/customer-dashboard"
            className="
                            bg-gray-200
                            px-6
                            py-3
                            rounded-xl
                            hover:bg-gray-300
                        "
          >
            Back To Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
