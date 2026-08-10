<?php

require_once __DIR__ . "/../vendor/autoload.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;
use Dompdf\Dompdf;
use Dompdf\Options;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;

/**
 * Fetch SMTP settings safely from config file and database overrides
 */
function getSmtpSettings($conn, $customOverrides = []) {
    $configFile = __DIR__ . '/../config/smtp.php';
    $settings = file_exists($configFile) ? include($configFile) : [
        'smtp_host'       => 'smtp.gmail.com',
        'smtp_port'       => 587,
        'smtp_user'       => '',
        'smtp_pass'       => '',
        'smtp_from_email' => 'noreply@eventease.com',
        'smtp_from_name'  => 'EventEase Ticketing System'
    ];

    if ($conn) {
        $res = @mysqli_query($conn, "SELECT setting_key, setting_value FROM system_settings WHERE setting_key LIKE 'smtp_%'");
        $dbSettings = [];
        if ($res) {
            while ($row = mysqli_fetch_assoc($res)) {
                $v = trim($row['setting_value'] ?? '');
                if ($v !== '') {
                    $dbSettings[$row['setting_key']] = $v;
                }
            }
        }

        // Only override user/pass if DB has valid non-empty credentials
        if (!empty($dbSettings['smtp_user']) && !empty($dbSettings['smtp_pass'])) {
            $settings['smtp_user'] = $dbSettings['smtp_user'];
            $settings['smtp_pass'] = $dbSettings['smtp_pass'];
        }
        if (!empty($dbSettings['smtp_host'])) $settings['smtp_host'] = $dbSettings['smtp_host'];
        if (!empty($dbSettings['smtp_port'])) $settings['smtp_port'] = intval($dbSettings['smtp_port']);
        if (!empty($dbSettings['smtp_from_email'])) $settings['smtp_from_email'] = $dbSettings['smtp_from_email'];
        if (!empty($dbSettings['smtp_from_name'])) $settings['smtp_from_name'] = $dbSettings['smtp_from_name'];
    }

    if (!empty($customOverrides) && is_array($customOverrides)) {
        foreach ($customOverrides as $k => $v) {
            if (trim($v) !== '') {
                $settings[$k] = trim($v);
            }
        }
    }

    return $settings;
}

/**
 * Send email via PHPMailer SMTP with PDF attachment support & full debug trace
 */
function sendSmtpMail($to, $subject, $body_html, $conn, $attachmentData = null, $attachmentFilename = "e-ticket.pdf", $customSettings = []) {
    $config = getSmtpSettings($conn, $customSettings);
    $host = trim($config['smtp_host'] ?? 'smtp.gmail.com');
    $port = intval($config['smtp_port'] ?? 587);
    $username = trim($config['smtp_user'] ?? '');
    $password = trim($config['smtp_pass'] ?? '');
    $fromEmail = trim($config['smtp_from_email'] ?? 'noreply@eventease.com');
    $fromName = trim($config['smtp_from_name'] ?? 'EventEase Ticketing System');

    $mail = new PHPMailer(true);
    $debugLog = "";

    try {
        $mail->SMTPDebug = SMTP::DEBUG_SERVER;
        $mail->Debugoutput = function($str, $level) use (&$debugLog) {
            $debugLog .= "[$level] " . trim($str) . "\n";
        };

        if (!empty($host) && !empty($username) && !empty($password)) {
            $mail->isSMTP();
            $mail->Host = $host;
            $mail->SMTPAuth = true;
            $mail->Username = $username;
            $mail->Password = $password;
            $mail->Port = $port;

            if ($port == 465) {
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            } else {
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            }

            $mail->SMTPOptions = array(
                'ssl' => array(
                    'verify_peer'       => false,
                    'verify_peer_name'  => false,
                    'allow_self_signed' => true
                )
            );
        } else {
            // Local dev fallback if credentials missing
            $mail->isMail();
        }

        $mail->setFrom($fromEmail, $fromName);
        $mail->addAddress($to);
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $body_html;
        $mail->AltBody = strip_tags(str_replace(['<br>', '<br/>', '</p>'], "\n", $body_html));

        if (!empty($attachmentData)) {
            $mail->addStringAttachment($attachmentData, $attachmentFilename, 'base64', 'application/pdf');
        }

        $sent = $mail->send();

        return [
            'success'       => true,
            'message'       => 'Message accepted by SMTP server (250 OK)',
            'debug'         => $debugLog,
            'settings_used' => [
                'host'       => $host,
                'port'       => $port,
                'user'       => $username,
                'from_email' => $fromEmail,
                'from_name'  => $fromName
            ]
        ];
    } catch (Exception $e) {
        $errorMsg = $mail->ErrorInfo ?: $e->getMessage();
        return [
            'success'       => false,
            'message'       => $errorMsg,
            'debug'         => $debugLog . "\nException: " . $e->getMessage(),
            'settings_used' => [
                'host'       => $host,
                'port'       => $port,
                'user'       => $username,
                'from_email' => $fromEmail,
                'from_name'  => $fromName
            ]
        ];
    }
}

/**
 * Generate E-Ticket PDF Binary Buffer using Dompdf & Endroid QR Code
 */
function generateTicketPdfBufferForEmail($conn, $booking_id) {
    try {
        $sql = "
        SELECT
            bookings.id AS booking_id,
            bookings.event_id,
            bookings.ticket_quantity,
            bookings.total_amount,
            bookings.booking_date,
            tickets.id AS ticket_id,
            tickets.ticket_code,
            tickets.qr_code,
            tickets.status,
            tickets.seat_number,
            events.title,
            events.event_date,
            events.location,
            users.full_name,
            users.email
        FROM bookings
        LEFT JOIN tickets ON bookings.id = tickets.booking_id
        LEFT JOIN events ON bookings.event_id = events.id
        LEFT JOIN users ON bookings.user_id = users.id
        WHERE bookings.id = '$booking_id'
        ORDER BY tickets.id DESC
        LIMIT 1
        ";

        $res = mysqli_query($conn, $sql);
        if (!$res || mysqli_num_rows($res) == 0) return null;
        $ticket = mysqli_fetch_assoc($res);

        $bId = $ticket['booking_id'];
        $ticketCode = !empty($ticket["ticket_code"]) ? $ticket["ticket_code"] : "EVT-" . $bId . "-" . rand(1000, 9999);

        // Fetch reserved seat codes
        $seatSql = "SELECT GROUP_CONCAT(seat_code SEPARATOR ', ') AS reserved_seats FROM event_booked_seats WHERE booking_id = '$bId'";
        $seatRes = mysqli_query($conn, $seatSql);
        $reservedSeats = ($seatRes && $seatRow = mysqli_fetch_assoc($seatRes)) ? ($seatRow['reserved_seats'] ?? "") : "";
        $seatNumberDisplay = !empty($reservedSeats) ? $reservedSeats : (!empty($ticket['seat_number']) ? $ticket['seat_number'] : "General Admission");

        // Generate QR Code base64 Data URI
        $qrImage = "";
        try {
            $qrCodeObj = QrCode::create($ticketCode)->setSize(200)->setMargin(5);
            $writer = new PngWriter();
            $qrImage = $writer->write($qrCodeObj)->getDataUri();
        } catch (Throwable $e) {
            $qrImage = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" . urlencode($ticketCode);
        }

        $eventTitle = htmlspecialchars($ticket["title"] ?? "Event Pass");
        $eventDate = htmlspecialchars($ticket["event_date"] ?? "N/A");
        $eventLocation = htmlspecialchars($ticket["location"] ?? "Main Venue");
        $fullName = htmlspecialchars($ticket["full_name"] ?? "Valued Customer");
        $email = htmlspecialchars($ticket["email"] ?? "N/A");
        $ticketQty = intval($ticket["ticket_quantity"] ?? 1);
        $totalAmount = number_format(floatval($ticket["total_amount"] ?? 0), 2);
        $ticketStatus = strtoupper($ticket["status"] ?? 'VALID');

        $html = '
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="utf-8">
        <style>
        @page { margin: 20px; }
        body { font-family: Helvetica, Arial, sans-serif; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 10px; }
        .ticket-wrapper { max-width: 750px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #e2e8f0; }
        .ticket-header { background: #2e1065; color: #ffffff; padding: 24px 30px; }
        .ticket-header table { width: 100%; border-collapse: collapse; }
        .logo-title { font-size: 22px; font-weight: 900; color: #ffffff; text-transform: uppercase; }
        .logo-subtitle { font-size: 11px; color: #d8b4fe; margin-top: 3px; text-transform: uppercase; letter-spacing: 1.5px; }
        .vip-badge { background: #d97706; color: #ffffff; font-size: 11px; font-weight: 800; padding: 6px 14px; border-radius: 20px; text-transform: uppercase; display: inline-block; }
        .ticket-body { padding: 25px 30px; }
        .event-banner { background: #f1f5f9; border-left: 5px solid #7e22ce; padding: 14px 18px; border-radius: 12px; margin-bottom: 22px; }
        .event-title { font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; }
        .event-meta { font-size: 12px; color: #64748b; margin: 0; }
        .details-table { width: 100%; border-collapse: collapse; }
        .details-table td { padding: 10px 8px; vertical-align: top; }
        .col-left { width: 62%; padding-right: 20px; }
        .col-right { width: 38%; text-align: center; border-left: 2px dashed #cbd5e1; padding-left: 20px; }
        .field-label { font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 3px; }
        .field-value { font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 12px; }
        .seat-box { background: #faf5ff; border: 1.5px solid #c084fc; color: #6b21a8; font-size: 15px; font-weight: 900; padding: 8px 14px; border-radius: 10px; display: inline-block; font-family: monospace; }
        .qr-container { background: #ffffff; padding: 10px; border-radius: 16px; border: 1px solid #e2e8f0; display: inline-block; margin-top: 5px; }
        .ticket-code { font-family: monospace; font-size: 13px; font-weight: 800; color: #6b21a8; margin-top: 8px; }
        .ticket-footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 14px 30px; font-size: 10px; color: #94a3b8; text-align: center; }
        </style>
        </head>
        <body>
        <div class="ticket-wrapper">
            <div class="ticket-header">
                <table>
                    <tr>
                        <td>
                            <div class="logo-title">EventEase</div>
                            <div class="logo-subtitle">Official Entry Pass</div>
                        </td>
                        <td style="text-align:right;">
                            <span class="vip-badge">Verified Pass</span>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="ticket-body">
                <div class="event-banner">
                    <h2 class="event-title">'.$eventTitle.'</h2>
                    <p class="event-meta"><strong>Date:</strong> '.$eventDate.' &bull; <strong>Location:</strong> '.$eventLocation.'</p>
                </div>
                <table class="details-table">
                    <tr>
                        <td class="col-left">
                            <div class="field-label">Attendee Name</div>
                            <div class="field-value">'.$fullName.'</div>

                            <div class="field-label">Attendee Email</div>
                            <div class="field-value">'.$email.'</div>

                            <div class="field-label">Reserved Seat Number(s)</div>
                            <div class="field-value"><span class="seat-box">'.$seatNumberDisplay.'</span></div>

                            <table style="width: 100%; margin-top: 10px;">
                                <tr>
                                    <td style="padding:0;">
                                        <div class="field-label">Booking Reference</div>
                                        <div class="field-value">#'.$bId.'</div>
                                    </td>
                                    <td style="padding:0;">
                                        <div class="field-label">Ticket Quantity</div>
                                        <div class="field-value">'.$ticketQty.' Ticket(s)</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:0;">
                                        <div class="field-label">Total Amount Paid</div>
                                        <div class="field-value" style="color: #059669; font-size: 15px;">LKR '.$totalAmount.'</div>
                                    </td>
                                    <td style="padding:0;">
                                        <div class="field-label">Status</div>
                                        <div class="field-value" style="color: #0284c7;">'.$ticketStatus.'</div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td class="col-right">
                            <div class="field-label" style="margin-bottom: 8px;">Scan at Entrance</div>
                            <div class="qr-container">
                                <img src="'.$qrImage.'" width="150" height="150">
                            </div>
                            <div class="ticket-code">'.$ticketCode.'</div>
                            <div style="font-size: 9px; color: #94a3b8; margin-top: 6px;">Valid for single gate entry</div>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="ticket-footer">
                EventEase Digital Pass &bull; Generated on '.date('Y-m-d H:i:s').' &bull; Keep ticket barcode confidential
            </div>
        </div>
        </body>
        </html>
        ';

        $options = new Options();
        $options->set("isRemoteEnabled", true);
        $options->set("isHtml5ParserEnabled", true);

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper("A4", "portrait");
        $dompdf->render();

        return $dompdf->output();
    } catch (Throwable $e) {
        error_log("PDF generation error for email: " . $e->getMessage());
        return null;
    }
}

/**
 * Main Email Trigger Function: Dispatches booking confirmation email with attached PDF E-Ticket
 */
function sendBookingConfirmationEmail($conn, $booking_id, $customSmtpOverrides = []) {
    try {
        $booking_id = intval($booking_id);
        if (!$booking_id) {
            return ['success' => false, 'message' => 'Invalid booking ID'];
        }

        $query = "SELECT b.id as booking_id, b.user_id, b.payment_status, b.ticket_quantity, b.total_amount, b.booking_date,
                         u.full_name as customer_name, u.email as customer_email,
                         e.title as event_title, e.event_date, e.location, e.price,
                         t.id as ticket_id, t.ticket_code, t.qr_code, t.seat_number
                  FROM bookings b
                  JOIN users u ON b.user_id = u.id
                  JOIN events e ON b.event_id = e.id
                  LEFT JOIN tickets t ON t.booking_id = b.id
                  WHERE b.id = '$booking_id'
                  ORDER BY t.id DESC
                  LIMIT 1";

        $res = mysqli_query($conn, $query);
        if (!$res || mysqli_num_rows($res) == 0) {
            return ['success' => false, 'message' => "Booking details not found for ID #$booking_id"];
        }

        $data = mysqli_fetch_assoc($res);
        $recipient_email = trim($data['customer_email']);
        $user_id = intval($data['user_id']);
        $event_title = htmlspecialchars($data['event_title']);
        $ticket_code = !empty($data['ticket_code']) ? $data['ticket_code'] : ('EVT-' . $booking_id . '-' . rand(1000, 9999));
        $customer_name = htmlspecialchars($data['customer_name']);

        // Check if ticket row exists, create if missing
        if (empty($data['ticket_id'])) {
            $insTicket = "INSERT INTO tickets (booking_id, ticket_code, status) VALUES ('$booking_id', '$ticket_code', 'paid')";
            mysqli_query($conn, $insTicket);
        }

        // DUPLICATE PREVENTION:
        // ONLY genuine successful deliveries (status = 'sent') prevent future resends!
        // Failed or logged attempts MUST NOT block future resend attempts.
        $dupCheck = mysqli_query($conn, "
            SELECT id FROM email_logs
            WHERE booking_id = '$booking_id'
            AND status = 'sent'
            LIMIT 1
        ");

        if ($dupCheck && mysqli_num_rows($dupCheck) > 0) {
            return ['success' => true, 'message' => 'Email already sent successfully for this booking previously'];
        }

        $subject = "🎟️ Booking Confirmation & E-Ticket - " . $data['event_title'] . " [" . $ticket_code . "]";

        // Generate QR code data URI for email HTML body
        $qrImageUrl = "";
        try {
            $qrObj = QrCode::create($ticket_code)->setSize(180)->setMargin(5);
            $writer = new PngWriter();
            $qrImageUrl = $writer->write($qrObj)->getDataUri();
        } catch (Throwable $t) {
            $qrImageUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' . urlencode($ticket_code);
        }

        $seatDisplay = !empty($data['seat_number']) ? htmlspecialchars($data['seat_number']) : "General Admission";

        $body_html = '
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: \'Segoe UI\', Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; color: #333; }
            .ticket-card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
            .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff; padding: 28px 24px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0.5px; }
            .header p { margin: 6px 0 0 0; opacity: 0.9; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; }
            .content { padding: 28px 24px; }
            .detail-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px dashed #e2e8f0; padding-bottom: 8px; }
            .detail-label { color: #64748b; font-size: 13px; font-weight: 600; }
            .detail-val { color: #0f172a; font-size: 13px; font-weight: 700; }
            .qr-section { text-align: center; margin: 24px 0; background: #faf5ff; padding: 20px; border-radius: 12px; border: 1px solid #e9d5ff; }
            .qr-code-box { display: inline-block; padding: 10px; background: #ffffff; border-radius: 12px; border: 1px solid #d8b4fe; }
            .badge-attachment { background: #ecfdf5; border: 1px solid #a7f3d0; color: #047857; padding: 12px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; margin-top: 20px; }
            .footer { background: #f1f5f9; padding: 18px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
            </style>
        </head>
        <body>
          <div class="ticket-card">
            <div class="header">
              <h1>🎉 Booking Confirmed!</h1>
              <p>EventEase Ticket Reservation Platform</p>
            </div>
            <div class="content">
              <p style="font-size:15px; margin-top:0;">Dear <strong>' . $customer_name . '</strong>,</p>
              <p style="font-size:14px; color:#475569; line-height:1.5;">Thank you for your reservation! Your payment has been successfully processed and confirmed. Your official entry pass and QR ticket are ready below.</p>
              
              <div class="detail-box">
                <div class="detail-row">
                  <span class="detail-label">Event Name:</span>
                  <span class="detail-val" style="color:#4f46e5;">' . $event_title . '</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Ticket Code:</span>
                  <span class="detail-val" style="font-family:monospace;">' . $ticket_code . '</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date & Location:</span>
                  <span class="detail-val">' . htmlspecialchars($data['event_date']) . ' | ' . htmlspecialchars($data['location']) . '</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Reserved Seat(s):</span>
                  <span class="detail-val" style="color:#7c3aed;">' . $seatDisplay . '</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Ticket Quantity:</span>
                  <span class="detail-val">' . $data['ticket_quantity'] . ' Ticket(s)</span>
                </div>
                <div class="detail-row" style="border-bottom:none; margin-bottom:0; padding-bottom:0;">
                  <span class="detail-label">Total Amount Paid:</span>
                  <span class="detail-val" style="color:#16a34a; font-size:15px;">LKR ' . number_format(floatval($data['total_amount']), 2) . '</span>
                </div>
              </div>

              <div class="qr-section">
                <h3 style="margin-top:0; color:#1e293b; font-size:16px;">Gate Entrance QR Pass</h3>
                <p style="font-size:12px; color:#64748b; margin-bottom:14px;">Present this scannable QR code at the venue gate for entry validation.</p>
                <div class="qr-code-box">
                  <img src="' . $qrImageUrl . '" alt="QR Code" width="180" height="180" style="display:block;" />
                </div>
                <p style="font-size:13px; font-weight:bold; color:#6b21a8; margin-top:10px; font-family:monospace;">' . $ticket_code . '</p>
              </div>

              <div class="badge-attachment">
                📎 <span><strong>E-Ticket PDF Attached:</strong> Your official printable E-Ticket PDF pass is attached to this email. You can also view or download it anytime from your EventEase Account under "My Bookings".</span>
              </div>
            </div>
            <div class="footer">
              EventEase Digital Ticketing System &bull; Keep ticket QR code confidential &bull; Support: support@eventease.com
            </div>
          </div>
        </body>
        </html>
        ';

        // Generate official E-Ticket PDF Buffer for attachment
        $pdfBuffer = generateTicketPdfBufferForEmail($conn, $booking_id);
        $pdfFilename = "Ticket-" . $ticket_code . ".pdf";

        // Dispatch Email via PHPMailer SMTP
        $smtpResult = sendSmtpMail($recipient_email, $subject, $body_html, $conn, $pdfBuffer, $pdfFilename, $customSmtpOverrides);

        $status = $smtpResult['success'] ? 'sent' : 'failed';
        $error_msg = $smtpResult['success'] ? null : mysqli_real_escape_string($conn, $smtpResult['message']);

        // Record log entry in email_logs table
        $safe_email = mysqli_real_escape_string($conn, $recipient_email);
        $safe_subject = mysqli_real_escape_string($conn, $subject);
        $safe_body = mysqli_real_escape_string($conn, $body_html);
        $safe_err = $error_msg ? "'$error_msg'" : "NULL";

        $log_query = "INSERT INTO email_logs (user_id, booking_id, recipient_email, subject, body_html, status, error_message)
                      VALUES ('$user_id', '$booking_id', '$safe_email', '$safe_subject', '$safe_body', '$status', $safe_err)";
        @mysqli_query($conn, $log_query);

        return $smtpResult;
    } catch (Throwable $e) {
        error_log("Email delivery error: " . $e->getMessage());
        return ['success' => false, 'message' => $e->getMessage()];
    }
}
?>
