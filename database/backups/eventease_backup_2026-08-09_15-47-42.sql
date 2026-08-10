-- EventEase Database Backup Snapshot
-- Generated: 2026-08-09 15:47:42
-- Database: eventease

SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS `bookings`;
CREATE TABLE `bookings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `ticket_quantity` int(11) NOT NULL DEFAULT 1,
  `total_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `payment_status` enum('Pending','Paid','Refunded') DEFAULT 'Pending',
  `booking_status` enum('Pending','Confirmed','Cancelled') DEFAULT 'Pending',
  `qr_code` varchar(255) DEFAULT NULL,
  `booking_date` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=160 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('32', '5', '6', '1', '0.00', 'Pending', 'Pending', NULL, '2026-07-03 23:58:42');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('33', '5', '6', '1', '0.00', 'Pending', 'Pending', NULL, '2026-07-03 23:58:42');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('84', '5', '9', '1', '4000.00', 'Pending', 'Pending', NULL, '2026-07-12 13:18:46');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('85', '7', '7', '1', '8000.00', 'Pending', 'Pending', NULL, '2026-07-12 13:37:42');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('96', '7', '7', '1', '8000.00', 'Pending', 'Pending', NULL, '2026-07-12 22:50:24');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('109', '9', '14', '1', '4000.00', 'Pending', 'Pending', NULL, '2026-07-13 02:08:32');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('110', '9', '14', '1', '4000.00', 'Pending', 'Pending', NULL, '2026-07-13 02:10:54');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('111', '9', '14', '1', '4000.00', 'Pending', 'Pending', NULL, '2026-07-13 02:15:23');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('112', '9', '14', '1', '4000.00', 'Pending', 'Pending', NULL, '2026-07-13 02:19:34');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('113', '9', '14', '1', '4000.00', 'Paid', 'Confirmed', NULL, '2026-07-13 02:23:55');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('114', '9', '14', '1', '4000.00', 'Paid', 'Confirmed', NULL, '2026-07-13 02:26:44');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('115', '9', '6', '1', '6000.00', 'Paid', 'Confirmed', NULL, '2026-07-13 02:38:26');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('116', '9', '7', '1', '8000.00', 'Paid', 'Confirmed', NULL, '2026-07-13 02:46:04');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('117', '9', '15', '1', '1000.00', 'Paid', 'Confirmed', NULL, '2026-07-13 03:31:34');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('118', '9', '7', '1', '8000.00', '', 'Cancelled', NULL, '2026-07-13 05:34:15');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('119', '9', '14', '1', '4000.00', 'Paid', 'Confirmed', NULL, '2026-07-13 05:46:58');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('120', '9', '16', '1', '5000.00', 'Paid', 'Confirmed', NULL, '2026-07-13 05:52:02');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('121', '9', '17', '1', '5000.00', 'Paid', 'Confirmed', NULL, '2026-07-13 08:39:40');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('122', '9', '17', '1', '5000.00', 'Pending', 'Pending', NULL, '2026-07-13 10:45:48');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('123', '9', '17', '1', '5000.00', 'Pending', 'Pending', NULL, '2026-07-13 10:45:50');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('124', '9', '17', '1', '5000.00', 'Pending', 'Pending', NULL, '2026-07-13 10:45:54');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('125', '9', '17', '1', '5000.00', 'Pending', 'Pending', NULL, '2026-07-13 10:45:54');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('126', '9', '17', '1', '5000.00', 'Pending', 'Pending', NULL, '2026-07-13 10:45:54');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('127', '9', '17', '1', '5000.00', 'Pending', 'Pending', NULL, '2026-07-13 10:45:54');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('128', '9', '17', '1', '5000.00', 'Pending', 'Pending', NULL, '2026-07-13 10:45:55');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('129', '9', '17', '1', '5000.00', 'Pending', 'Pending', NULL, '2026-07-13 10:45:58');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('130', '9', '17', '1', '5000.00', 'Pending', 'Pending', NULL, '2026-07-13 10:45:58');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('131', '9', '17', '1', '5000.00', 'Pending', 'Pending', NULL, '2026-07-13 10:45:59');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('132', '9', '17', '1', '5000.00', 'Pending', 'Pending', NULL, '2026-07-13 10:45:59');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('133', '9', '17', '1', '5000.00', 'Pending', 'Pending', NULL, '2026-07-13 10:45:59');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('134', '9', '17', '1', '5000.00', 'Pending', 'Pending', NULL, '2026-07-13 10:45:59');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('135', '9', '17', '1', '5000.00', 'Pending', 'Pending', NULL, '2026-07-13 10:46:00');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('136', '9', '17', '1', '5000.00', 'Pending', 'Pending', NULL, '2026-07-13 10:46:00');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('137', '9', '17', '1', '5000.00', 'Pending', 'Pending', NULL, '2026-07-13 10:46:01');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('138', '9', '17', '1', '5000.00', 'Pending', 'Pending', NULL, '2026-07-13 10:46:01');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('139', '9', '17', '1', '5000.00', 'Pending', 'Pending', NULL, '2026-07-13 10:46:02');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('140', '9', '17', '1', '5000.00', 'Pending', 'Pending', NULL, '2026-07-13 10:46:02');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('141', '9', '17', '1', '5000.00', 'Pending', 'Pending', NULL, '2026-07-13 10:46:03');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('142', '9', '17', '1', '5000.00', 'Pending', 'Pending', NULL, '2026-07-13 10:46:03');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('143', '9', '17', '1', '5000.00', 'Pending', 'Pending', NULL, '2026-07-13 10:46:03');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('144', '9', '17', '1', '5000.00', 'Pending', 'Pending', NULL, '2026-07-13 10:46:09');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('145', '9', '17', '1', '5000.00', 'Pending', 'Pending', NULL, '2026-07-13 10:46:09');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('146', '9', '17', '1', '5000.00', 'Pending', 'Pending', NULL, '2026-07-13 10:46:09');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('147', '9', '17', '1', '5000.00', 'Pending', 'Pending', NULL, '2026-07-13 10:46:10');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('148', '9', '17', '1', '5000.00', 'Pending', 'Pending', NULL, '2026-07-13 10:46:15');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('149', '9', '17', '1', '5000.00', 'Pending', 'Pending', NULL, '2026-07-13 10:46:15');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('150', '9', '17', '1', '5000.00', 'Pending', 'Pending', NULL, '2026-07-13 10:46:22');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('151', '9', '17', '1', '5000.00', 'Paid', 'Confirmed', NULL, '2026-07-13 10:48:40');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('152', '9', '19', '1', '6000.00', 'Paid', 'Confirmed', NULL, '2026-07-13 11:33:18');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('153', '9', '19', '1', '6000.00', 'Pending', 'Pending', NULL, '2026-07-13 11:36:31');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('154', '9', '20', '1', '500.00', 'Paid', 'Confirmed', NULL, '2026-07-13 11:46:36');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('155', '9', '21', '1', '300.00', '', 'Cancelled', NULL, '2026-07-13 12:06:01');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('156', '9', '22', '1', '1000.00', 'Paid', 'Confirmed', NULL, '2026-07-13 12:17:17');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('157', '9', '23', '1', '5000.00', 'Paid', 'Confirmed', NULL, '2026-07-13 13:19:18');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('158', '9', '17', '1', '5000.00', 'Pending', 'Pending', NULL, '2026-07-30 15:20:18');
INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES ('159', '9', '16', '1', '7500.00', 'Paid', 'Confirmed', NULL, '2026-07-30 22:35:20');

DROP TABLE IF EXISTS `complaints`;
CREATE TABLE `complaints` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `category` enum('booking_issue','payment_dispute','event_cancellation','organizer_conduct','technical_issue','other') NOT NULL DEFAULT 'booking_issue',
  `description` text NOT NULL,
  `status` enum('open','in_progress','resolved','dismissed') NOT NULL DEFAULT 'open',
  `priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
  `admin_response` text DEFAULT NULL,
  `resolved_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `complaints` (`id`, `user_id`, `event_id`, `subject`, `category`, `description`, `status`, `priority`, `admin_response`, `resolved_by`, `created_at`, `updated_at`) VALUES ('1', '9', NULL, 'Ticket Refund Inquiry 1786283046467', 'booking_issue', 'Payment was processed successfully but seat status requires manual sync.', 'resolved', 'high', 'Support Team verified transaction and synced ticket status.', '7', '2026-08-09 19:14:08', '2026-08-09 19:14:08');
INSERT INTO `complaints` (`id`, `user_id`, `event_id`, `subject`, `category`, `description`, `status`, `priority`, `admin_response`, `resolved_by`, `created_at`, `updated_at`) VALUES ('2', '9', NULL, 'Ticket Refund Inquiry 1786283255681', 'booking_issue', 'Payment was processed successfully but seat status requires manual sync.', 'resolved', 'high', 'Support Team verified transaction and synced ticket status.', '7', '2026-08-09 19:17:39', '2026-08-09 19:17:40');

DROP TABLE IF EXISTS `database_backups`;
CREATE TABLE `database_backups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_size` int(11) NOT NULL DEFAULT 0,
  `tables_count` int(11) NOT NULL DEFAULT 0,
  `created_by` int(11) NOT NULL,
  `status` enum('completed','failed','restored') NOT NULL DEFAULT 'completed',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `database_backups` (`id`, `file_name`, `file_path`, `file_size`, `tables_count`, `created_by`, `status`, `created_at`) VALUES ('1', 'eventease_backup_2026-08-09_15-44-24.sql', 'database/backups/eventease_backup_2026-08-09_15-44-24.sql', '49151', '14', '7', 'completed', '2026-08-09 19:14:24');

DROP TABLE IF EXISTS `event_announcements`;
CREATE TABLE `event_announcements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NOT NULL,
  `organizer_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `priority` enum('normal','urgent','emergency') NOT NULL DEFAULT 'normal',
  `broadcast_type` enum('all_attendees','vip_only','waiting_list') NOT NULL DEFAULT 'all_attendees',
  `sent_count` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `event_id_idx` (`event_id`),
  KEY `organizer_id_idx` (`organizer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `event_announcements` (`id`, `event_id`, `organizer_id`, `title`, `message`, `priority`, `broadcast_type`, `sent_count`, `created_at`) VALUES ('1', '16', '2', 'Gate Opening Time & Parking Advisory', 'Gates will open at 5:30 PM sharp. Parking is available at Gate 2 and Gate 4. Please present your digital QR ticket for fast entry.', 'normal', 'all_attendees', '198', '2026-08-09 19:16:46');
INSERT INTO `event_announcements` (`id`, `event_id`, `organizer_id`, `title`, `message`, `priority`, `broadcast_type`, `sent_count`, `created_at`) VALUES ('2', '16', '2', 'URGENT: Hall Stage Floor Adjustment', 'Due to high turnout, the main stage floor seating has been upgraded to climate-controlled indoor hall A.', 'urgent', 'all_attendees', '198', '2026-08-09 19:16:46');
INSERT INTO `event_announcements` (`id`, `event_id`, `organizer_id`, `title`, `message`, `priority`, `broadcast_type`, `sent_count`, `created_at`) VALUES ('3', '17', '2', 'VIP Meet & Greet Session Notice', 'All VIP Platinum pass holders are invited to the pre-event reception at 4:00 PM in Lounge 1.', 'normal', 'vip_only', '45', '2026-08-09 19:16:46');

DROP TABLE IF EXISTS `event_booked_seats`;
CREATE TABLE `event_booked_seats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NOT NULL,
  `booking_id` int(11) DEFAULT NULL,
  `seat_code` varchar(50) NOT NULL,
  `tier_name` varchar(50) NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `user_id` int(11) NOT NULL,
  `booked_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `event_seat_unique` (`event_id`,`seat_code`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `event_booked_seats` (`id`, `event_id`, `booking_id`, `seat_code`, `tier_name`, `price`, `user_id`, `booked_at`) VALUES ('1', '16', '159', 'C10', 'Platinum Tier', '7500.00', '9', '2026-07-30 22:35:20');

DROP TABLE IF EXISTS `event_schedules`;
CREATE TABLE `event_schedules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NOT NULL,
  `session_title` varchar(255) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `hall_stage` varchar(150) DEFAULT NULL,
  `speaker_performer` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` enum('scheduled','live','completed','cancelled') NOT NULL DEFAULT 'scheduled',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `event_schedules` (`id`, `event_id`, `session_title`, `start_time`, `end_time`, `hall_stage`, `speaker_performer`, `description`, `status`, `created_at`) VALUES ('1', '16', 'Playwright Keynote Session 983', '2026-12-25 09:00:00', '2026-12-25 11:00:00', 'Grand Ballroom Alpha', 'Prof. Samantha Perera', '', 'scheduled', '2026-08-09 19:14:27');

DROP TABLE IF EXISTS `event_seating_configs`;
CREATE TABLE `event_seating_configs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NOT NULL,
  `organizer_id` int(11) NOT NULL,
  `section_name` varchar(100) NOT NULL,
  `total_rows` int(11) DEFAULT 5,
  `seats_per_row` int(11) DEFAULT 10,
  `ticket_price` decimal(10,2) NOT NULL,
  `color_code` varchar(30) DEFAULT '#8b5cf6',
  `perks_description` text DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `event_id_idx` (`event_id`),
  KEY `organizer_id_idx` (`organizer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `event_seating_configs` (`id`, `event_id`, `organizer_id`, `section_name`, `total_rows`, `seats_per_row`, `ticket_price`, `color_code`, `perks_description`, `status`, `created_at`) VALUES ('1', '16', '2', 'VIP Front Row Experience', '4', '8', '12000.00', '#8b5cf6', 'Front row seating + Free Welcome Drink + VIP Lanyard', 'active', '2026-08-09 19:16:46');
INSERT INTO `event_seating_configs` (`id`, `event_id`, `organizer_id`, `section_name`, `total_rows`, `seats_per_row`, `ticket_price`, `color_code`, `perks_description`, `status`, `created_at`) VALUES ('2', '16', '2', 'Gold Middle Floor', '6', '10', '7500.00', '#3b82f6', 'Prime center view + Express Entry Queue', 'active', '2026-08-09 19:16:46');
INSERT INTO `event_seating_configs` (`id`, `event_id`, `organizer_id`, `section_name`, `total_rows`, `seats_per_row`, `ticket_price`, `color_code`, `perks_description`, `status`, `created_at`) VALUES ('3', '16', '2', 'Silver Rear Gallery', '8', '12', '5000.00', '#10b981', 'Standard seating with clear stage view', 'active', '2026-08-09 19:16:46');
INSERT INTO `event_seating_configs` (`id`, `event_id`, `organizer_id`, `section_name`, `total_rows`, `seats_per_row`, `ticket_price`, `color_code`, `perks_description`, `status`, `created_at`) VALUES ('4', '17', '2', 'Executive Platinum Deck', '3', '6', '25000.00', '#ec4899', 'Exclusive booth + Complimentary Buffet Access', 'active', '2026-08-09 19:16:46');

DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `organizer_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `event_date` date NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `image` varchar(255) DEFAULT NULL,
  `category` varchar(100) DEFAULT 'General',
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`id`),
  KEY `organizer_id` (`organizer_id`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `events` (`id`, `organizer_id`, `title`, `description`, `event_date`, `location`, `capacity`, `created_at`, `price`, `image`, `category`, `status`) VALUES ('1', '2', 'Tech Conference 2026 - Updated', 'Updated event details', '2026-12-25', 'Kandy', '600', '2026-06-12 15:11:41', '2500.00', NULL, 'General', 'pending');
INSERT INTO `events` (`id`, `organizer_id`, `title`, `description`, `event_date`, `location`, `capacity`, `created_at`, `price`, `image`, `category`, `status`) VALUES ('4', '2', 'football fiesta', 'pattama football parak gahamu', '2026-02-03', 'Negombo', NULL, '2026-07-01 21:09:23', '0.00', NULL, 'General', 'rejected');
INSERT INTO `events` (`id`, `organizer_id`, `title`, `description`, `event_date`, `location`, `capacity`, `created_at`, `price`, `image`, `category`, `status`) VALUES ('6', '2', 'Aluth kalawak', 'Held on portcity colombo ', '2026-02-08', 'Colombo', '1000', '2026-07-03 11:30:21', '6000.00', '1783058421_images.jpg', 'Music', 'approved');
INSERT INTO `events` (`id`, `organizer_id`, `title`, `description`, `event_date`, `location`, `capacity`, `created_at`, `price`, `image`, `category`, `status`) VALUES ('7', '2', 'Likitha Event', 'Ape likithaya', '2026-04-03', 'Gampaha', '60', '2026-07-04 00:01:49', '8000.00', '1783103509_Green and Yellow Gardening YouTube Banner.png', 'Music', 'approved');
INSERT INTO `events` (`id`, `organizer_id`, `title`, `description`, `event_date`, `location`, `capacity`, `created_at`, `price`, `image`, `category`, `status`) VALUES ('9', '2', 'Chess ', 'sport', '2026-07-21', 'Campus', '2998', '2026-07-12 12:16:38', '4000.00', '', 'General', 'rejected');
INSERT INTO `events` (`id`, `organizer_id`, `title`, `description`, `event_date`, `location`, `capacity`, `created_at`, `price`, `image`, `category`, `status`) VALUES ('14', '2', 'HER', 'Music Event', '2026-07-15', 'Colombo', '300', '2026-07-13 00:21:33', '4000.00', '1783882293_Screenshot 2026-07-12 221402.png', 'Music', 'approved');
INSERT INTO `events` (`id`, `organizer_id`, `title`, `description`, `event_date`, `location`, `capacity`, `created_at`, `price`, `image`, `category`, `status`) VALUES ('15', '2', 'Praharshana', 'Drama Event', '2026-07-18', 'UWU', '299', '2026-07-13 03:29:11', '1000.00', '1783893551_download.jpg', 'Entertainment', 'approved');
INSERT INTO `events` (`id`, `organizer_id`, `title`, `description`, `event_date`, `location`, `capacity`, `created_at`, `price`, `image`, `category`, `status`) VALUES ('16', '2', 'Mariens Live in concert', 'Come Have Fun with the mariens ', '2026-07-25', 'Negombo', '200', '2026-07-13 05:49:49', '5000.00', '1783901989_MARIANS_Unplugged_Live_in_Dubai_2015_may_15_Sheikh_Rashid_Auditorium_The_Indian_High_School_25147-full.jpg', 'Music', 'approved');
INSERT INTO `events` (`id`, `organizer_id`, `title`, `description`, `event_date`, `location`, `capacity`, `created_at`, `price`, `image`, `category`, `status`) VALUES ('17', '2', 'Gypsis Live in Concert', 'Come Have fun with us', '2026-07-31', 'Kalutara', '100', '2026-07-13 08:37:46', '5000.00', '1783912066_LIVE_IM_PARK_Gypsys.jpg', 'Music', 'approved');
INSERT INTO `events` (`id`, `organizer_id`, `title`, `description`, `event_date`, `location`, `capacity`, `created_at`, `price`, `image`, `category`, `status`) VALUES ('18', '2', 'cricket event', 'cricket event for all', '2026-07-15', 'Kandy', '300', '2026-07-13 10:59:53', '500.00', '', 'Sports', 'pending');
INSERT INTO `events` (`id`, `organizer_id`, `title`, `description`, `event_date`, `location`, `capacity`, `created_at`, `price`, `image`, `category`, `status`) VALUES ('19', '2', 'Dancing night', 'all can dance', '2026-07-18', 'Gampaha', '100', '2026-07-13 11:28:14', '6000.00', '1783922294_MARIANS_Unplugged_Live_in_Dubai_2015_may_15_Sheikh_Rashid_Auditorium_The_Indian_High_School_25147-full.jpg', 'Music', 'approved');
INSERT INTO `events` (`id`, `organizer_id`, `title`, `description`, `event_date`, `location`, `capacity`, `created_at`, `price`, `image`, `category`, `status`) VALUES ('20', '2', 'chess event', 'you all can play chess', '2026-07-16', 'Kandy', '100', '2026-07-13 11:42:49', '500.00', '1783923169_LIVE_IM_PARK_Gypsys.jpg', 'Sports', 'approved');
INSERT INTO `events` (`id`, `organizer_id`, `title`, `description`, `event_date`, `location`, `capacity`, `created_at`, `price`, `image`, `category`, `status`) VALUES ('21', '2', 'chagudu ewent', 'have sun fun', '2026-07-25', 'Kandy', '1000', '2026-07-13 12:01:52', '300.00', '', 'Sports', 'approved');
INSERT INTO `events` (`id`, `organizer_id`, `title`, `description`, `event_date`, `location`, `capacity`, `created_at`, `price`, `image`, `category`, `status`) VALUES ('22', '2', 'F1 race', 'cars race', '2026-07-25', 'Kandy', '500', '2026-07-13 12:13:33', '1000.00', '', 'Sports', 'approved');
INSERT INTO `events` (`id`, `organizer_id`, `title`, `description`, `event_date`, `location`, `capacity`, `created_at`, `price`, `image`, `category`, `status`) VALUES ('23', '2', 'Sarith surith event', 'Music event vfor all', '2026-07-24', 'Kandy', '100', '2026-07-13 13:15:10', '5000.00', '1783928710_maxresdefault.jpg', 'Music', 'approved');

DROP TABLE IF EXISTS `favorites`;
CREATE TABLE `favorites` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_event` (`user_id`,`event_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `type` varchar(50) NOT NULL DEFAULT 'info',
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `link` varchar(255) DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id_idx` (`user_id`),
  KEY `is_read_idx` (`is_read`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `message`, `link`, `is_read`, `created_at`) VALUES ('1', '7', 'booking', '🎟️ Ticket Booking Confirmed!', 'Your ticket reservation for \'Summer Music Festival 2026\' has been confirmed. Seat: VIP-A1.', '/my-bookings', '0', '2026-07-30 23:00:54');
INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `message`, `link`, `is_read`, `created_at`) VALUES ('2', '7', 'waiting_list', '🎉 Waiting List Priority Alert!', 'A ticket slot opened up for \'Tech Innovators Summit\'. Click to claim your priority ticket.', '/waiting-list', '0', '2026-07-30 23:00:54');
INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `message`, `link`, `is_read`, `created_at`) VALUES ('3', '7', 'verification', '🛡️ Organizer Account Status Update', 'Your organizer business registration document has been reviewed and verified.', '/organizer/verify', '0', '2026-07-30 23:00:54');
INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `message`, `link`, `is_read`, `created_at`) VALUES ('4', '9', 'booking', '🎟️ Ticket Booking Confirmed!', 'Your ticket reservation for \'Summer Music Festival 2026\' has been confirmed. Seat: VIP-A1.', '/my-bookings', '0', '2026-08-09 13:36:54');
INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `message`, `link`, `is_read`, `created_at`) VALUES ('5', '9', 'waiting_list', '🎉 Waiting List Priority Alert!', 'A ticket slot opened up for \'Tech Innovators Summit\'. Click to claim your priority ticket.', '/waiting-list', '0', '2026-08-09 13:36:54');
INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `message`, `link`, `is_read`, `created_at`) VALUES ('6', '9', 'verification', '🛡️ Organizer Account Status Update', 'Your organizer business registration document has been reviewed and verified.', '/organizer/verify', '0', '2026-08-09 13:36:54');
INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `message`, `link`, `is_read`, `created_at`) VALUES ('7', '9', 'support', '🎧 Support Ticket Update: resolved', 'Your support ticket \'Ticket Refund Inquiry 1786283046467\' has been updated to: RESOLVED. Admin note: Support Team verified transaction and synced ticket status.', '/customer/support', '0', '2026-08-09 19:14:08');
INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `message`, `link`, `is_read`, `created_at`) VALUES ('8', '9', 'support', '🎧 Support Ticket Update: resolved', 'Your support ticket \'Ticket Refund Inquiry 1786283255681\' has been updated to: RESOLVED. Admin note: Support Team verified transaction and synced ticket status.', '/customer/support', '0', '2026-08-09 19:17:40');

DROP TABLE IF EXISTS `organizer_payouts`;
CREATE TABLE `organizer_payouts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `organizer_id` int(11) NOT NULL,
  `event_id` int(11) DEFAULT NULL,
  `gross_revenue` decimal(10,2) NOT NULL,
  `commission_rate` decimal(5,2) DEFAULT 10.00,
  `commission_fee` decimal(10,2) NOT NULL,
  `net_payout` decimal(10,2) NOT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `account_number` varchar(50) DEFAULT NULL,
  `status` enum('pending','approved','rejected','transferred') NOT NULL DEFAULT 'pending',
  `admin_notes` text DEFAULT NULL,
  `processed_by` int(11) DEFAULT NULL,
  `requested_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `processed_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `organizer_payouts` (`id`, `organizer_id`, `event_id`, `gross_revenue`, `commission_rate`, `commission_fee`, `net_payout`, `bank_name`, `account_number`, `status`, `admin_notes`, `processed_by`, `requested_at`, `processed_at`) VALUES ('1', '2', '16', '250000.00', '10.00', '25000.00', '225000.00', 'Bank of Ceylon', '8849201948', 'pending', NULL, NULL, '2026-08-09 19:16:46', NULL);
INSERT INTO `organizer_payouts` (`id`, `organizer_id`, `event_id`, `gross_revenue`, `commission_rate`, `commission_fee`, `net_payout`, `bank_name`, `account_number`, `status`, `admin_notes`, `processed_by`, `requested_at`, `processed_at`) VALUES ('2', '2', '17', '180000.00', '10.00', '18000.00', '162000.00', 'Commercial Bank', '1092837482', 'pending', NULL, NULL, '2026-08-09 19:16:46', NULL);
INSERT INTO `organizer_payouts` (`id`, `organizer_id`, `event_id`, `gross_revenue`, `commission_rate`, `commission_fee`, `net_payout`, `bank_name`, `account_number`, `status`, `admin_notes`, `processed_by`, `requested_at`, `processed_at`) VALUES ('3', '2', '6', '450000.00', '10.00', '45000.00', '405000.00', 'Hatton National Bank', '7728192847', 'transferred', 'Transfer processed via Sampath Pay.', NULL, '2026-08-09 19:16:46', NULL);

DROP TABLE IF EXISTS `organizers`;
CREATE TABLE `organizers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `organization_name` varchar(150) NOT NULL,
  `verification_status` enum('pending','approved','rejected') DEFAULT 'pending',
  `phone` varchar(50) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `business_registration_number` varchar(100) DEFAULT NULL,
  `nic_passport` varchar(100) DEFAULT NULL,
  `document_path` varchar(255) DEFAULT NULL,
  `rejection_reason` text DEFAULT NULL,
  `submitted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `organizers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `organizers` (`id`, `user_id`, `organization_name`, `verification_status`, `phone`, `website`, `address`, `business_registration_number`, `nic_passport`, `document_path`, `rejection_reason`, `submitted_at`) VALUES ('2', '5', 'Yumeth Events', 'approved', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

DROP TABLE IF EXISTS `payments`;
CREATE TABLE `payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `booking_id` int(11) NOT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `payment_status` enum('pending','success','failed') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `booking_id` (`booking_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=122 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('46', '84', '4000.00', NULL, 'pending', '2026-07-12 13:18:46');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('47', '85', '8000.00', NULL, 'pending', '2026-07-12 13:37:42');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('58', '96', '8000.00', NULL, 'pending', '2026-07-12 22:50:24');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('71', '109', '4000.00', NULL, 'pending', '2026-07-13 02:08:32');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('72', '110', '4000.00', NULL, 'pending', '2026-07-13 02:10:54');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('73', '111', '4000.00', NULL, 'pending', '2026-07-13 02:15:23');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('74', '112', '4000.00', NULL, 'pending', '2026-07-13 02:19:34');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('75', '113', '4000.00', NULL, 'pending', '2026-07-13 02:23:55');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('76', '114', '4000.00', NULL, 'pending', '2026-07-13 02:26:44');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('77', '115', '6000.00', NULL, 'pending', '2026-07-13 02:38:26');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('78', '116', '8000.00', NULL, 'pending', '2026-07-13 02:46:04');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('79', '117', '1000.00', NULL, 'pending', '2026-07-13 03:31:34');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('80', '118', '8000.00', NULL, 'pending', '2026-07-13 05:34:15');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('81', '119', '4000.00', NULL, 'pending', '2026-07-13 05:46:58');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('82', '120', '5000.00', NULL, 'pending', '2026-07-13 05:52:02');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('83', '121', '5000.00', NULL, 'pending', '2026-07-13 08:39:40');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('84', '122', '5000.00', NULL, 'pending', '2026-07-13 10:45:48');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('85', '123', '5000.00', NULL, 'pending', '2026-07-13 10:45:50');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('86', '124', '5000.00', NULL, 'pending', '2026-07-13 10:45:54');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('87', '125', '5000.00', NULL, 'pending', '2026-07-13 10:45:54');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('88', '126', '5000.00', NULL, 'pending', '2026-07-13 10:45:54');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('89', '127', '5000.00', NULL, 'pending', '2026-07-13 10:45:54');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('90', '128', '5000.00', NULL, 'pending', '2026-07-13 10:45:55');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('91', '129', '5000.00', NULL, 'pending', '2026-07-13 10:45:58');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('92', '130', '5000.00', NULL, 'pending', '2026-07-13 10:45:58');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('93', '131', '5000.00', NULL, 'pending', '2026-07-13 10:45:59');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('94', '132', '5000.00', NULL, 'pending', '2026-07-13 10:45:59');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('95', '133', '5000.00', NULL, 'pending', '2026-07-13 10:45:59');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('96', '134', '5000.00', NULL, 'pending', '2026-07-13 10:45:59');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('97', '135', '5000.00', NULL, 'pending', '2026-07-13 10:46:00');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('98', '136', '5000.00', NULL, 'pending', '2026-07-13 10:46:00');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('99', '137', '5000.00', NULL, 'pending', '2026-07-13 10:46:01');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('100', '138', '5000.00', NULL, 'pending', '2026-07-13 10:46:01');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('101', '139', '5000.00', NULL, 'pending', '2026-07-13 10:46:02');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('102', '140', '5000.00', NULL, 'pending', '2026-07-13 10:46:02');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('103', '141', '5000.00', NULL, 'pending', '2026-07-13 10:46:03');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('104', '142', '5000.00', NULL, 'pending', '2026-07-13 10:46:03');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('105', '143', '5000.00', NULL, 'pending', '2026-07-13 10:46:03');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('106', '144', '5000.00', NULL, 'pending', '2026-07-13 10:46:09');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('107', '145', '5000.00', NULL, 'pending', '2026-07-13 10:46:09');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('108', '146', '5000.00', NULL, 'pending', '2026-07-13 10:46:09');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('109', '147', '5000.00', NULL, 'pending', '2026-07-13 10:46:10');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('110', '148', '5000.00', NULL, 'pending', '2026-07-13 10:46:15');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('111', '149', '5000.00', NULL, 'pending', '2026-07-13 10:46:15');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('112', '150', '5000.00', NULL, 'pending', '2026-07-13 10:46:22');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('113', '151', '5000.00', NULL, 'pending', '2026-07-13 10:48:40');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('114', '152', '6000.00', NULL, 'pending', '2026-07-13 11:33:18');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('115', '153', '6000.00', NULL, 'pending', '2026-07-13 11:36:31');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('116', '154', '500.00', NULL, 'pending', '2026-07-13 11:46:36');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('117', '155', '300.00', NULL, 'pending', '2026-07-13 12:06:01');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('118', '156', '1000.00', NULL, 'pending', '2026-07-13 12:17:17');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('119', '157', '5000.00', NULL, 'pending', '2026-07-13 13:19:18');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('120', '158', '5000.00', NULL, 'pending', '2026-07-30 15:20:18');
INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES ('121', '159', '7500.00', NULL, '', '2026-07-30 22:35:20');

DROP TABLE IF EXISTS `promo_codes`;
CREATE TABLE `promo_codes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) DEFAULT NULL,
  `organizer_id` int(11) DEFAULT NULL,
  `code` varchar(50) NOT NULL,
  `discount_type` enum('percentage','fixed') NOT NULL DEFAULT 'percentage',
  `discount_value` decimal(10,2) NOT NULL,
  `min_order_amount` decimal(10,2) DEFAULT 0.00,
  `max_uses` int(11) DEFAULT 100,
  `used_count` int(11) DEFAULT 0,
  `valid_from` datetime DEFAULT NULL,
  `valid_until` datetime DEFAULT NULL,
  `status` enum('active','inactive','expired') NOT NULL DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code_unique` (`code`),
  KEY `event_id_idx` (`event_id`),
  KEY `organizer_id_idx` (`organizer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `promo_codes` (`id`, `event_id`, `organizer_id`, `code`, `discount_type`, `discount_value`, `min_order_amount`, `max_uses`, `used_count`, `valid_from`, `valid_until`, `status`, `created_at`) VALUES ('1', NULL, NULL, 'EVENT20', 'percentage', '20.00', '500.00', '100', '14', '2026-01-01 00:00:00', '2026-12-31 23:59:59', 'active', '2026-08-09 19:16:46');
INSERT INTO `promo_codes` (`id`, `event_id`, `organizer_id`, `code`, `discount_type`, `discount_value`, `min_order_amount`, `max_uses`, `used_count`, `valid_from`, `valid_until`, `status`, `created_at`) VALUES ('2', '6', '2', 'COLOMBO500', 'fixed', '500.00', '1000.00', '50', '8', '2026-01-01 00:00:00', '2026-12-31 23:59:59', 'active', '2026-08-09 19:16:46');
INSERT INTO `promo_codes` (`id`, `event_id`, `organizer_id`, `code`, `discount_type`, `discount_value`, `min_order_amount`, `max_uses`, `used_count`, `valid_from`, `valid_until`, `status`, `created_at`) VALUES ('3', NULL, NULL, 'VIPPERK10', 'percentage', '10.00', '0.00', '500', '42', '2026-01-01 00:00:00', '2026-12-31 23:59:59', 'active', '2026-08-09 19:16:46');

DROP TABLE IF EXISTS `seats`;
CREATE TABLE `seats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NOT NULL,
  `seat_number` varchar(20) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `status` enum('available','reserved','booked') DEFAULT 'available',
  PRIMARY KEY (`id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `seats_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `seats` (`id`, `event_id`, `seat_number`, `price`, `status`) VALUES ('1', '1', 'A1', '1000.00', 'available');
INSERT INTO `seats` (`id`, `event_id`, `seat_number`, `price`, `status`) VALUES ('2', '1', 'A2', '1000.00', 'available');
INSERT INTO `seats` (`id`, `event_id`, `seat_number`, `price`, `status`) VALUES ('3', '1', 'A3', '1000.00', 'available');
INSERT INTO `seats` (`id`, `event_id`, `seat_number`, `price`, `status`) VALUES ('4', '1', 'B1', '1500.00', 'available');
INSERT INTO `seats` (`id`, `event_id`, `seat_number`, `price`, `status`) VALUES ('5', '1', 'B2', '1500.00', 'available');

DROP TABLE IF EXISTS `security_logs`;
CREATE TABLE `security_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `event_type` enum('failed_login','unauthorized_access','suspicious_transaction','privilege_change','user_blocked','ticket_scan_anomaly','system_setting_update') NOT NULL DEFAULT 'failed_login',
  `ip_address` varchar(45) NOT NULL DEFAULT '127.0.0.1',
  `user_agent` text DEFAULT NULL,
  `risk_score` enum('low','medium','high','critical') NOT NULL DEFAULT 'low',
  `details` text NOT NULL,
  `is_flagged` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `security_logs` (`id`, `user_id`, `event_type`, `ip_address`, `user_agent`, `risk_score`, `details`, `is_flagged`, `created_at`) VALUES ('1', '7', 'system_setting_update', '127.0.0.1', NULL, 'medium', 'Super Admin updated system governance and security policies.', '1', '2026-08-09 19:14:25');

DROP TABLE IF EXISTS `system_settings`;
CREATE TABLE `system_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `system_settings` (`id`, `setting_key`, `setting_value`, `updated_at`) VALUES ('1', 'maintenance_mode', 'false', '2026-08-09 19:14:25');
INSERT INTO `system_settings` (`id`, `setting_key`, `setting_value`, `updated_at`) VALUES ('2', 'max_login_attempts', '3', '2026-08-09 19:14:25');
INSERT INTO `system_settings` (`id`, `setting_key`, `setting_value`, `updated_at`) VALUES ('3', 'session_timeout_mins', '30', '2026-08-09 19:14:25');
INSERT INTO `system_settings` (`id`, `setting_key`, `setting_value`, `updated_at`) VALUES ('4', 'enforce_tls', 'true', '2026-08-09 19:14:25');
INSERT INTO `system_settings` (`id`, `setting_key`, `setting_value`, `updated_at`) VALUES ('5', 'auto_backup_frequency', 'daily', '2026-08-09 19:14:25');
INSERT INTO `system_settings` (`id`, `setting_key`, `setting_value`, `updated_at`) VALUES ('6', 'system_version', 'v2.4.0', '2026-08-09 19:14:25');

DROP TABLE IF EXISTS `tickets`;
CREATE TABLE `tickets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `booking_id` int(11) NOT NULL,
  `ticket_code` varchar(100) DEFAULT NULL,
  `qr_code` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('unused','used') NOT NULL DEFAULT 'unused',
  `seat_number` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ticket_code` (`ticket_code`),
  KEY `booking_id` (`booking_id`),
  CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `tickets` (`id`, `booking_id`, `ticket_code`, `qr_code`, `created_at`, `status`, `seat_number`) VALUES ('26', '33', 'TKT00033', 'uploads/qr/TKT00033.png', '2026-07-03 23:58:44', 'unused', NULL);
INSERT INTO `tickets` (`id`, `booking_id`, `ticket_code`, `qr_code`, `created_at`, `status`, `seat_number`) VALUES ('40', '115', 'EVT-115-8065', NULL, '2026-07-13 02:45:44', 'unused', NULL);
INSERT INTO `tickets` (`id`, `booking_id`, `ticket_code`, `qr_code`, `created_at`, `status`, `seat_number`) VALUES ('41', '116', 'EVT-116-4217', NULL, '2026-07-13 02:46:11', 'unused', NULL);
INSERT INTO `tickets` (`id`, `booking_id`, `ticket_code`, `qr_code`, `created_at`, `status`, `seat_number`) VALUES ('42', '116', 'EVT-116-5496', NULL, '2026-07-13 02:46:11', 'unused', NULL);
INSERT INTO `tickets` (`id`, `booking_id`, `ticket_code`, `qr_code`, `created_at`, `status`, `seat_number`) VALUES ('43', '117', 'EVT-117-3580', NULL, '2026-07-13 03:31:49', 'unused', NULL);
INSERT INTO `tickets` (`id`, `booking_id`, `ticket_code`, `qr_code`, `created_at`, `status`, `seat_number`) VALUES ('44', '118', 'EVT-118-4924', 'uploads/qr/ticket_118.png', '2026-07-13 05:34:29', 'used', NULL);
INSERT INTO `tickets` (`id`, `booking_id`, `ticket_code`, `qr_code`, `created_at`, `status`, `seat_number`) VALUES ('45', '118', 'EVT-118-7188', 'uploads/qr/ticket_118.png', '2026-07-13 05:34:29', 'used', NULL);
INSERT INTO `tickets` (`id`, `booking_id`, `ticket_code`, `qr_code`, `created_at`, `status`, `seat_number`) VALUES ('46', '119', 'EVT-119-9453', 'uploads/qr/ticket_119.png', '2026-07-13 05:47:13', 'unused', NULL);
INSERT INTO `tickets` (`id`, `booking_id`, `ticket_code`, `qr_code`, `created_at`, `status`, `seat_number`) VALUES ('47', '119', 'EVT-119-6432', 'uploads/qr/ticket_119.png', '2026-07-13 05:47:13', 'unused', NULL);
INSERT INTO `tickets` (`id`, `booking_id`, `ticket_code`, `qr_code`, `created_at`, `status`, `seat_number`) VALUES ('48', '120', 'EVT-120-4215', 'uploads/qr/ticket_120.png', '2026-07-13 05:52:18', 'unused', NULL);
INSERT INTO `tickets` (`id`, `booking_id`, `ticket_code`, `qr_code`, `created_at`, `status`, `seat_number`) VALUES ('49', '120', 'EVT-120-8232', 'uploads/qr/ticket_120.png', '2026-07-13 05:52:18', 'unused', NULL);
INSERT INTO `tickets` (`id`, `booking_id`, `ticket_code`, `qr_code`, `created_at`, `status`, `seat_number`) VALUES ('50', '121', 'EVT-121-3022', 'uploads/qr/ticket_121.png', '2026-07-13 08:39:56', 'unused', NULL);
INSERT INTO `tickets` (`id`, `booking_id`, `ticket_code`, `qr_code`, `created_at`, `status`, `seat_number`) VALUES ('51', '121', 'EVT-121-3294', 'uploads/qr/ticket_121.png', '2026-07-13 08:39:56', 'unused', NULL);
INSERT INTO `tickets` (`id`, `booking_id`, `ticket_code`, `qr_code`, `created_at`, `status`, `seat_number`) VALUES ('52', '151', 'EVT-151-8587', 'uploads/qr/ticket_151.png', '2026-07-13 10:49:05', 'unused', NULL);
INSERT INTO `tickets` (`id`, `booking_id`, `ticket_code`, `qr_code`, `created_at`, `status`, `seat_number`) VALUES ('53', '151', 'EVT-151-3139', 'uploads/qr/ticket_151.png', '2026-07-13 10:49:05', 'unused', NULL);
INSERT INTO `tickets` (`id`, `booking_id`, `ticket_code`, `qr_code`, `created_at`, `status`, `seat_number`) VALUES ('54', '152', 'EVT-152-2744', 'uploads/qr/ticket_152.png', '2026-07-13 11:33:37', 'unused', NULL);
INSERT INTO `tickets` (`id`, `booking_id`, `ticket_code`, `qr_code`, `created_at`, `status`, `seat_number`) VALUES ('55', '152', 'EVT-152-4102', 'uploads/qr/ticket_152.png', '2026-07-13 11:33:37', 'unused', NULL);
INSERT INTO `tickets` (`id`, `booking_id`, `ticket_code`, `qr_code`, `created_at`, `status`, `seat_number`) VALUES ('56', '154', 'EVT-154-2854', 'uploads/qr/ticket_154.png', '2026-07-13 11:47:00', 'unused', NULL);
INSERT INTO `tickets` (`id`, `booking_id`, `ticket_code`, `qr_code`, `created_at`, `status`, `seat_number`) VALUES ('57', '154', 'EVT-154-4158', 'uploads/qr/ticket_154.png', '2026-07-13 11:47:00', 'unused', NULL);
INSERT INTO `tickets` (`id`, `booking_id`, `ticket_code`, `qr_code`, `created_at`, `status`, `seat_number`) VALUES ('58', '155', 'EVT-155-4738', 'uploads/qr/ticket_155.png', '2026-07-13 12:06:20', 'used', NULL);
INSERT INTO `tickets` (`id`, `booking_id`, `ticket_code`, `qr_code`, `created_at`, `status`, `seat_number`) VALUES ('59', '155', 'EVT-155-1536', 'uploads/qr/ticket_155.png', '2026-07-13 12:06:20', 'used', NULL);
INSERT INTO `tickets` (`id`, `booking_id`, `ticket_code`, `qr_code`, `created_at`, `status`, `seat_number`) VALUES ('60', '156', 'EVT-156-4334', 'uploads/qr/ticket_156.png', '2026-07-13 12:17:30', 'unused', NULL);
INSERT INTO `tickets` (`id`, `booking_id`, `ticket_code`, `qr_code`, `created_at`, `status`, `seat_number`) VALUES ('61', '156', 'EVT-156-8860', 'uploads/qr/ticket_156.png', '2026-07-13 12:17:30', 'unused', NULL);
INSERT INTO `tickets` (`id`, `booking_id`, `ticket_code`, `qr_code`, `created_at`, `status`, `seat_number`) VALUES ('62', '157', 'EVT-157-3876', 'uploads/qr/ticket_157.png', '2026-07-13 13:19:31', 'unused', NULL);
INSERT INTO `tickets` (`id`, `booking_id`, `ticket_code`, `qr_code`, `created_at`, `status`, `seat_number`) VALUES ('63', '157', 'EVT-157-7118', 'uploads/qr/ticket_157.png', '2026-07-13 13:19:31', 'unused', NULL);
INSERT INTO `tickets` (`id`, `booking_id`, `ticket_code`, `qr_code`, `created_at`, `status`, `seat_number`) VALUES ('64', '159', 'EVT-159-6495', 'uploads/qr/ticket_159.png', '2026-07-30 22:36:50', 'unused', NULL);
INSERT INTO `tickets` (`id`, `booking_id`, `ticket_code`, `qr_code`, `created_at`, `status`, `seat_number`) VALUES ('65', '159', 'EVT-159-2149', 'uploads/qr/ticket_159.png', '2026-07-30 22:36:50', 'unused', NULL);

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('customer','organizer','admin') DEFAULT 'customer',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_tier` varchar(20) DEFAULT 'verified',
  `admin_role` enum('super_admin','junior_admin','financial_admin','security_admin') DEFAULT 'super_admin',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `users` (`id`, `full_name`, `email`, `phone`, `password`, `role`, `created_at`, `user_tier`, `admin_role`) VALUES ('2', 'Dasun Shanaka', 'dasun@gmail.com', '0740461033', '$2y$10$WZvwgw4Nubb96X88DfUCsOBPYc04l.CdQCzfEZ6qBpL3NFD4Ujx2m', 'organizer', '2026-06-17 23:30:12', 'verified', 'super_admin');
INSERT INTO `users` (`id`, `full_name`, `email`, `phone`, `password`, `role`, `created_at`, `user_tier`, `admin_role`) VALUES ('3', 'kamal Shanaka', 'test@gmail.com', '0740461034', '$2y$10$Y.8flr95U40QukoYYBiQpee4.Mbj04y2z9o9E2ZJUmS4ZG2YezKnu', 'customer', '2026-06-17 23:41:57', 'verified', 'super_admin');
INSERT INTO `users` (`id`, `full_name`, `email`, `phone`, `password`, `role`, `created_at`, `user_tier`, `admin_role`) VALUES ('5', 'Yumeth Pahasara', 'yumethpahasara12@gmail.com', '0740709421', '$2y$10$PebIoRxMdvY3HtdmpAULVOLgkq9CaCJGpZks4953q6ZU1TC1zjX5W', 'organizer', '2026-06-20 11:37:02', 'verified', 'super_admin');
INSERT INTO `users` (`id`, `full_name`, `email`, `phone`, `password`, `role`, `created_at`, `user_tier`, `admin_role`) VALUES ('7', 'Thimira', 'thimira12@gmail.com', '0713423445', '$2y$10$6J6hpn8p4ZpDRFtiaYarueKDWQqpGwFRJems.vbmuSPbf/kBxGikS', 'admin', '2026-07-10 23:55:53', 'verified', 'super_admin');
INSERT INTO `users` (`id`, `full_name`, `email`, `phone`, `password`, `role`, `created_at`, `user_tier`, `admin_role`) VALUES ('9', 'Hiran Anajana', 'hirananjana12@gmail.com', '0719876543', '$2y$10$3yJP/UXffrUO9pErPOkxp.pWboYL7fLhqP/E/F4cWH/4fq1FVuaV6', 'customer', '2026-07-13 02:08:00', 'premium', 'super_admin');
INSERT INTO `users` (`id`, `full_name`, `email`, `phone`, `password`, `role`, `created_at`, `user_tier`, `admin_role`) VALUES ('10', 'Navod Teshan', 'navod12@gmail.com', '0702564785', '$2y$10$o6F4UGj3V6HRBMBmbgbdoeNkEcF3rjg2BWKEjKbJ2BKOgT9zdR6za', 'organizer', '2026-07-30 18:50:43', 'verified', 'super_admin');
INSERT INTO `users` (`id`, `full_name`, `email`, `phone`, `password`, `role`, `created_at`, `user_tier`, `admin_role`) VALUES ('11', 'Test User Verification', 'testuser_1786283115681@example.com', '0771234567', '$2y$10$umZehsUiIcMVzAKYqnjXBu1iRH9n/XrWKoqd3ezaq/k0ng2d7khI6', 'customer', '2026-08-09 19:15:18', 'verified', 'super_admin');

SET FOREIGN_KEY_CHECKS=1;
