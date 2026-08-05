<?php
require_once __DIR__ . '/../config/database.php';

header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename=EventEase_Financial_Ledger_' . date('Y-m-d') . '.csv');

$output = fopen('php://output', 'w');

// Output CSV header row
fputcsv($output, ['Payout ID', 'Organizer Name', 'Organizer Email', 'Event Title', 'Gross Revenue (LKR)', 'Commission Rate (%)', 'Platform Fee (LKR)', 'Net Payout (LKR)', 'Bank Name', 'Account Number', 'Payout Status', 'Requested Date', 'Processed Date', 'Admin Notes']);

$sql = "SELECT p.*, e.title as event_title, u.full_name as organizer_name, u.email as organizer_email 
        FROM organizer_payouts p 
        LEFT JOIN events e ON p.event_id = e.id 
        LEFT JOIN users u ON p.organizer_id = u.id 
        ORDER BY p.id DESC";

$result = $conn->query($sql);
if ($result) {
    while ($row = $result->fetch_assoc()) {
        fputcsv($output, [
            $row['id'],
            $row['organizer_name'] ?? 'Organizer #' . $row['organizer_id'],
            $row['organizer_email'] ?? 'N/A',
            $row['event_title'] ?? 'General Revenue Settlement',
            $row['gross_revenue'],
            $row['commission_rate'] . '%',
            $row['commission_fee'],
            $row['net_payout'],
            $row['bank_name'] ?? 'N/A',
            $row['account_number'] ?? 'N/A',
            strtoupper($row['status']),
            $row['requested_at'],
            $row['processed_at'] ?? 'Pending',
            $row['admin_notes'] ?? ''
        ]);
    }
}
fclose($output);
$conn->close();
exit;
?>
