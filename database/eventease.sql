-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 09, 2026 at 05:06 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

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
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `booking_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `user_id`, `event_id`, `booking_date`) VALUES
(1, 1, 1, '2026-06-13 19:07:00'),
(2, 3, 1, '2026-06-21 07:59:18'),
(3, 6, 1, '2026-06-26 08:25:06'),
(4, 1, 1, '2026-06-26 09:03:14'),
(5, 1, 1, '2026-06-26 09:03:28'),
(6, 1, 1, '2026-06-26 09:04:30'),
(7, 1, 1, '2026-06-26 09:08:15'),
(8, 1, 1, '2026-06-26 09:15:25'),
(9, 1, 1, '2026-06-26 09:16:22'),
(10, 6, 1, '2026-06-26 10:20:32'),
(11, 1, 1, '2026-06-26 17:40:52'),
(12, 1, 1, '2026-06-26 17:47:44'),
(13, 1, 1, '2026-06-27 07:12:19'),
(14, 1, 1, '2026-06-27 07:12:19'),
(15, 1, 1, '2026-06-27 07:12:19'),
(16, 1, 1, '2026-06-27 07:12:19'),
(17, 1, 1, '2026-06-27 07:12:19'),
(18, 1, 1, '2026-06-27 07:12:19'),
(19, 1, 1, '2026-06-27 07:12:20'),
(20, 1, 1, '2026-06-27 07:12:20'),
(21, 1, 1, '2026-06-27 07:12:20'),
(22, 1, 1, '2026-06-27 07:12:20'),
(23, 1, 1, '2026-06-27 07:12:20'),
(24, 1, 1, '2026-06-27 07:12:20'),
(25, 1, 1, '2026-06-27 07:12:35'),
(26, 1, 4, '2026-07-01 16:13:51'),
(27, 1, 4, '2026-07-01 16:15:27'),
(28, 1, 4, '2026-07-01 16:16:31'),
(29, 1, 4, '2026-07-01 16:17:42'),
(30, 5, 6, '2026-07-03 18:28:42'),
(31, 5, 6, '2026-07-03 18:28:42'),
(32, 5, 6, '2026-07-03 18:28:42'),
(33, 5, 6, '2026-07-03 18:28:42'),
(34, 1, 7, '2026-07-05 13:22:32');

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
  `category` varchar(100) DEFAULT 'General'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `organizer_id`, `title`, `description`, `event_date`, `location`, `capacity`, `created_at`, `price`, `image`, `category`) VALUES
(1, 2, 'Tech Conference 2026 - Updated', 'Updated event details', '2026-12-25', 'Kandy', 600, '2026-06-12 09:41:41', 2500.00, NULL, 'General'),
(4, 5, 'football fiesta', 'pattama football parak gahamu', '2026-02-03', 'Negombo', NULL, '2026-07-01 15:39:23', 0.00, NULL, 'General'),
(6, 5, 'Aluth kalawak', 'Held on portcity colombo ', '2026-02-08', 'Colombo', 1000, '2026-07-03 06:00:21', 6000.00, '1783058421_images.jpg', 'Music'),
(7, 5, 'Likitha Event', 'Ape likithaya', '2026-04-03', 'Gampaha', 60, '2026-07-03 18:31:49', 8000.00, '1783103509_Green and Yellow Gardening YouTube Banner.png', 'Music');

-- --------------------------------------------------------

--
-- Table structure for table `organizers`
--

CREATE TABLE `organizers` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `organization_name` varchar(150) NOT NULL,
  `verification_status` enum('pending','approved','rejected') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `organizers`
--

INSERT INTO `organizers` (`id`, `user_id`, `organization_name`, `verification_status`) VALUES
(1, 3, 'ABC Events', 'approved');

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
(1, 1, 2000.00, 'TXN001', 'success', '2026-06-05 05:51:33');

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
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `ticket_code` varchar(100) DEFAULT NULL,
  `qr_code` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('unused','used') NOT NULL DEFAULT 'unused'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`id`, `booking_id`, `ticket_code`, `qr_code`, `created_at`, `status`) VALUES
(1, 1, 'TKT001', 'qr_placeholder.png', '2026-06-05 05:51:45', 'unused'),
(2, 4, 'TKT00004', 'qr_placeholder.png', '2026-06-26 09:03:14', 'unused'),
(3, 5, 'TKT00005', 'qr_placeholder.png', '2026-06-26 09:03:28', 'unused'),
(4, 6, 'TKT00006', 'qr_placeholder.png', '2026-06-26 09:04:30', 'unused'),
(5, 7, 'TKT00007', 'qr_placeholder.png', '2026-06-26 09:08:15', 'unused'),
(6, 10, 'TKT00010', 'qr_placeholder.png', '2026-06-26 10:20:32', 'unused'),
(7, 11, 'TKT00011', 'qr_placeholder.png', '2026-06-26 17:40:52', 'unused'),
(8, 12, 'TKT00012', 'qr_placeholder.png', '2026-06-26 17:47:44', 'unused'),
(9, 16, 'TKT00016', 'uploads/qr/TKT00016.png', '2026-06-27 07:12:20', 'unused'),
(10, 14, 'TKT00014', 'uploads/qr/TKT00014.png', '2026-06-27 07:12:20', 'unused'),
(11, 18, 'TKT00018', 'uploads/qr/TKT00018.png', '2026-06-27 07:12:20', 'unused'),
(12, 15, 'TKT00015', 'uploads/qr/TKT00015.png', '2026-06-27 07:12:20', 'used'),
(13, 17, 'TKT00017', 'uploads/qr/TKT00017.png', '2026-06-27 07:12:20', 'unused'),
(14, 13, 'TKT00013', 'uploads/qr/TKT00013.png', '2026-06-27 07:12:20', 'unused'),
(15, 19, 'TKT00019', 'uploads/qr/TKT00019.png', '2026-06-27 07:12:20', 'unused'),
(16, 20, 'TKT00020', 'uploads/qr/TKT00020.png', '2026-06-27 07:12:20', 'unused'),
(17, 21, 'TKT00021', 'uploads/qr/TKT00021.png', '2026-06-27 07:12:20', 'unused'),
(18, 22, 'TKT00022', 'uploads/qr/TKT00022.png', '2026-06-27 07:12:20', 'unused'),
(19, 24, 'TKT00024', 'uploads/qr/TKT00024.png', '2026-06-27 07:12:20', 'unused'),
(20, 23, 'TKT00023', 'uploads/qr/TKT00023.png', '2026-06-27 07:12:20', 'unused'),
(21, 25, 'TKT00025', 'uploads/qr/TKT00025.png', '2026-06-27 07:12:35', 'unused'),
(22, 26, 'TKT00026', 'uploads/qr/TKT00026.png', '2026-07-01 16:13:53', 'unused'),
(23, 27, 'TKT00027', 'uploads/qr/TKT00027.png', '2026-07-01 16:15:27', 'unused'),
(24, 28, 'TKT00028', 'uploads/qr/TKT00028.png', '2026-07-01 16:16:31', 'unused'),
(25, 29, 'TKT00029', 'uploads/qr/TKT00029.png', '2026-07-01 16:17:42', 'unused'),
(26, 33, 'TKT00033', 'uploads/qr/TKT00033.png', '2026-07-03 18:28:44', 'unused'),
(27, 32, 'TKT00032', 'uploads/qr/TKT00032.png', '2026-07-03 18:28:44', 'unused'),
(28, 31, 'TKT00031', 'uploads/qr/TKT00031.png', '2026-07-03 18:28:44', 'unused'),
(29, 30, 'TKT00030', 'uploads/qr/TKT00030.png', '2026-07-03 18:28:44', 'unused'),
(30, 34, 'TKT00034', 'uploads/qr/TKT00034.png', '2026-07-05 13:22:34', 'unused');

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
(1, 'Hiran Anjana kamal', 'hirananjana12@gmail.com', '0753565291', '$2y$10$0sCCvIO/7.apZ1mOGaqgzuwnyZvteNEpp6vma.FmqKfK0347bPa1y', 'customer', '2026-06-17 17:32:35'),
(2, 'Dasun Shanaka', 'dasun@gmail.com', '0740461033', '$2y$10$WZvwgw4Nubb96X88DfUCsOBPYc04l.CdQCzfEZ6qBpL3NFD4Ujx2m', 'customer', '2026-06-17 18:00:12'),
(3, 'kamal Shanaka', 'test@gmail.com', '0740461034', '$2y$10$Y.8flr95U40QukoYYBiQpee4.Mbj04y2z9o9E2ZJUmS4ZG2YezKnu', 'customer', '2026-06-17 18:11:57'),
(4, 'Upul Shanaka', 'Upul@gmail.com', '0740461039', '$2y$10$aDP/vooJTjhZ2lt9G0NtiOHOxm0KRVIYqeq6rekfgIOl6geJVeSma', 'organizer', '2026-06-17 18:40:56'),
(5, 'Yumeth Pahasara', 'yumethpahasara12@gmail.com', '0740709421', '$2y$10$PebIoRxMdvY3HtdmpAULVOLgkq9CaCJGpZks4953q6ZU1TC1zjX5W', 'organizer', '2026-06-20 06:07:02'),
(6, 'Hashen', 'hashenhewage9098@gmail.com', '0752593623', '$2y$10$FVDW14uFXsNdQny5sAEf2uMSDpE46GVoqzY98ytJOQhLnPDwTiXXy', 'admin', '2026-06-23 05:57:44');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `event_id` (`event_id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `organizer_id` (`organizer_id`);

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
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `organizers`
--
ALTER TABLE `organizers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `seats`
--
ALTER TABLE `seats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `organizers`
--
ALTER TABLE `organizers`
  ADD CONSTRAINT `organizers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`);

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
