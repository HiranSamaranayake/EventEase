<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: text/plain");

require_once "../config/database.php";
require_once "../vendor/autoload.php";

use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;


//--------------------------------------------------
// PayHere POST Data
//--------------------------------------------------

$order_id = $_POST["order_id"] ?? "";
$status_code = $_POST["status_code"] ?? "";

if (empty($order_id)) {
    exit("Booking ID missing");
}

$bookingId = intval($order_id);


//--------------------------------------------------
// Payment Successful
//--------------------------------------------------

if ($status_code == "2") {

    // Update booking
    mysqli_query($conn,"
        UPDATE bookings
        SET
            payment_status='Paid',
            booking_status='Confirmed'
        WHERE id='$bookingId'
    ");

    //--------------------------------------------------
    // Check ticket already exists
    //--------------------------------------------------

    $check = mysqli_query($conn,"
        SELECT id
        FROM tickets
        WHERE booking_id='$bookingId'
        LIMIT 1
    ");

    if(mysqli_num_rows($check)==0){

        //--------------------------------------------------
        // Generate Ticket Code
        //--------------------------------------------------

        $ticketCode = "EVT-".$bookingId."-".rand(1000,9999);

        //--------------------------------------------------
        // Generate QR Code
        //--------------------------------------------------

        $qrText =
            "Ticket Code : ".$ticketCode."\n".
            "Booking ID : ".$bookingId;

        $qrCode = new QrCode($qrText);

        $qrCode->setSize(300);
        $qrCode->setMargin(10);

        $writer = new PngWriter();

        $result = $writer->write($qrCode);

        //--------------------------------------------------
        // Save QR Image
        //--------------------------------------------------

        $folder = "../uploads/qr/";

        if(!file_exists($folder)){
            mkdir($folder,0777,true);
        }

        $fileName = "ticket_".$bookingId.".png";

        $result->saveToFile($folder.$fileName);

        $qrPath = "uploads/qr/".$fileName;

        //--------------------------------------------------
        // Insert Ticket
        //--------------------------------------------------

        mysqli_query($conn,"
            INSERT INTO tickets
            (
                booking_id,
                ticket_code,
                qr_code,
                status
            )
            VALUES
            (
                '$bookingId',
                '$ticketCode',
                '$qrPath',
                'unused'
            )
        ");

    }

    require_once __DIR__ . "/../utils/email_helper.php";
    sendBookingConfirmationEmail($conn, $bookingId);

    echo "Payment updated successfully";

}


//--------------------------------------------------
// Payment Failed
//--------------------------------------------------

else{

    mysqli_query($conn,"
        UPDATE bookings
        SET
            payment_status='Failed',
            booking_status='Cancelled'
        WHERE id='$bookingId'
    ");

    echo "Payment failed";

}

?>