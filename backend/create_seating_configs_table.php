<?php
require_once __DIR__ . "/config/database.php";

$sql = "CREATE TABLE IF NOT EXISTS `event_seating_configs` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `event_id` INT(11) NOT NULL,
  `organizer_id` INT(11) NOT NULL,
  `section_name` VARCHAR(100) NOT NULL,
  `total_rows` INT(11) DEFAULT 5,
  `seats_per_row` INT(11) DEFAULT 10,
  `ticket_price` DECIMAL(10,2) NOT NULL,
  `color_code` VARCHAR(30) DEFAULT '#8b5cf6',
  `perks_description` TEXT DEFAULT NULL,
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `event_id_idx` (`event_id`),
  KEY `organizer_id_idx` (`organizer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;";

if (mysqli_query($conn, $sql)) {
    echo "Table 'event_seating_configs' created or already exists.\n";
    
    // Seed initial seating section configs if empty
    $check = mysqli_query($conn, "SELECT COUNT(*) as cnt FROM event_seating_configs");
    $row = mysqli_fetch_assoc($check);
    if ($row['cnt'] == 0) {
        $seeds = [
            [16, 2, 'VIP Front Row Experience', 4, 8, 12000.00, '#8b5cf6', 'Front row seating + Free Welcome Drink + VIP Lanyard'],
            [16, 2, 'Gold Middle Floor', 6, 10, 7500.00, '#3b82f6', 'Prime center view + Express Entry Queue'],
            [16, 2, 'Silver Rear Gallery', 8, 12, 5000.00, '#10b981', 'Standard seating with clear stage view'],
            [17, 2, 'Executive Platinum Deck', 3, 6, 25000.00, '#ec4899', 'Exclusive booth + Complimentary Buffet Access']
        ];

        foreach ($seeds as $s) {
            $ev_id = $s[0];
            $org_id = $s[1];
            $name = mysqli_real_escape_string($conn, $s[2]);
            $trows = $s[3];
            $sprow = $s[4];
            $price = $s[5];
            $color = mysqli_real_escape_string($conn, $s[6]);
            $perks = mysqli_real_escape_string($conn, $s[7]);

            $conn->query("INSERT INTO event_seating_configs (event_id, organizer_id, section_name, total_rows, seats_per_row, ticket_price, color_code, perks_description) VALUES ($ev_id, $org_id, '$name', $trows, $sprow, $price, '$color', '$perks')");
        }
        echo "Seeded initial event seating tier configurations.\n";
    }
} else {
    echo "Error creating event_seating_configs table: " . mysqli_error($conn) . "\n";
}
?>
