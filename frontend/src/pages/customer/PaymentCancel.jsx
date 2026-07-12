import { FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PaymentCancel = () => {

  const navigate = useNavigate();

  return (

    <div
      className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-red-50
      p-8
      "
    >

      <div
        className="
        bg-white
        rounded-3xl
        shadow-xl
        p-12
        max-w-lg
        text-center
        "
      >

        <FaTimesCircle
          className="
          text-7xl
          text-red-600
          mx-auto
          mb-6
          "
        />

        <h1
          className="
          text-4xl
          font-black
          text-red-600
          "
        >
          Payment Cancelled
        </h1>

        <p className="mt-5 text-gray-600">

          Your booking is still pending.

          <br />

          No payment was received.

        </p>

        <button

          onClick={() => navigate("/")}

          className="
          mt-8
          bg-red-600
          hover:bg-red-700
          text-white
          px-8
          py-4
          rounded-xl
          "

        >

          Back to Home

        </button>

      </div>

    </div>

  );

};

export default PaymentCancel;