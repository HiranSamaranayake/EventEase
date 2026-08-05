<?php
require_once __DIR__ . "/config/database.php";

$sql = "CREATE TABLE IF NOT EXISTS `event_schedules` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `event_id` INT(11) NOT NULL,
  `session_title` VARCHAR(255) NOT NULL,
  `start_time` DATETIME NOT NULL,
  `end_time` DATETIME NOT NULL,
  `hall_stage` VARCHAR(150) DEFAULT NULL,
  `speaker_performer` VARCHAR(255) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `status` ENUM('scheduled', 'live', 'completed', 'cancelled') NOT NULL DEFAULT 'scheduled',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `event_id_idx` (`event_id`),
  KEY `status_idx` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;";

if (mysqli_query($conn, $sql)) {
    echo "Table 'event_schedules' created or already exists.\n";
    
    // Seed sample schedule entries if empty
    $check = mysqli_query($conn, "SELECT COUNT(*) as cnt FROM event_schedules");
    $row = mysqli_fetch_assoc($check);
    if ($row['cnt'] == 0) {
        $seeds = [
            [6, 'Opening Ceremony & Intro Act', '2026-08-15 18:00:00', '2026-08-15 19:30:00', 'Main Stage A', 'Marians Band', 'Welcome performance & inauguration ceremony.', 'scheduled'],
            [6, 'Headliner Concert Performance', '2026-08-15 20:00:00', '2026-08-15 23:00:00', 'Grand Arena', 'Bathiya & Santhush', 'Live acoustic concert & light show.', 'scheduled'],
            [16, 'Acoustic Sound Check & VIP Meet', '2026-07-25 17:00:00', '2026-07-25 18:30:00', 'VIP Lounge', 'Mariens Band Lead', 'Exclusive photo session for VIP ticket holders.', 'scheduled']
        ];

        foreach ($seeds as $s) {
            $ev_id = $s[0];
            $title = mysqli_real_escape_string($conn, $s[1]);
            $st = $s[2];
            $et = $s[3];
            $hs = mysqli_real_escape_string($conn, $s[4]);
            $sp = mysqli_real_escape_string($conn, $s[5]);
            $desc = mysqli_real_escape_string($conn, $s[6]);
            $stat = mysqli_real_escape_string($conn, $s[7]);

            $conn->query("INSERT INTO event_schedules (event_id, session_title, start_time, end_time, hall_stage, speaker_performer, description, status) VALUES ($ev_id, '$title', '$st', '$et', '$hs', '$sp', '$desc', '$stat')");
        }
        echo "Seeded initial event schedule sessions.\n";
    }
} else {
    echo "Error creating event_schedules table: " . mysqli_error($conn) . "\n";
}
?>
