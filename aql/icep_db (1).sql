-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 20, 2024 at 11:34 AM
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
  `course_name` varchar(20) DEFAULT NULL,
  `open` bit(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `course`
--

INSERT INTO `course` (`course_id`, `course_name`, `open`) VALUES
('DPIF20', 'INFORMATICS', b'1'),
('DPIT20', 'INFORMATION TECHNOLO', b'1'),
('DPRS20', 'COMPUTER SCIENCE', b'1');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
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
  `status` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`student_id`, `firstname`, `lastname`, `email`, `idno`, `dob`, `phoneNo`, `gender`, `outstanding`, `houseNo`, `streetName`, `town`, `code`, `cv_file`, `recommendation_file`, `course_id`, `campus_id`, `status`) VALUES
('12121', 'firstname', 'lastname', 'email@email.com', '195632587', '2000-01-01', '125545454', 'male', b'1', '2145', 'streetName', 'town', '0123', 'jkdjbkdbjdjkd.pdf', 'jdhduid.pdf', 'DPIF20', 'tut-ema', 'Pending'),
('1212121', 'firstname', 'lastname', 'email@email.com', '195632587', '2000-01-01', '125545454', 'male', b'1', '2145', 'streetName', 'town', '0123', 'jkdjbkdbjdjkd.pdf', 'jdhduid.pdf', 'DPIF20', 'tut-ema', 'Pending'),
('213654789', 'Joel', 'kekana', 'kekana@gmail.com', '1021025055236', '0000-00-00', '0123456789', 'Male', b'0', '3698', 'tswelopele', 'Sosha', '0124', 'https://s3.eu-west-1.amazonaws.com/www.icep.co.za/CVs/1721216910374Prospectus_2024.pdf', '', 'DPIF20', 'tut-ema', 'Pending');

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
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`student_id`),
  ADD KEY `course_id` (`course_id`),
  ADD KEY `campus_id` (`campus_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `student_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`),
  ADD CONSTRAINT `student_ibfk_2` FOREIGN KEY (`campus_id`) REFERENCES `campus` (`campus_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
