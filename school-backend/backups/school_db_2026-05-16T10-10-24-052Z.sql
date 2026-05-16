-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: school_db
-- ------------------------------------------------------
-- Server version	8.0.45-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admissions`
--

DROP TABLE IF EXISTS `admissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `gender` varchar(20) NOT NULL,
  `dateOfBirth` date NOT NULL,
  `address` text NOT NULL,
  `classId` int NOT NULL,
  `section` varchar(20) NOT NULL,
  `fatherName` varchar(100) NOT NULL,
  `motherName` varchar(100) NOT NULL,
  `status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `classId` (`classId`),
  CONSTRAINT `admissions_ibfk_1` FOREIGN KEY (`classId`) REFERENCES `classes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admissions`
--

LOCK TABLES `admissions` WRITE;
/*!40000 ALTER TABLE `admissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `admissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `announcements`
--

DROP TABLE IF EXISTS `announcements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announcements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) DEFAULT NULL,
  `content` text,
  `target_role` enum('all','teacher','student') DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `announcements_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcements`
--

LOCK TABLES `announcements` WRITE;
/*!40000 ALTER TABLE `announcements` DISABLE KEYS */;
/*!40000 ALTER TABLE `announcements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assignment_submissions`
--

DROP TABLE IF EXISTS `assignment_submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignment_submissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `assignment_id` int DEFAULT NULL,
  `student_id` int DEFAULT NULL,
  `submission_text` text,
  `file_url` varchar(255) DEFAULT NULL,
  `submitted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `marks_given` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `assignment_id` (`assignment_id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `assignment_submissions_ibfk_1` FOREIGN KEY (`assignment_id`) REFERENCES `assignments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `assignment_submissions_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignment_submissions`
--

LOCK TABLES `assignment_submissions` WRITE;
/*!40000 ALTER TABLE `assignment_submissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `assignment_submissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assignments`
--

DROP TABLE IF EXISTS `assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) DEFAULT NULL,
  `description` text,
  `class_id` int DEFAULT NULL,
  `teacher_id` int DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `file_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `class_id` (`class_id`),
  KEY `teacher_id` (`teacher_id`),
  CONSTRAINT `assignments_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `assignments_ibfk_2` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignments`
--

LOCK TABLES `assignments` WRITE;
/*!40000 ALTER TABLE `assignments` DISABLE KEYS */;
/*!40000 ALTER TABLE `assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int DEFAULT NULL,
  `date` date DEFAULT NULL,
  `status` enum('Present','Absent') DEFAULT NULL,
  `marked_by` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  KEY `marked_by` (`marked_by`),
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `attendance_ibfk_2` FOREIGN KEY (`marked_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `class_subjects`
--

DROP TABLE IF EXISTS `class_subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `class_subjects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `class_id` int DEFAULT NULL,
  `subject_id` int DEFAULT NULL,
  `teacher_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `class_id` (`class_id`),
  KEY `subject_id` (`subject_id`),
  KEY `teacher_id` (`teacher_id`),
  CONSTRAINT `class_subjects_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `class_subjects_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `class_subjects_ibfk_3` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `class_subjects`
--

LOCK TABLES `class_subjects` WRITE;
/*!40000 ALTER TABLE `class_subjects` DISABLE KEYS */;
/*!40000 ALTER TABLE `class_subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classes`
--

DROP TABLE IF EXISTS `classes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `class_name` varchar(50) DEFAULT NULL,
  `section` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classes`
--

LOCK TABLES `classes` WRITE;
/*!40000 ALTER TABLE `classes` DISABLE KEYS */;
/*!40000 ALTER TABLE `classes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exams`
--

DROP TABLE IF EXISTS `exams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exams` (
  `id` int NOT NULL AUTO_INCREMENT,
  `exam_name` varchar(100) DEFAULT NULL,
  `class_id` int DEFAULT NULL,
  `exam_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `class_id` (`class_id`),
  CONSTRAINT `exams_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exams`
--

LOCK TABLES `exams` WRITE;
/*!40000 ALTER TABLE `exams` DISABLE KEYS */;
/*!40000 ALTER TABLE `exams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fees`
--

DROP TABLE IF EXISTS `fees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `due_date` date NOT NULL,
  `payment_date` date DEFAULT NULL,
  `status` enum('pending','paid','overdue') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `fees_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fees`
--

LOCK TABLES `fees` WRITE;
/*!40000 ALTER TABLE `fees` DISABLE KEYS */;
INSERT INTO `fees` VALUES (1,1,5000.00,'2026-05-30','2026-06-07','paid','2026-05-13 11:10:45'),(2,8,10000.00,'2026-05-31','2026-06-02','paid','2026-05-13 12:22:23'),(3,9,70000.00,'2026-05-23','2026-06-04','paid','2026-05-13 12:31:37');
/*!40000 ALTER TABLE `fees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `marks`
--

DROP TABLE IF EXISTS `marks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `marks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `exam_id` int DEFAULT NULL,
  `student_id` int DEFAULT NULL,
  `subject_id` int DEFAULT NULL,
  `marks` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `exam_id` (`exam_id`),
  KEY `student_id` (`student_id`),
  KEY `subject_id` (`subject_id`),
  CONSTRAINT `marks_ibfk_1` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`) ON DELETE CASCADE,
  CONSTRAINT `marks_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  CONSTRAINT `marks_ibfk_3` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `marks`
--

LOCK TABLES `marks` WRITE;
/*!40000 ALTER TABLE `marks` DISABLE KEYS */;
/*!40000 ALTER TABLE `marks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sender_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `recipient_group` varchar(50) NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `sender_id` (`sender_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,2,'Notification For Student','Coming Saturday and sunday School will holiday','students','active','2026-05-13 07:52:15'),(2,4,'New Announcement','Coming friday all students haveing parents meeting .Without absent all student come with student \nTeachers kindle inform to staudent ','all','active','2026-05-14 04:40:08'),(3,2,'Today Notification','Coming Monday parents meet','all','active','2026-05-16 08:35:13'),(4,2,'Today Notification','Coming Monday parents meet','all','active','2026-05-16 08:38:13'),(5,2,'Today Notification','Coming Monday parents meet','all','active','2026-05-16 08:53:24'),(6,2,'Today Notification','Coming Monday parents meet','all','active','2026-05-16 09:11:27'),(7,2,'Today Notification','Coming Monday parents meet','all','active','2026-05-16 09:16:07');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int DEFAULT NULL,
  `classId` int DEFAULT NULL,
  `rollNumber` varchar(20) DEFAULT NULL,
  `parent_name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `section` varchar(10) DEFAULT NULL,
  `dateOfBirth` date DEFAULT NULL,
  `admissionDate` date DEFAULT NULL,
  `guardianInfo` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`userId`),
  CONSTRAINT `students_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (11,3,NULL,'105',NULL,NULL,'F','2026-05-22','2026-05-28','7373806463','2026-05-16 03:55:56');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subjects`
--

DROP TABLE IF EXISTS `subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subjects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `subject_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subjects`
--

LOCK TABLES `subjects` WRITE;
/*!40000 ALTER TABLE `subjects` DISABLE KEYS */;
/*!40000 ALTER TABLE `subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teachers`
--

DROP TABLE IF EXISTS `teachers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teachers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `teacherId` varchar(50) NOT NULL,
  `teacherName` varchar(100) NOT NULL,
  `subject` varchar(100) NOT NULL,
  `user_id` int DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `qualification` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `teachers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teachers`
--

LOCK TABLES `teachers` WRITE;
/*!40000 ALTER TABLE `teachers` DISABLE KEYS */;
INSERT INTO `teachers` VALUES (2,'4','vinoth','Diploma',NULL,'Mechanical','Diploma'),(3,'4','Malar','Farmer',2,'Agriculture','Malaikottalam'),(8,'4','jane doe','mathematics',1,'science','Ph.D in physics'),(15,'1001','James','Mathematics',1,'Sciences','Ph.D. in Physics'),(16,'1001','James','Mathematics',1,'Sciences','Ph.D. in Physics'),(17,'1001','James','Mathematics',1,'Sciences','Ph.D. in Physics'),(18,'1001','James','Mathematics',1,'Sciences','Ph.D. in Physics'),(19,'1001','James','Mathematics',1,'Sciences','Ph.D. in Physics'),(20,'1001','James','Mathematics',1,'Sciences','Ph.D. in Physics'),(21,'1001','James','Mathematics',1,'Sciences','Ph.D. in Physics'),(22,'1001','James','Mathematics',1,'Sciences','Ph.D. in Physics'),(23,'1001','James','Mathematics',1,'Sciences','Ph.D. in Physics'),(24,'1001','James','Mathematics',1,'Sciences','Ph.D. in Physics'),(25,'1001','James','Mathematics',1,'Sciences','Ph.D. in Physics'),(26,'1001','James','Mathematics',1,'Sciences','Ph.D. in Physics');
/*!40000 ALTER TABLE `teachers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `timetable`
--

DROP TABLE IF EXISTS `timetable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `timetable` (
  `id` int NOT NULL AUTO_INCREMENT,
  `class_id` int DEFAULT NULL,
  `subject_id` int DEFAULT NULL,
  `teacher_id` int DEFAULT NULL,
  `day_of_week` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday') DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `class_id` (`class_id`),
  KEY `subject_id` (`subject_id`),
  KEY `teacher_id` (`teacher_id`),
  CONSTRAINT `timetable_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `timetable_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `timetable_ibfk_3` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timetable`
--

LOCK TABLES `timetable` WRITE;
/*!40000 ALTER TABLE `timetable` DISABLE KEYS */;
/*!40000 ALTER TABLE `timetable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('admin','teacher','student') DEFAULT NULL,
  `refresh_token` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'ganesh','ganesh@gmail.com','$2b$10$mvRsjwISgHfU0023pu.PjeJxLH1wf.VMMnqbZRRoLOBMo/80wBolW','student','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc4OTA4NTE2LCJleHAiOjE3Nzk1MTMzMTZ9.LT7OKyIulQ-xFyUgjjsRUWib3n9VUF2O5KOHTdgx3vE','2026-05-11 05:42:28'),(2,'james','james@gmail.com','$2b$10$OVtMmGEy8n/YlOtzAosumeC7wxmskNB.Gwrl60HX.lqmfunjb0Ciq','teacher','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzc4OTIyOTIxLCJleHAiOjE3Nzk1Mjc3MjF9.TIb1aS5mWQF-B9BSvuu92umBsvWjeIIUQAZyrtHX4hM','2026-05-11 11:35:22'),(3,'System Admin','admin@school.com','$2b$10$YljHSHmb/Fic263PUerqnOuYBQ19i8eg241Bjl9FxHn5ifiI5Yj5O','admin','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzc4NTYyNDk2LCJleHAiOjE3NzkxNjcyOTZ9.o665aoPOqK8yD6H2ieHgv5oiwDHJ4jp92kZtUFXbtFE','2026-05-12 05:05:45'),(4,'philrobo','philrobo@gmail.com','$2b$10$wEDwGiB6hFM8R1zGCyDE7udnu6OKKa5N1s29H2J1IqOZpyedVNDjm','admin',NULL,'2026-05-12 05:15:22'),(5,'sam','sam@gmail.com','$2b$10$tEdnmVZtZSPQ81i9Qdln9.6sA2Zn0ueiUHufWpevxcfcvYHPRCiuK','student',NULL,'2026-05-13 12:26:35'),(6,'Student User','student@gmail.com','$2b$10$jZVEX0V66y4t8UcpYS6tl.M5uC7uZgg2uQYlWPJzzat6dyCqhw4s2','student',NULL,'2026-05-13 12:58:54'),(7,'Ganesh','ganesh123@test.com','$2b$10$FcSOhp7cv.9SBhtfNaJ4t.V6NvXxErE4Vu6/UTK1SfVtE0Un/81wK','teacher',NULL,'2026-05-15 07:23:45'),(8,'Ganesh','ganesh1778830155070@test.com','$2b$10$2aiJDIGRuuSAHcRYQUqr4OUfsVR4vlc6eBjiv4X013u6RS1Qqjq36','teacher',NULL,'2026-05-15 07:29:15'),(9,'Ganesh','ganesh1778830157829@test.com','$2b$10$cAcOLCkfKAqKDdJAUo4hB.VfQkyvTSkXHuDCmTOZlD7PmO46EN0AO','teacher',NULL,'2026-05-15 07:29:18'),(10,'Ganesh','ganesh1778830160494@test.com','$2b$10$3qTtyQVz/v2NvrHeKZPQZOeeTxeXo.vFHNoZ9ArXH731GoN6YC4JK','teacher',NULL,'2026-05-15 07:29:21'),(11,'Ganesh','ganesh1778843228620@test.com','$2b$10$HP/w/yIMaAXSjcGn8lahue3JJQPbuQiTT2.fKU88ojs3Smibghv4u','teacher',NULL,'2026-05-15 11:07:08'),(12,'Ganesh','ganesh1778843237527@test.com','$2b$10$p1jY9eLd2sELb6rf6oI9zODIDs.6rKoQFZGgdnZoMqR.mJDXWRt1q','teacher',NULL,'2026-05-15 11:07:18'),(13,'Ganesh','ganesh1778843249770@test.com','$2b$10$1uGseULHmc7mxnBDqz8YYOhtmIN2sEK5jWuv7DH72EWsAp03JP3ca','teacher',NULL,'2026-05-15 11:07:30'),(14,'Ganesh','ganesh1778847038673@test.com','$2b$10$MJA.zOGumy./lKc665kwXuAmPLitDEnAd3iDdVtoErDeFvHQxJlhy','teacher',NULL,'2026-05-15 12:10:39'),(15,'Ganesh','ganesh1778847050950@test.com','$2b$10$T3U9KOaOat3vbp1q.PCvG.XVpiRCqbvafufkMUZ7BRFBfTeGgXuAi','teacher',NULL,'2026-05-15 12:10:51'),(16,'Ganesh','ganesh1778847063763@test.com','$2b$10$2sMlpDC8S48UksCofGPRZumRpeKP7Aj4zrZ9zMRNXr.sXG7rc6q4K','teacher',NULL,'2026-05-15 12:11:04'),(17,'Ganesh','ganesh1778847361203@test.com','$2b$10$uJvvbteUnNAuJyTua8IuLuDYW.vFa5dUmf79zt8Mb8YC8xF2nPj0K','teacher',NULL,'2026-05-15 12:16:01'),(18,'Ganesh','ganesh1778847374141@test.com','$2b$10$85DZDEAQYJr2TD1WZhBER.j0Nv1BshRiG52s.44coQ8jUspgOf.uO','teacher',NULL,'2026-05-15 12:16:14'),(19,'Ganesh','ganesh1778847385448@test.com','$2b$10$x7bpyxpn7SB5dy72eJDxz.fVOECVEqE/OA3IItygIvPuuL3qkLS86','teacher',NULL,'2026-05-15 12:16:26'),(20,'Ganesh','ganesh1778905643353@test.com','$2b$10$mvlTgD5dNTXX0C.R3RlzMuZxWRCmYVPOpHWhcUdDC6d/IhM/QMHkS','teacher',NULL,'2026-05-16 04:27:23'),(21,'Ganesh','ganesh1778905659374@test.com','$2b$10$HnC.ZyKBgN.Mmkqyx5zAgeyLW65TSDQOVGfzvNVDS.sV6KdOVGoa2','teacher',NULL,'2026-05-16 04:27:39'),(22,'Ganesh','ganesh1778905680543@test.com','$2b$10$eOrGHYM.BfyK1jghnaVXa.HIECMxwQPjGkFSsjDn/mjqFhTSrpRjS','teacher',NULL,'2026-05-16 04:28:01'),(23,'Ganesh','ganesh1778908489402@test.com','$2b$10$R8wOuTTnapUTJQ7kzS24MuoLzy7mj6ODpvLUwdtA4SnqTGtF8VklO','teacher',NULL,'2026-05-16 05:14:49'),(24,'Ganesh','ganesh1778908504103@test.com','$2b$10$G2lpGDrCeOp.D3iOPO5.cuXzZt4ZVQVhPpVaa1KSd27UyOs9vZzLq','teacher',NULL,'2026-05-16 05:15:04'),(25,'Ganesh','ganesh1778908518484@test.com','$2b$10$SznFd.LtVL2LpoT9Z5WuYeNJUFVVb/OXMBFq2UhHul6c9Ce4sak16','teacher',NULL,'2026-05-16 05:15:19'),(26,'Ganesh','ganesh1778908790717@test.com','$2b$10$pTmqPHWEF0CRvkPjxvsfr.EkLTp29eBPSP0c2oySZJrvBrFUaRMCy','teacher',NULL,'2026-05-16 05:19:51'),(27,'Ganesh','ganesh1778909280434@test.com','$2b$10$Y8zbbc0NYWsedqAedMpShulFDvQIrMVxYe9y4ClBUy8GNWHThrCjS','teacher',NULL,'2026-05-16 05:28:00'),(28,'Ganesh','ganesh1778909402501@test.com','$2b$10$tYjbHDph2Zo2pIndEQ00cObYRwADV.31hHwuKwbDxGKKaADhCBBC2','teacher',NULL,'2026-05-16 05:30:02');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-16 15:40:24
