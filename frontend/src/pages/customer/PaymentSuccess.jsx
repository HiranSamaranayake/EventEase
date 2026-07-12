import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {

  const navigate = useNavigate();

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