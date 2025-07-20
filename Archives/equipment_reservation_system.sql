-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 20, 2025 at 06:42 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `equipment_reservation_system`
--

-- --------------------------------------------------------

--
-- Stand-in structure for view `active_reservations`
-- (See below for the actual view)
--
CREATE TABLE `active_reservations` (
`reservation_id` int(11)
,`start_date` datetime
,`end_date` datetime
,`equipment_code` varchar(50)
,`equipment_name` varchar(200)
,`user_name` varchar(101)
,`email` varchar(100)
,`status_name` varchar(50)
);

-- --------------------------------------------------------

--
-- Table structure for table `audit_log`
--

CREATE TABLE `audit_log` (
  `log_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `table_name` varchar(50) DEFAULT NULL,
  `record_id` int(11) DEFAULT NULL,
  `old_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`old_values`)),
  `new_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`new_values`)),
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `available_equipment`
-- (See below for the actual view)
--
CREATE TABLE `available_equipment` (
`equipment_id` int(11)
,`equipment_code` varchar(50)
,`name` varchar(200)
,`description` text
,`category_name` varchar(100)
,`brand` varchar(100)
,`model` varchar(100)
,`condition_status` enum('Excellent','Good','Fair','Poor','Needs Repair')
,`location` varchar(100)
);

-- --------------------------------------------------------

--
-- Table structure for table `equipment`
--

CREATE TABLE `equipment` (
  `equipment_id` int(11) NOT NULL,
  `equipment_code` varchar(50) NOT NULL,
  `name` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `category_id` int(11) NOT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `model` varchar(100) DEFAULT NULL,
  `serial_number` varchar(100) DEFAULT NULL,
  `purchase_date` date DEFAULT NULL,
  `purchase_price` decimal(10,2) DEFAULT NULL,
  `current_value` decimal(10,2) DEFAULT NULL,
  `condition_status` enum('Excellent','Good','Fair','Poor','Needs Repair') DEFAULT 'Good',
  `availability_status` enum('Available','Reserved','In Use','Maintenance','Retired') DEFAULT 'Available',
  `location` varchar(100) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `equipment`
--

INSERT INTO `equipment` (`equipment_id`, `equipment_code`, `name`, `description`, `category_id`, `brand`, `model`, `serial_number`, `purchase_date`, `purchase_price`, `current_value`, `condition_status`, `availability_status`, `location`, `notes`, `created_at`, `updated_at`) VALUES
(1, 'AV001', 'Digital SLR Camera', 'Professional digital SLR camera with 24.1MP sensor', 1, 'Canon', 'EOS 90D', 'CN001234567890', '2023-01-15', 1299.99, 1100.00, 'Excellent', 'Available', 'AV Storage Room A', 'Includes battery charger and lens cap', '2025-07-20 04:17:47', '2025-07-20 04:40:18'),
(2, 'AV002', 'Video Projector', '4K Ultra HD projector with 3500 lumens brightness', 1, 'Epson', 'PowerLite 5050UB', 'EP987654321098', '2022-08-20', 2499.99, 2200.00, 'Good', 'Available', 'AV Storage Room B', 'Remote control included', '2025-07-20 04:17:47', '2025-07-20 04:17:47'),
(3, 'AV003', 'Wireless Microphone System', 'Professional wireless microphone with receiver', 1, 'Shure', 'BLX288/PG58', 'SH123456789012', '2023-03-10', 399.99, 350.00, 'Excellent', 'Available', 'AV Storage Room A', 'Two handheld microphones included', '2025-07-20 04:17:47', '2025-07-20 04:17:47'),
(4, 'AV004', 'LED Panel Light', 'Professional LED panel light for photography/video', 1, 'Neewer', 'NL480', 'NW234567890123', '2023-05-22', 159.99, 140.00, 'Good', 'Available', 'Photography Studio', 'Includes light stand', '2025-07-20 04:17:47', '2025-07-20 04:17:47'),
(5, 'CP001', 'Laptop Computer', 'High-performance laptop for general use', 2, 'Dell', 'Latitude 7420', 'DL345678901234', '2023-02-28', 1499.99, 1300.00, 'Excellent', 'Available', 'IT Equipment Room', 'Includes charger and carrying case', '2025-07-20 04:17:47', '2025-07-20 04:17:47'),
(6, 'CP002', 'Tablet Device', '10-inch tablet with keyboard attachment', 2, 'Apple', 'iPad Air', 'AP456789012345', '2023-04-12', 749.99, 650.00, 'Good', 'Reserved', 'IT Equipment Room', 'Keyboard and stylus included', '2025-07-20 04:17:47', '2025-07-20 04:17:47'),
(7, 'CP003', 'Desktop Computer', 'High-end desktop computer for intensive tasks', 2, 'HP', 'Z4 G4 Workstation', 'HP567890123456', '2022-12-05', 2299.99, 2000.00, 'Excellent', 'Available', 'Computer Lab', 'Monitor not included', '2025-07-20 04:17:47', '2025-07-20 04:17:47'),
(8, 'CP004', 'Portable Monitor', '24-inch portable USB-C monitor', 2, 'ASUS', 'ZenScreen MB249C', 'AS678901234567', '2023-06-08', 299.99, 270.00, 'Good', 'Available', 'IT Equipment Room', 'USB-C cable included', '2025-07-20 04:17:47', '2025-07-20 04:17:47'),
(9, 'LB001', 'Digital Microscope', 'High-resolution digital microscope', 3, 'Olympus', 'CX23', 'OL789012345678', '2023-01-30', 1899.99, 1700.00, 'Excellent', 'Available', 'Science Lab A', 'Eyepieces and slides included', '2025-07-20 04:17:47', '2025-07-20 04:17:47'),
(10, 'LB002', 'pH Meter', 'Digital pH meter with calibration solutions', 3, 'Hanna', 'HI-2020', 'HN890123456789', '2022-11-18', 299.99, 250.00, 'Good', 'Available', 'Chemistry Lab', 'Calibration solutions included', '2025-07-20 04:17:47', '2025-07-20 04:17:47'),
(11, 'LB003', 'Electronic Balance', 'Precision electronic balance 0.1mg', 3, 'Ohaus', 'AX224', 'OH901234567890', '2023-07-14', 1599.99, 1450.00, 'Excellent', 'Available', 'Science Lab B', 'Calibration weights included', '2025-07-20 04:17:47', '2025-07-20 04:17:47'),
(12, 'SP001', 'Basketball Set', 'Portable basketball hoop with adjustable height', 4, 'Lifetime', 'Pro Court', 'LT012345678901', '2023-03-25', 399.99, 350.00, 'Good', 'Available', 'Sports Equipment Storage', 'Includes basketball', '2025-07-20 04:17:47', '2025-07-20 04:17:47'),
(13, 'SP002', 'Soccer Goal Set', 'Portable soccer goals (pair)', 4, 'Franklin', 'Competition Goal', 'FR123456789012', '2023-02-14', 199.99, 180.00, 'Good', 'Available', 'Sports Equipment Storage', 'Stakes and net included', '2025-07-20 04:17:47', '2025-07-20 04:17:47'),
(14, 'SP003', 'Tennis Racket Set', 'Professional tennis rackets (set of 4)', 4, 'Wilson', 'Pro Staff', 'WI234567890123', '2022-09-30', 299.99, 250.00, 'Fair', 'Available', 'Sports Equipment Storage', 'Carrying case included', '2025-07-20 04:17:47', '2025-07-20 04:17:47'),
(15, 'TL001', 'Cordless Drill Set', 'Professional cordless drill with bits', 5, 'DeWalt', 'DCD771C2', 'DW345678901234', '2023-04-05', 199.99, 175.00, 'Excellent', 'Available', 'Tool Storage Room', 'Two batteries and charger included', '2025-07-20 04:17:47', '2025-07-20 04:17:47'),
(16, 'TL002', 'Circular Saw', 'Corded circular saw 7.25 inch blade', 5, 'Makita', 'HS7601', 'MK456789012345', '2023-01-20', 149.99, 130.00, 'Good', 'Maintenance', 'Tool Storage Room', 'Blade guard needs adjustment', '2025-07-20 04:17:47', '2025-07-20 04:17:47'),
(17, 'TL003', 'Socket Set', 'Complete socket set with ratchet', 5, 'Craftsman', 'CMMT12049', 'CR567890123456', '2022-10-12', 89.99, 75.00, 'Good', 'Available', 'Tool Storage Room', 'Carrying case included', '2025-07-20 04:17:47', '2025-07-20 04:17:47');

-- --------------------------------------------------------

--
-- Table structure for table `equipment_categories`
--

CREATE TABLE `equipment_categories` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `equipment_categories`
--

INSERT INTO `equipment_categories` (`category_id`, `category_name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Audio/Visual', 'Cameras, microphones, projectors, and AV equipment', '2025-07-20 03:58:49', '2025-07-20 03:58:49'),
(2, 'Computing', 'Laptops, tablets, and computer equipment', '2025-07-20 03:58:49', '2025-07-20 03:58:49'),
(3, 'Laboratory', 'Scientific instruments and laboratory equipment', '2025-07-20 03:58:49', '2025-07-20 03:58:49'),
(4, 'Sports', 'Sports and recreational equipment', '2025-07-20 03:58:49', '2025-07-20 03:58:49'),
(5, 'Tools', 'Hand tools and power tools', '2025-07-20 03:58:49', '2025-07-20 03:58:49'),
(6, 'Vehicles', 'Vehicles and transportation equipment', '2025-07-20 03:58:49', '2025-07-20 03:58:49');

-- --------------------------------------------------------

--
-- Table structure for table `equipment_images`
--

CREATE TABLE `equipment_images` (
  `image_id` int(11) NOT NULL,
  `equipment_id` int(11) NOT NULL,
  `image_path` varchar(500) NOT NULL,
  `image_name` varchar(200) DEFAULT NULL,
  `is_primary` tinyint(1) DEFAULT 0,
  `uploaded_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `equipment_maintenance`
--

CREATE TABLE `equipment_maintenance` (
  `maintenance_id` int(11) NOT NULL,
  `equipment_id` int(11) NOT NULL,
  `maintenance_type` enum('Routine','Repair','Calibration','Inspection') NOT NULL,
  `maintenance_date` date NOT NULL,
  `performed_by` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `cost` decimal(10,2) DEFAULT 0.00,
  `next_maintenance_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `equipment_utilization`
-- (See below for the actual view)
--
CREATE TABLE `equipment_utilization` (
`equipment_id` int(11)
,`equipment_code` varchar(50)
,`name` varchar(200)
,`total_reservations` bigint(21)
,`completed_reservations` decimal(22,0)
,`avg_rental_days` decimal(10,4)
);

-- --------------------------------------------------------

--
-- Table structure for table `reservations`
--

CREATE TABLE `reservations` (
  `reservation_id` int(11) NOT NULL,
  `equipment_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `reservation_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `actual_return_date` datetime DEFAULT NULL,
  `status_id` int(11) NOT NULL,
  `purpose` text DEFAULT NULL,
  `special_instructions` text DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `approval_date` timestamp NULL DEFAULT NULL,
  `total_cost` decimal(10,2) DEFAULT 0.00,
  `deposit_amount` decimal(10,2) DEFAULT 0.00,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reservations`
--

INSERT INTO `reservations` (`reservation_id`, `equipment_id`, `user_id`, `reservation_date`, `start_date`, `end_date`, `actual_return_date`, `status_id`, `purpose`, `special_instructions`, `approved_by`, `approval_date`, `total_cost`, `deposit_amount`, `notes`, `created_at`, `updated_at`) VALUES
(8, 1, 1, '2025-07-20 04:39:59', '2025-07-25 09:00:00', '2025-07-30 17:00:00', NULL, 5, 'Photography project for marketing campaign', 'Handle with care, equipment needed for outdoor shoot', 1, '2025-07-20 04:40:15', 0.00, 0.00, NULL, '2025-07-20 04:39:59', '2025-07-20 04:40:18');

-- --------------------------------------------------------

--
-- Table structure for table `reservation_statuses`
--

CREATE TABLE `reservation_statuses` (
  `status_id` int(11) NOT NULL,
  `status_name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reservation_statuses`
--

INSERT INTO `reservation_statuses` (`status_id`, `status_name`, `description`, `created_at`) VALUES
(1, 'Pending', 'Reservation request pending approval', '2025-07-20 03:58:49'),
(2, 'Approved', 'Reservation approved and confirmed', '2025-07-20 03:58:49'),
(3, 'Active', 'Equipment currently in use', '2025-07-20 03:58:49'),
(4, 'Completed', 'Reservation completed successfully', '2025-07-20 03:58:49'),
(5, 'Cancelled', 'Reservation cancelled', '2025-07-20 03:58:49'),
(6, 'Overdue', 'Equipment not returned on time', '2025-07-20 03:58:49');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role_id` int(11) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `email_verified` tinyint(1) DEFAULT 0,
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password_hash`, `first_name`, `last_name`, `phone`, `role_id`, `is_active`, `email_verified`, `last_login`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin@facility.com', '$2y$10$example_hash_change_this', 'System', 'Administrator', NULL, 1, 1, 1, NULL, '2025-07-20 03:58:49', '2025-07-20 03:58:49'),
(12, 'staff1', 'staff1@facility.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Smith', '555-0002', 2, 1, 1, NULL, '2025-07-20 04:17:47', '2025-07-20 04:17:47'),
(13, 'staff2', 'staff2@facility.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sarah', 'Johnson', '555-0003', 2, 1, 1, NULL, '2025-07-20 04:17:47', '2025-07-20 04:17:47'),
(14, 'jdoe', 'john.doe@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Doe', '555-0101', 3, 1, 1, NULL, '2025-07-20 04:17:47', '2025-07-20 04:17:47'),
(15, 'mjohnson', 'mary.johnson@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mary', 'Johnson', '555-0102', 3, 1, 1, NULL, '2025-07-20 04:17:47', '2025-07-20 04:17:47'),
(16, 'bsmith', 'bob.smith@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Bob', 'Smith', '555-0103', 3, 1, 1, NULL, '2025-07-20 04:17:47', '2025-07-20 04:17:47'),
(17, 'alee', 'alice.lee@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Alice', 'Lee', '555-0104', 3, 1, 1, NULL, '2025-07-20 04:17:47', '2025-07-20 04:17:47'),
(18, 'dwilson', 'david.wilson@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'David', 'Wilson', '555-0105', 3, 1, 1, NULL, '2025-07-20 04:17:47', '2025-07-20 04:17:47'),
(19, 'rbrown', 'rachel.brown@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Rachel', 'Brown', '555-0106', 3, 1, 1, NULL, '2025-07-20 04:17:47', '2025-07-20 04:17:47'),
(20, 'mgarcia', 'miguel.garcia@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Miguel', 'Garcia', '555-0107', 3, 1, 1, NULL, '2025-07-20 04:17:47', '2025-07-20 04:17:47');

-- --------------------------------------------------------

--
-- Stand-in structure for view `user_reservation_history`
-- (See below for the actual view)
--
CREATE TABLE `user_reservation_history` (
`reservation_id` int(11)
,`user_id` int(11)
,`user_name` varchar(101)
,`equipment_code` varchar(50)
,`equipment_name` varchar(200)
,`start_date` datetime
,`end_date` datetime
,`actual_return_date` datetime
,`status_name` varchar(50)
,`total_cost` decimal(10,2)
);

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `role_id` int(11) NOT NULL,
  `role_name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`role_id`, `role_name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Admin', 'System administrator with full access', '2025-07-20 03:58:49', '2025-07-20 03:58:49'),
(2, 'Staff', 'Staff member who can manage reservations and equipment', '2025-07-20 03:58:49', '2025-07-20 03:58:49'),
(3, 'User', 'Regular user who can make reservations', '2025-07-20 03:58:49', '2025-07-20 03:58:49');

-- --------------------------------------------------------

--
-- Table structure for table `user_sessions`
--

CREATE TABLE `user_sessions` (
  `session_id` varchar(128) NOT NULL,
  `user_id` int(11) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `expires_at` datetime NOT NULL,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure for view `active_reservations`
--
DROP TABLE IF EXISTS `active_reservations`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `active_reservations`  AS SELECT `r`.`reservation_id` AS `reservation_id`, `r`.`start_date` AS `start_date`, `r`.`end_date` AS `end_date`, `e`.`equipment_code` AS `equipment_code`, `e`.`name` AS `equipment_name`, concat(`u`.`first_name`,' ',`u`.`last_name`) AS `user_name`, `u`.`email` AS `email`, `rs`.`status_name` AS `status_name` FROM (((`reservations` `r` join `equipment` `e` on(`r`.`equipment_id` = `e`.`equipment_id`)) join `users` `u` on(`r`.`user_id` = `u`.`user_id`)) join `reservation_statuses` `rs` on(`r`.`status_id` = `rs`.`status_id`)) WHERE `rs`.`status_name` in ('Approved','Active') ;

-- --------------------------------------------------------

--
-- Structure for view `available_equipment`
--
DROP TABLE IF EXISTS `available_equipment`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `available_equipment`  AS SELECT `e`.`equipment_id` AS `equipment_id`, `e`.`equipment_code` AS `equipment_code`, `e`.`name` AS `name`, `e`.`description` AS `description`, `c`.`category_name` AS `category_name`, `e`.`brand` AS `brand`, `e`.`model` AS `model`, `e`.`condition_status` AS `condition_status`, `e`.`location` AS `location` FROM (`equipment` `e` join `equipment_categories` `c` on(`e`.`category_id` = `c`.`category_id`)) WHERE `e`.`availability_status` = 'Available' AND `e`.`condition_status` not in ('Poor','Needs Repair') ;

-- --------------------------------------------------------

--
-- Structure for view `equipment_utilization`
--
DROP TABLE IF EXISTS `equipment_utilization`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `equipment_utilization`  AS SELECT `e`.`equipment_id` AS `equipment_id`, `e`.`equipment_code` AS `equipment_code`, `e`.`name` AS `name`, count(`r`.`reservation_id`) AS `total_reservations`, sum(case when `rs`.`status_name` = 'Completed' then 1 else 0 end) AS `completed_reservations`, avg(to_days(`r`.`actual_return_date`) - to_days(`r`.`start_date`)) AS `avg_rental_days` FROM ((`equipment` `e` left join `reservations` `r` on(`e`.`equipment_id` = `r`.`equipment_id`)) left join `reservation_statuses` `rs` on(`r`.`status_id` = `rs`.`status_id`)) GROUP BY `e`.`equipment_id`, `e`.`equipment_code`, `e`.`name` ;

-- --------------------------------------------------------

--
-- Structure for view `user_reservation_history`
--
DROP TABLE IF EXISTS `user_reservation_history`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `user_reservation_history`  AS SELECT `r`.`reservation_id` AS `reservation_id`, `r`.`user_id` AS `user_id`, concat(`u`.`first_name`,' ',`u`.`last_name`) AS `user_name`, `e`.`equipment_code` AS `equipment_code`, `e`.`name` AS `equipment_name`, `r`.`start_date` AS `start_date`, `r`.`end_date` AS `end_date`, `r`.`actual_return_date` AS `actual_return_date`, `rs`.`status_name` AS `status_name`, `r`.`total_cost` AS `total_cost` FROM (((`reservations` `r` join `equipment` `e` on(`r`.`equipment_id` = `e`.`equipment_id`)) join `users` `u` on(`r`.`user_id` = `u`.`user_id`)) join `reservation_statuses` `rs` on(`r`.`status_id` = `rs`.`status_id`)) ORDER BY `r`.`reservation_date` DESC ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `audit_log`
--
ALTER TABLE `audit_log`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `idx_audit_user` (`user_id`),
  ADD KEY `idx_audit_date` (`created_at`),
  ADD KEY `idx_audit_action` (`action`);

--
-- Indexes for table `equipment`
--
ALTER TABLE `equipment`
  ADD PRIMARY KEY (`equipment_id`),
  ADD UNIQUE KEY `equipment_code` (`equipment_code`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `idx_equipment_code` (`equipment_code`),
  ADD KEY `idx_availability_status` (`availability_status`),
  ADD KEY `idx_equipment_name` (`name`);

--
-- Indexes for table `equipment_categories`
--
ALTER TABLE `equipment_categories`
  ADD PRIMARY KEY (`category_id`),
  ADD UNIQUE KEY `category_name` (`category_name`);

--
-- Indexes for table `equipment_images`
--
ALTER TABLE `equipment_images`
  ADD PRIMARY KEY (`image_id`),
  ADD KEY `uploaded_by` (`uploaded_by`),
  ADD KEY `idx_equipment_images` (`equipment_id`);

--
-- Indexes for table `equipment_maintenance`
--
ALTER TABLE `equipment_maintenance`
  ADD PRIMARY KEY (`maintenance_id`),
  ADD KEY `equipment_id` (`equipment_id`),
  ADD KEY `idx_maintenance_date` (`maintenance_date`),
  ADD KEY `idx_next_maintenance` (`next_maintenance_date`);

--
-- Indexes for table `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`reservation_id`),
  ADD KEY `status_id` (`status_id`),
  ADD KEY `approved_by` (`approved_by`),
  ADD KEY `idx_reservation_dates` (`start_date`,`end_date`),
  ADD KEY `idx_user_reservations` (`user_id`),
  ADD KEY `idx_equipment_reservations` (`equipment_id`),
  ADD KEY `idx_reservations_dates` (`start_date`,`end_date`,`status_id`);

--
-- Indexes for table `reservation_statuses`
--
ALTER TABLE `reservation_statuses`
  ADD PRIMARY KEY (`status_id`),
  ADD UNIQUE KEY `status_name` (`status_name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`),
  ADD KEY `idx_users_email` (`email`),
  ADD KEY `idx_users_username` (`username`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`role_id`),
  ADD UNIQUE KEY `role_name` (`role_name`);

--
-- Indexes for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD PRIMARY KEY (`session_id`),
  ADD KEY `idx_user_sessions` (`user_id`),
  ADD KEY `idx_session_expiry` (`expires_at`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `audit_log`
--
ALTER TABLE `audit_log`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `equipment`
--
ALTER TABLE `equipment`
  MODIFY `equipment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `equipment_categories`
--
ALTER TABLE `equipment_categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `equipment_images`
--
ALTER TABLE `equipment_images`
  MODIFY `image_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `equipment_maintenance`
--
ALTER TABLE `equipment_maintenance`
  MODIFY `maintenance_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reservations`
--
ALTER TABLE `reservations`
  MODIFY `reservation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `reservation_statuses`
--
ALTER TABLE `reservation_statuses`
  MODIFY `status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `user_roles`
--
ALTER TABLE `user_roles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `audit_log`
--
ALTER TABLE `audit_log`
  ADD CONSTRAINT `audit_log_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `equipment`
--
ALTER TABLE `equipment`
  ADD CONSTRAINT `equipment_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `equipment_categories` (`category_id`);

--
-- Constraints for table `equipment_images`
--
ALTER TABLE `equipment_images`
  ADD CONSTRAINT `equipment_images_ibfk_1` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`equipment_id`),
  ADD CONSTRAINT `equipment_images_ibfk_2` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `equipment_maintenance`
--
ALTER TABLE `equipment_maintenance`
  ADD CONSTRAINT `equipment_maintenance_ibfk_1` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`equipment_id`);

--
-- Constraints for table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`equipment_id`),
  ADD CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `reservations_ibfk_3` FOREIGN KEY (`status_id`) REFERENCES `reservation_statuses` (`status_id`),
  ADD CONSTRAINT `reservations_ibfk_4` FOREIGN KEY (`approved_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `user_roles` (`role_id`);

--
-- Constraints for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD CONSTRAINT `user_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
