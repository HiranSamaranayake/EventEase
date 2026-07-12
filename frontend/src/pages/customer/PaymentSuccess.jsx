import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const bookingId = searchParams.get("booking");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(false);

  useEffect(() => {

    if (!bookingId) {

      setError(true);
      setLoading(false);

      return;

    }

    const checkBooking = () => {

      fetch(
        `http://localhost/EventEase/backend/api/check_booking.php?id=${bookingId}`
      )
        .then((res) => res.json())

        .then((data) => {

          console.log(data);

          if (

            data.booking_status === "Confirmed" &&
            data.payment_status === "Paid"

          ) {

            setLoading(false);

          } else {

            setTimeout(checkBooking, 2000);

          }

        })

        .catch((err) => {

          console.log(err);

          setError(true);

          setLoading(false);

        });

    };

    checkBooking();

  }, [bookingId]);

  /*
  -----------------------------------------
  Error Screen
  -----------------------------------------
  */

  if (error) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <div className="text-center">

          <h1 className="text-3xl font-bold text-red-600">

            Unable to verify payment.

          </h1>

          <button

            onClick={() => navigate("/")}

            className="mt-6 bg-red-600 text-white px-6 py-3 rounded-xl"

          >

            Back Home

          </button>

        </div>

      </div>

    );

  }

  /*
  -----------------------------------------
  Loading Screen
  -----------------------------------------
  */

  if (loading) {

    return (

      <div
        className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gray-100
        "
      >

        <div className="text-center">

          <div
            className="
            animate-spin
            rounded-full
            h-20
            w-20
            border-b-4
            border-green-600
            mx-auto
            "
          ></div>

          <h2 className="text-2xl font-bold mt-8">

            Verifying your payment...

          </h2>

          <p className="text-gray-500 mt-2">

            Please wait a moment.

          </p>

        </div>

      </div>

    );

  }

  /*
  -----------------------------------------
  Success Screen
  -----------------------------------------
  */

  return (

    <div
      className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gradient-to-br
      from-green-50
      to-emerald-100
      p-8
      "
    >

      <div
        className="
        bg-white
        rounded-3xl
        shadow-2xl
        p-12
        max-w-lg
        text-center
        "
      >

        <FaCheckCircle
          className="
          text-7xl
          text-green-600
          mx-auto
          mb-6
          "
        />

        <h1
          className="
          text-4xl
          font-black
          text-green-700
          "
        >

          Payment Successful

        </h1>

        <p className="mt-5 text-gray-600 text-lg">

          Your booking has been confirmed.

          <br />

          Your ticket has been generated successfully.

        </p>

        <button

          onClick={() => navigate("/my-bookings")}

          className="
          mt-8
          bg-green-600
          hover:bg-green-700
          text-white
          px-8
          py-4
          rounded-xl
          transition
          "

        >

          View My Bookings

        </button>

      </div>

    </div>

  );

};

export default PaymentSuccess;