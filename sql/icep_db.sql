-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 21, 2025 at 03:26 PM
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
-- Database: `icep_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `campus`
--

CREATE TABLE `campus` (
  `campus_id` varchar(10) NOT NULL,
  `campus_name` varchar(20) DEFAULT NULL,
  `open` bit(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `campus`
--

INSERT INTO `campus` (`campus_id`, `campus_name`, `open`) VALUES
('tut-ema', 'eMalahleni', b'1'),
('tut-plk', 'Polokwane', b'1'),
('tut-sosh', 'Soshanguve', b'1');

-- --------------------------------------------------------

--
-- Table structure for table `course`
--

CREATE TABLE `course` (
  `course_id` varchar(10) NOT NULL,
  `course_name` varchar(100) DEFAULT NULL,
  `open` bit(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `course`
--

INSERT INTO `course` (`course_id`, `course_name`, `open`) VALUES
('DPIF20', 'INFORMATICS', b'1'),
('DPIT20', 'INFORMATION TECHNOLOGY', b'1'),
('DPRS20', 'COMPUTER SCIENCE', b'1');

-- --------------------------------------------------------

--
-- Table structure for table `post`
--

CREATE TABLE `post` (
  `post_id` int(11) NOT NULL,
  `postname` varchar(100) DEFAULT NULL,
  `open_date` date DEFAULT NULL,
  `closing_date` date DEFAULT NULL,
  `post_ref` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `post`
--

INSERT INTO `post` (`post_id`, `postname`, `open_date`, `closing_date`, `post_ref`) VALUES
(1, 'ICEP Internship 2025', '2025-05-21', '2025-05-28', '15053688-2f68-4b24-aaf6-46969f75dcef');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `id` int(11) NOT NULL,
  `student_id` varchar(10) NOT NULL,
  `firstname` varchar(50) DEFAULT NULL,
  `lastname` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `idno` varchar(15) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `phoneNo` varchar(13) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `outstanding` bit(1) DEFAULT NULL,
  `houseNo` varchar(10) DEFAULT NULL,
  `streetName` varchar(50) DEFAULT NULL,
  `town` varchar(50) DEFAULT NULL,
  `code` varchar(5) DEFAULT NULL,
  `cv_file` varchar(200) DEFAULT NULL,
  `recommendation_file` varchar(200) DEFAULT NULL,
  `course_id` varchar(10) DEFAULT NULL,
  `campus_id` varchar(10) DEFAULT NULL,
  `status` varchar(20) NOT NULL,
  `post_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`id`, `student_id`, `firstname`, `lastname`, `email`, `idno`, `dob`, `phoneNo`, `gender`, `outstanding`, `houseNo`, `streetName`, `town`, `code`, `cv_file`, `recommendation_file`, `course_id`, `campus_id`, `status`, `post_id`) VALUES
(1, '12121', 'firstname', 'lastname', 'email@email.com', '195632587', '2000-01-01', '125545454', 'male', b'1', '2145', 'streetName', 'town', '0123', 'jkdjbkdbjdjkd.pdf', 'jdhduid.pdf', 'DPIF20', 'tut-ema', 'Pending', NULL),
(2, '1212121', 'firstname', 'lastname', 'email@email.com', '195632587', '2000-01-01', '125545454', 'male', b'1', '2145', 'streetName', 'town', '0123', 'jkdjbkdbjdjkd.pdf', 'jdhduid.pdf', 'DPIF20', 'tut-ema', 'Pending', 1),
(3, '213654789', 'Joel', 'kekana', 'kekana@gmail.com', '1021025055236', '0000-00-00', '0123456789', 'Male', b'0', '3698', 'tswelopele', 'Sosha', '0124', 'https://s3.eu-west-1.amazonaws.com/www.icep.co.za/CVs/1721216910374Prospectus_2024.pdf', '', 'DPIF20', 'tut-ema', 'Pending', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `campus`
--
ALTER TABLE `campus`
  ADD PRIMARY KEY (`campus_id`);

--
-- Indexes for table `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`course_id`);

--
-- Indexes for table `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`post_id`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `campus_id` (`campus_id`),
  ADD KEY `post_student` (`post_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `post`
--
ALTER TABLE `post`
  MODIFY `post_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `post_student` FOREIGN KEY (`post_id`) REFERENCES `post` (`post_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
