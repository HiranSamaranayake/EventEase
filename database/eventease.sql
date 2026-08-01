-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 01, 2026 at 08:46 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `eventease`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `admin_role` enum('super_admin','support_admin','financial_admin','security_admin') DEFAULT 'super_admin',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `user_id`, `full_name`, `email`, `phone`, `admin_role`, `created_at`) VALUES
(1, 7, 'Thimira', 'thimira12@gmail.com', '0713423445', 'super_admin', '2026-08-01 18:32:42'),
(2, 9, 'Hiran Anajana', 'hirananjana12@gmail.com', '0701079141', 'support_admin', '2026-08-01 18:32:42');

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `ticket_quantity` int(11) NOT NULL DEFAULT 1,
  `total_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `payment_status` enum('Pending','Paid','Refunded') DEFAULT 'Pending',
  `booking_status` enum('Pending','Confirmed','Cancelled') DEFAULT 'Pending',
  `qr_code` varchar(255) DEFAULT NULL,
  `booking_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `ticket_quantity`, `total_amount`, `payment_status`, `booking_status`, `qr_code`, `booking_date`) VALUES
(32, 5, 6, 1, 0.00, 'Pending', 'Pending', NULL, '2026-07-03 18:28:42'),
(33, 5, 6, 1, 0.00, 'Pending', 'Pending', NULL, '2026-07-03 18:28:42'),
(84, 5, 9, 1, 4000.00, 'Pending', 'Pending', NULL, '2026-07-12 07:48:46'),
(85, 7, 7, 1, 8000.00, 'Pending', 'Pending', NULL, '2026-07-12 08:07:42'),
(96, 7, 7, 1, 8000.00, 'Pending', 'Pending', NULL, '2026-07-12 17:20:24'),
(109, 9, 14, 1, 4000.00, 'Pending', 'Pending', NULL, '2026-07-12 20:38:32'),
(110, 9, 14, 1, 4000.00, 'Pending', 'Pending', NULL, '2026-07-12 20:40:54'),
(111, 9, 14, 1, 4000.00, 'Pending', 'Pending', NULL, '2026-07-12 20:45:23'),
(112, 9, 14, 1, 4000.00, 'Pending', 'Pending', NULL, '2026-07-12 20:49:34'),
(113, 9, 14, 1, 4000.00, 'Paid', 'Confirmed', NULL, '2026-07-12 20:53:55'),
(114, 9, 14, 1, 4000.00, 'Paid', 'Confirmed', NULL, '2026-07-12 20:56:44'),
(115, 9, 6, 1, 6000.00, 'Paid', 'Confirmed', NULL, '2026-07-12 21:08:26'),
(116, 9, 7, 1, 8000.00, 'Paid', 'Confirmed', NULL, '2026-07-12 21:16:04'),
(117, 9, 15, 1, 1000.00, 'Paid', 'Confirmed', NULL, '2026-07-12 22:01:34'),
(118, 9, 7, 1, 8000.00, '', 'Cancelled', NULL, '2026-07-13 00:04:15'),
(119, 9, 14, 1, 4000.00, 'Paid', 'Confirmed', NULL, '2026-07-13 00:16:58'),
(120, 9, 16, 1, 5000.00, 'Paid', 'Confirmed', NULL, '2026-07-13 00:22:02'),
(121, 9, 17, 1, 5000.00, 'Paid', 'Confirmed', NULL, '2026-07-13 03:09:40'),
(122, 9, 17, 1, 5000.00, 'Pending', 'Pending', NULL, '2026-07-13 05:15:48'),
(123, 9, 17, 1, 5000.00, 'Pending', 'Pending', NULL, '2026-07-13 05:15:50'),
(124, 9, 17, 1, 5000.00, 'Pending', 'Pending', NULL, '2026-07-13 05:15:54'),
(125, 9, 17, 1, 5000.00, 'Pending', 'Pending', NULL, '2026-07-13 05:15:54'),
(126, 9, 17, 1, 5000.00, 'Pending', 'Pending', NULL, '2026-07-13 05:15:54'),
(127, 9, 17, 1, 5000.00, 'Pending', 'Pending', NULL, '2026-07-13 05:15:54'),
(128, 9, 17, 1, 5000.00, 'Pending', 'Pending', NULL, '2026-07-13 05:15:55'),
(129, 9, 17, 1, 5000.00, 'Pending', 'Pending', NULL, '2026-07-13 05:15:58'),
(130, 9, 17, 1, 5000.00, 'Pending', 'Pending', NULL, '2026-07-13 05:15:58'),
(131, 9, 17, 1, 5000.00, 'Pending', 'Pending', NULL, '2026-07-13 05:15:59'),
(132, 9, 17, 1, 5000.00, 'Pending', 'Pending', NULL, '2026-07-13 05:15:59'),
(133, 9, 17, 1, 5000.00, 'Pending', 'Pending', NULL, '2026-07-13 05:15:59'),
(134, 9, 17, 1, 5000.00, 'Pending', 'Pending', NULL, '2026-07-13 05:15:59'),
(135, 9, 17, 1, 5000.00, 'Pending', 'Pending', NULL, '2026-07-13 05:16:00'),
(136, 9, 17, 1, 5000.00, 'Pending', 'Pending', NULL, '2026-07-13 05:16:00'),
(137, 9, 17, 1, 5000.00, 'Pending', 'Pending', NULL, '2026-07-13 05:16:01'),
(138, 9, 17, 1, 5000.00, 'Pending', 'Pending', NULL, '2026-07-13 05:16:01'),
(139, 9, 17, 1, 5000.00, 'Pending', 'Pending', NULL, '2026-07-13 05:16:02'),
(140, 9, 17, 1, 5000.00, 'Pending', 'Pending', NULL, '2026-07-13 05:16:02'),
(141, 9, 17, 1, 5000.00, 'Pending', 'Pending', NULL, '2026-07-13 05:16:03'),
(142, 9, 17, 1, 5000.00, 'Pending', 'Pending', NULL, '2026-07-13 05:16:03'),
(143, 9, 17, 1, 5000.00, 'Pending', 'Pending', NULL, '2026-07-13 05:16:03'),
(144, 9, 17, 1, 5000.00, 'Pending', 'Pending', NULL, '2026-07-13 05:16:09'),
(145, 9, 17, 1, 5000.00, 'Pending', 'Pending', NULL, '2026-07-13 05:16:09'),
(146, 9, 17, 1, 5000.00, 'Pending', 'Pending', NULL, '2026-07-13 05:16:09'),
(147, 9, 17, 1, 5000.00, 'Pending', 'Pending', NULL, '2026-07-13 05:16:10'),
(148, 9, 17, 1, 5000.00, 'Pending', 'Pending', NULL, '2026-07-13 05:16:15'),
(149, 9, 17, 1, 5000.00, 'Pending', 'Pending', NULL, '2026-07-13 05:16:15'),
(150, 9, 17, 1, 5000.00, 'Pending', 'Pending', NULL, '2026-07-13 05:16:22'),
(151, 9, 17, 1, 5000.00, 'Paid', 'Confirmed', NULL, '2026-07-13 05:18:40'),
(152, 9, 19, 1, 6000.00, 'Paid', 'Confirmed', NULL, '2026-07-13 06:03:18'),
(153, 9, 19, 1, 6000.00, 'Pending', 'Pending', NULL, '2026-07-13 06:06:31'),
(154, 9, 20, 1, 500.00, 'Paid', 'Confirmed', NULL, '2026-07-13 06:16:36'),
(155, 9, 21, 1, 300.00, '', 'Cancelled', NULL, '2026-07-13 06:36:01'),
(156, 9, 22, 1, 1000.00, 'Paid', 'Confirmed', NULL, '2026-07-13 06:47:17'),
(157, 9, 23, 1, 5000.00, 'Paid', 'Confirmed', NULL, '2026-07-13 07:49:18'),
(158, 9, 17, 1, 5000.00, 'Pending', 'Pending', NULL, '2026-07-30 09:50:18'),
(159, 9, 16, 1, 7500.00, 'Paid', 'Confirmed', NULL, '2026-07-30 17:05:20');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `user_id`, `full_name`, `email`, `phone`, `created_at`) VALUES
(1, 3, 'kamal Shanaka', 'test@gmail.com', '0740461034', '2026-08-01 18:32:42'),
(2, 12, 'Chamathka', 'chamathka12@gmail.com', '0712345678', '2026-08-01 18:37:28');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
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
  `status` varchar(20) NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `organizer_id`, `title`, `description`, `event_date`, `location`, `capacity`, `created_at`, `price`, `image`, `category`, `status`) VALUES
(1, 2, 'Tech Conference 2026 - Updated', 'Updated event details', '2026-12-25', 'Kandy', 600, '2026-06-12 09:41:41', 2500.00, NULL, 'General', 'pending'),
(4, 2, 'football fiesta', 'pattama football parak gahamu', '2026-02-03', 'Negombo', NULL, '2026-07-01 15:39:23', 0.00, NULL, 'General', 'rejected'),
(6, 2, 'Aluth kalawak', 'Held on portcity colombo ', '2026-02-08', 'Colombo', 1000, '2026-07-03 06:00:21', 6000.00, '1783058421_images.jpg', 'Music', 'approved'),
(7, 2, 'Likitha Event', 'Ape likithaya', '2026-04-03', 'Gampaha', 60, '2026-07-03 18:31:49', 8000.00, '1783103509_Green and Yellow Gardening YouTube Banner.png', 'Music', 'approved'),
(9, 2, 'Chess ', 'sport', '2026-07-21', 'Campus', 2998, '2026-07-12 06:46:38', 4000.00, '', 'General', 'rejected'),
(14, 2, 'HER', 'Music Event', '2026-07-15', 'Colombo', 300, '2026-07-12 18:51:33', 4000.00, '1783882293_Screenshot 2026-07-12 221402.png', 'Music', 'approved'),
(15, 2, 'Praharshana', 'Drama Event', '2026-07-18', 'UWU', 299, '2026-07-12 21:59:11', 1000.00, '1783893551_download.jpg', 'Entertainment', 'approved'),
(16, 2, 'Mariens Live in concert', 'Come Have Fun with the mariens ', '2026-07-25', 'Negombo', 200, '2026-07-13 00:19:49', 5000.00, '1783901989_MARIANS_Unplugged_Live_in_Dubai_2015_may_15_Sheikh_Rashid_Auditorium_The_Indian_High_School_25147-full.jpg', 'Music', 'approved'),
(17, 2, 'Gypsis Live in Concert', 'Come Have fun with us', '2026-07-31', 'Kalutara', 100, '2026-07-13 03:07:46', 5000.00, '1783912066_LIVE_IM_PARK_Gypsys.jpg', 'Music', 'approved'),
(18, 2, 'cricket event', 'cricket event for all', '2026-07-15', 'Kandy', 300, '2026-07-13 05:29:53', 500.00, '', 'Sports', 'pending'),
(19, 2, 'Dancing night', 'all can dance', '2026-07-18', 'Gampaha', 100, '2026-07-13 05:58:14', 6000.00, '1783922294_MARIANS_Unplugged_Live_in_Dubai_2015_may_15_Sheikh_Rashid_Auditorium_The_Indian_High_School_25147-full.jpg', 'Music', 'approved'),
(20, 2, 'chess event', 'you all can play chess', '2026-07-16', 'Kandy', 100, '2026-07-13 06:12:49', 500.00, '1783923169_LIVE_IM_PARK_Gypsys.jpg', 'Sports', 'approved'),
(21, 2, 'chagudu ewent', 'have sun fun', '2026-07-25', 'Kandy', 1000, '2026-07-13 06:31:52', 300.00, '', 'Sports', 'approved'),
(22, 2, 'F1 race', 'cars race', '2026-07-25', 'Kandy', 500, '2026-07-13 06:43:33', 1000.00, '', 'Sports', 'approved'),
(23, 2, 'Sarith surith event', 'Music event vfor all', '2026-07-24', 'Kandy', 100, '2026-07-13 07:45:10', 5000.00, '1783928710_maxresdefault.jpg', 'Music', 'approved');

-- --------------------------------------------------------

--
-- Table structure for table `event_booked_seats`
--

CREATE TABLE `event_booked_seats` (
  `id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `booking_id` int(11) DEFAULT NULL,
  `seat_code` varchar(50) NOT NULL,
  `tier_name` varchar(50) NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `user_id` int(11) NOT NULL,
  `booked_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `event_booked_seats`
--

INSERT INTO `event_booked_seats` (`id`, `event_id`, `booking_id`, `seat_code`, `tier_name`, `price`, `user_id`, `booked_at`) VALUES
(1, 16, 159, 'C10', 'Platinum Tier', 7500.00, 9, '2026-07-30 17:05:20');

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` varchar(50) NOT NULL DEFAULT 'info',
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `link` varchar(255) DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `message`, `link`, `is_read`, `created_at`) VALUES
(1, 7, 'booking', '🎟️ Ticket Booking Confirmed!', 'Your ticket reservation for \'Summer Music Festival 2026\' has been confirmed. Seat: VIP-A1.', '/my-bookings', 1, '2026-07-30 17:30:54'),
(2, 7, 'waiting_list', '🎉 Waiting List Priority Alert!', 'A ticket slot opened up for \'Tech Innovators Summit\'. Click to claim your priority ticket.', '/waiting-list', 1, '2026-07-30 17:30:54'),
(3, 7, 'verification', '🛡️ Organizer Account Status Update', 'Your organizer business registration document has been reviewed and verified.', '/organizer/verify', 1, '2026-07-30 17:30:54'),
(4, 5, 'booking', '🎟️ Ticket Booking Confirmed!', 'Your ticket reservation for \'Summer Music Festival 2026\' has been confirmed. Seat: VIP-A1.', '/my-bookings', 1, '2026-08-01 15:31:12'),
(5, 5, 'waiting_list', '🎉 Waiting List Priority Alert!', 'A ticket slot opened up for \'Tech Innovators Summit\'. Click to claim your priority ticket.', '/waiting-list', 1, '2026-08-01 15:31:12'),
(6, 5, 'verification', '🛡️ Organizer Account Status Update', 'Your organizer business registration document has been reviewed and verified.', '/organizer/verify', 1, '2026-08-01 15:31:12'),
(7, 9, 'booking', '🎟️ Ticket Booking Confirmed!', 'Your ticket reservation for \'Summer Music Festival 2026\' has been confirmed. Seat: VIP-A1.', '/my-bookings', 0, '2026-08-01 16:02:18'),
(8, 9, 'waiting_list', '🎉 Waiting List Priority Alert!', 'A ticket slot opened up for \'Tech Innovators Summit\'. Click to claim your priority ticket.', '/waiting-list', 0, '2026-08-01 16:02:18'),
(9, 9, 'verification', '🛡️ Organizer Account Status Update', 'Your organizer business registration document has been reviewed and verified.', '/organizer/verify', 0, '2026-08-01 16:02:18');

-- --------------------------------------------------------

--
-- Table structure for table `organizers`
--

CREATE TABLE `organizers` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `organization_name` varchar(150) NOT NULL,
  `verification_status` enum('pending','approved','rejected') DEFAULT 'pending',
  `phone` varchar(50) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `business_registration_number` varchar(100) DEFAULT NULL,
  `nic_passport` varchar(100) DEFAULT NULL,
  `document_path` varchar(255) DEFAULT NULL,
  `rejection_reason` text DEFAULT NULL,
  `submitted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `organizers`
--

INSERT INTO `organizers` (`id`, `user_id`, `full_name`, `email`, `organization_name`, `verification_status`, `phone`, `website`, `address`, `business_registration_number`, `nic_passport`, `document_path`, `rejection_reason`, `submitted_at`) VALUES
(2, 5, 'Yumeth Pahasara', 'yumethpahasara12@gmail.com', 'Yumeth Events', 'approved', '0740709421', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, 2, 'Dasun Shanaka', 'dasun@gmail.com', 'Dasun Shanaka', 'approved', '0740461033', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(7, 10, 'Navod Teshan', 'navod12@gmail.com', 'Navod Teshan', 'approved', '0702564785', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `payment_status` enum('pending','success','failed') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `booking_id`, `amount`, `transaction_id`, `payment_status`, `created_at`) VALUES
(46, 84, 4000.00, NULL, 'pending', '2026-07-12 07:48:46'),
(47, 85, 8000.00, NULL, 'pending', '2026-07-12 08:07:42'),
(58, 96, 8000.00, NULL, 'pending', '2026-07-12 17:20:24'),
(71, 109, 4000.00, NULL, 'pending', '2026-07-12 20:38:32'),
(72, 110, 4000.00, NULL, 'pending', '2026-07-12 20:40:54'),
(73, 111, 4000.00, NULL, 'pending', '2026-07-12 20:45:23'),
(74, 112, 4000.00, NULL, 'pending', '2026-07-12 20:49:34'),
(75, 113, 4000.00, NULL, 'pending', '2026-07-12 20:53:55'),
(76, 114, 4000.00, NULL, 'pending', '2026-07-12 20:56:44'),
(77, 115, 6000.00, NULL, 'pending', '2026-07-12 21:08:26'),
(78, 116, 8000.00, NULL, 'pending', '2026-07-12 21:16:04'),
(79, 117, 1000.00, NULL, 'pending', '2026-07-12 22:01:34'),
(80, 118, 8000.00, NULL, 'pending', '2026-07-13 00:04:15'),
(81, 119, 4000.00, NULL, 'pending', '2026-07-13 00:16:58'),
(82, 120, 5000.00, NULL, 'pending', '2026-07-13 00:22:02'),
(83, 121, 5000.00, NULL, 'pending', '2026-07-13 03:09:40'),
(84, 122, 5000.00, NULL, 'pending', '2026-07-13 05:15:48'),
(85, 123, 5000.00, NULL, 'pending', '2026-07-13 05:15:50'),
(86, 124, 5000.00, NULL, 'pending', '2026-07-13 05:15:54'),
(87, 125, 5000.00, NULL, 'pending', '2026-07-13 05:15:54'),
(88, 126, 5000.00, NULL, 'pending', '2026-07-13 05:15:54'),
(89, 127, 5000.00, NULL, 'pending', '2026-07-13 05:15:54'),
(90, 128, 5000.00, NULL, 'pending', '2026-07-13 05:15:55'),
(91, 129, 5000.00, NULL, 'pending', '2026-07-13 05:15:58'),
(92, 130, 5000.00, NULL, 'pending', '2026-07-13 05:15:58'),
(93, 131, 5000.00, NULL, 'pending', '2026-07-13 05:15:59'),
(94, 132, 5000.00, NULL, 'pending', '2026-07-13 05:15:59'),
(95, 133, 5000.00, NULL, 'pending', '2026-07-13 05:15:59'),
(96, 134, 5000.00, NULL, 'pending', '2026-07-13 05:15:59'),
(97, 135, 5000.00, NULL, 'pending', '2026-07-13 05:16:00'),
(98, 136, 5000.00, NULL, 'pending', '2026-07-13 05:16:00'),
(99, 137, 5000.00, NULL, 'pending', '2026-07-13 05:16:01'),
(100, 138, 5000.00, NULL, 'pending', '2026-07-13 05:16:01'),
(101, 139, 5000.00, NULL, 'pending', '2026-07-13 05:16:02'),
(102, 140, 5000.00, NULL, 'pending', '2026-07-13 05:16:02'),
(103, 141, 5000.00, NULL, 'pending', '2026-07-13 05:16:03'),
(104, 142, 5000.00, NULL, 'pending', '2026-07-13 05:16:03'),
(105, 143, 5000.00, NULL, 'pending', '2026-07-13 05:16:03'),
(106, 144, 5000.00, NULL, 'pending', '2026-07-13 05:16:09'),
(107, 145, 5000.00, NULL, 'pending', '2026-07-13 05:16:09'),
(108, 146, 5000.00, NULL, 'pending', '2026-07-13 05:16:09'),
(109, 147, 5000.00, NULL, 'pending', '2026-07-13 05:16:10'),
(110, 148, 5000.00, NULL, 'pending', '2026-07-13 05:16:15'),
(111, 149, 5000.00, NULL, 'pending', '2026-07-13 05:16:15'),
(112, 150, 5000.00, NULL, 'pending', '2026-07-13 05:16:22'),
(113, 151, 5000.00, NULL, 'pending', '2026-07-13 05:18:40'),
(114, 152, 6000.00, NULL, 'pending', '2026-07-13 06:03:18'),
(115, 153, 6000.00, NULL, 'pending', '2026-07-13 06:06:31'),
(116, 154, 500.00, NULL, 'pending', '2026-07-13 06:16:36'),
(117, 155, 300.00, NULL, 'pending', '2026-07-13 06:36:01'),
(118, 156, 1000.00, NULL, 'pending', '2026-07-13 06:47:17'),
(119, 157, 5000.00, NULL, 'pending', '2026-07-13 07:49:18'),
(120, 158, 5000.00, NULL, 'pending', '2026-07-30 09:50:18'),
(121, 159, 7500.00, NULL, '', '2026-07-30 17:05:20');

-- --------------------------------------------------------

--
-- Table structure for table `seats`
--

CREATE TABLE `seats` (
  `id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `seat_number` varchar(20) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `status` enum('available','reserved','booked') DEFAULT 'available'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `seats`
--

INSERT INTO `seats` (`id`, `event_id`, `seat_number`, `price`, `status`) VALUES
(1, 1, 'A1', 1000.00, 'available'),
(2, 1, 'A2', 1000.00, 'available'),
(3, 1, 'A3', 1000.00, 'available'),
(4, 1, 'B1', 1500.00, 'available'),
(5, 1, 'B2', 1500.00, 'available');

-- --------------------------------------------------------

--
-- Table structure for table `support_tickets`
--

CREATE TABLE `support_tickets` (
  `id` int(11) NOT NULL,
  `ticket_number` varchar(50) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) DEFAULT NULL,
  `booking_id` int(11) DEFAULT NULL,
  `category` enum('Event Issue','Payment & Refund Dispute','Ticket Download Problem','Account / Verification','General Inquiry') NOT NULL DEFAULT 'General Inquiry',
  `subject` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `priority` enum('Low','Medium','High','Urgent') DEFAULT 'Medium',
  `status` enum('Open','In Progress','Resolved','Closed') DEFAULT 'Open',
  `assigned_to` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `support_ticket_replies`
--

CREATE TABLE `support_ticket_replies` (
  `id` int(11) NOT NULL,
  `ticket_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `ticket_code` varchar(100) DEFAULT NULL,
  `qr_code` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('unused','used') NOT NULL DEFAULT 'unused',
  `seat_number` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`id`, `booking_id`, `ticket_code`, `qr_code`, `created_at`, `status`, `seat_number`) VALUES
(26, 33, 'TKT00033', 'uploads/qr/TKT00033.png', '2026-07-03 18:28:44', 'unused', NULL),
(40, 115, 'EVT-115-8065', NULL, '2026-07-12 21:15:44', 'unused', NULL),
(41, 116, 'EVT-116-4217', NULL, '2026-07-12 21:16:11', 'unused', NULL),
(42, 116, 'EVT-116-5496', NULL, '2026-07-12 21:16:11', 'unused', NULL),
(43, 117, 'EVT-117-3580', NULL, '2026-07-12 22:01:49', 'unused', NULL),
(44, 118, 'EVT-118-4924', 'uploads/qr/ticket_118.png', '2026-07-13 00:04:29', 'used', NULL),
(45, 118, 'EVT-118-7188', 'uploads/qr/ticket_118.png', '2026-07-13 00:04:29', 'used', NULL),
(46, 119, 'EVT-119-9453', 'uploads/qr/ticket_119.png', '2026-07-13 00:17:13', 'unused', NULL),
(47, 119, 'EVT-119-6432', 'uploads/qr/ticket_119.png', '2026-07-13 00:17:13', 'unused', NULL),
(48, 120, 'EVT-120-4215', 'uploads/qr/ticket_120.png', '2026-07-13 00:22:18', 'unused', NULL),
(49, 120, 'EVT-120-8232', 'uploads/qr/ticket_120.png', '2026-07-13 00:22:18', 'unused', NULL),
(50, 121, 'EVT-121-3022', 'uploads/qr/ticket_121.png', '2026-07-13 03:09:56', 'unused', NULL),
(51, 121, 'EVT-121-3294', 'uploads/qr/ticket_121.png', '2026-07-13 03:09:56', 'unused', NULL),
(52, 151, 'EVT-151-8587', 'uploads/qr/ticket_151.png', '2026-07-13 05:19:05', 'unused', NULL),
(53, 151, 'EVT-151-3139', 'uploads/qr/ticket_151.png', '2026-07-13 05:19:05', 'unused', NULL),
(54, 152, 'EVT-152-2744', 'uploads/qr/ticket_152.png', '2026-07-13 06:03:37', 'unused', NULL),
(55, 152, 'EVT-152-4102', 'uploads/qr/ticket_152.png', '2026-07-13 06:03:37', 'unused', NULL),
(56, 154, 'EVT-154-2854', 'uploads/qr/ticket_154.png', '2026-07-13 06:17:00', 'unused', NULL),
(57, 154, 'EVT-154-4158', 'uploads/qr/ticket_154.png', '2026-07-13 06:17:00', 'unused', NULL),
(58, 155, 'EVT-155-4738', 'uploads/qr/ticket_155.png', '2026-07-13 06:36:20', 'used', NULL),
(59, 155, 'EVT-155-1536', 'uploads/qr/ticket_155.png', '2026-07-13 06:36:20', 'used', NULL),
(60, 156, 'EVT-156-4334', 'uploads/qr/ticket_156.png', '2026-07-13 06:47:30', 'unused', NULL),
(61, 156, 'EVT-156-8860', 'uploads/qr/ticket_156.png', '2026-07-13 06:47:30', 'unused', NULL),
(62, 157, 'EVT-157-3876', 'uploads/qr/ticket_157.png', '2026-07-13 07:49:31', 'unused', NULL),
(63, 157, 'EVT-157-7118', 'uploads/qr/ticket_157.png', '2026-07-13 07:49:31', 'unused', NULL),
(64, 159, 'EVT-159-6495', 'uploads/qr/ticket_159.png', '2026-07-30 17:06:50', 'unused', NULL),
(65, 159, 'EVT-159-2149', 'uploads/qr/ticket_159.png', '2026-07-30 17:06:50', 'unused', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('customer','organizer','admin') DEFAULT 'customer',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `phone`, `password`, `role`, `created_at`) VALUES
(2, 'Dasun Shanaka', 'dasun@gmail.com', '0740461033', '$2y$10$WZvwgw4Nubb96X88DfUCsOBPYc04l.CdQCzfEZ6qBpL3NFD4Ujx2m', 'organizer', '2026-06-17 18:00:12'),
(3, 'kamal Shanaka', 'test@gmail.com', '0740461034', '$2y$10$Y.8flr95U40QukoYYBiQpee4.Mbj04y2z9o9E2ZJUmS4ZG2YezKnu', 'customer', '2026-06-17 18:11:57'),
(5, 'Yumeth Pahasara', 'yumethpahasara12@gmail.com', '0740709421', '$2y$10$PebIoRxMdvY3HtdmpAULVOLgkq9CaCJGpZks4953q6ZU1TC1zjX5W', 'organizer', '2026-06-20 06:07:02'),
(7, 'Thimira', 'thimira12@gmail.com', '0713423445', '$2y$10$6J6hpn8p4ZpDRFtiaYarueKDWQqpGwFRJems.vbmuSPbf/kBxGikS', 'admin', '2026-07-10 18:25:53'),
(9, 'Hiran Anajana', 'hirananjana12@gmail.com', '0701079141', '$2y$10$3yJP/UXffrUO9pErPOkxp.pWboYL7fLhqP/E/F4cWH/4fq1FVuaV6', 'admin', '2026-07-12 20:38:00'),
(10, 'Navod Teshan', 'navod12@gmail.com', '0702564785', '$2y$10$o6F4UGj3V6HRBMBmbgbdoeNkEcF3rjg2BWKEjKbJ2BKOgT9zdR6za', 'organizer', '2026-07-30 13:20:43'),
(12, 'Chamathka', 'chamathka12@gmail.com', '0712345678', '$2y$10$Y5/MNIL5b4hZuXVAATXCZOZs4e8oEe4xBCCWxeKvDupsViyGnmnvq', 'customer', '2026-08-01 18:37:28');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `event_id` (`event_id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `organizer_id` (`organizer_id`);

--
-- Indexes for table `event_booked_seats`
--
ALTER TABLE `event_booked_seats`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `event_seat_unique` (`event_id`,`seat_code`);

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_event` (`user_id`,`event_id`),
  ADD KEY `event_id` (`event_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id_idx` (`user_id`),
  ADD KEY `is_read_idx` (`is_read`);

--
-- Indexes for table `organizers`
--
ALTER TABLE `organizers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `booking_id` (`booking_id`);

--
-- Indexes for table `seats`
--
ALTER TABLE `seats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event_id` (`event_id`);

--
-- Indexes for table `support_tickets`
--
ALTER TABLE `support_tickets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ticket_number` (`ticket_number`);

--
-- Indexes for table `support_ticket_replies`
--
ALTER TABLE `support_ticket_replies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ticket_code` (`ticket_code`),
  ADD KEY `booking_id` (`booking_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=160;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `event_booked_seats`
--
ALTER TABLE `event_booked_seats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `organizers`
--
ALTER TABLE `organizers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=122;

--
-- AUTO_INCREMENT for table `seats`
--
ALTER TABLE `seats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `support_tickets`
--
ALTER TABLE `support_tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `support_ticket_replies`
--
ALTER TABLE `support_ticket_replies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admins`
--
ALTER TABLE `admins`
  ADD CONSTRAINT `fk_admins_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `customers`
--
ALTER TABLE `customers`
  ADD CONSTRAINT `fk_customers_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `organizers`
--
ALTER TABLE `organizers`
  ADD CONSTRAINT `organizers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `seats`
--
ALTER TABLE `seats`
  ADD CONSTRAINT `seats_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`);

--
-- Constraints for table `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
