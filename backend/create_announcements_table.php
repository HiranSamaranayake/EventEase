<?php
require_once __DIR__ . "/config/database.php";

$sql = "CREATE TABLE IF NOT EXISTS `event_announcements` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `event_id` INT(11) NOT NULL,
  `organizer_id` INT(11) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `priority` ENUM('normal', 'urgent', 'emergency') NOT NULL DEFAULT 'normal',
  `broadcast_type` ENUM('all_attendees', 'vip_only', 'waiting_list') NOT NULL DEFAULT 'all_attendees',
  `sent_count` INT(11) DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `event_id_idx` (`event_id`),
  KEY `organizer_id_idx` (`organizer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;";

if (mysqli_query($conn, $sql)) {
    echo "Table 'event_announcements' created or already exists.\n";
    
    // Seed initial broadcast announcements if empty
    $check = mysqli_query($conn, "SELECT COUNT(*) as cnt FROM event_announcements");
    $row = mysqli_fetch_assoc($check);
    if ($row['cnt'] == 0) {
        $seeds = [
            [16, 2, 'Gate Opening Time & Parking Advisory', 'Gates will open at 5:30 PM sharp. Parking is available at Gate 2 and Gate 4. Please present your digital QR ticket for fast entry.', 'normal', 'all_attendees', 198],
            [16, 2, 'URGENT: Hall Stage Floor Adjustment', 'Due to high turnout, the main stage floor seating has been upgraded to climate-controlled indoor hall A.', 'urgent', 'all_attendees', 198],
            [17, 2, 'VIP Meet & Greet Session Notice', 'All VIP Platinum pass holders are invited to the pre-event reception at 4:00 PM in Lounge 1.', 'normal', 'vip_only', 45]
        ];

        foreach ($seeds as $s) {
            $ev_id = $s[0];
            $org_id = $s[1];
            $title = mysqli_real_escape_string($conn, $s[2]);
            $msg = mysqli_real_escape_string($conn, $s[3]);
            $prio = $s[4];
            $btype = $s[5];
            $scnt = $s[6];

            $conn->query("INSERT INTO event_announcements (event_id, organizer_id, title, message, priority, broadcast_type, sent_count) VALUES ($ev_id, $org_id, '$title', '$msg', '$prio', '$btype', $scnt)");
        }
        echo "Seeded initial event broadcast announcements.\n";
    }
} else {
    echo "Error creating event_announcements table: " . mysqli_error($conn) . "\n";
}
?>
