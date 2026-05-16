CREATE DATABASE IF NOT EXISTS school_v2_db;
USE school_v2_db;

CREATE TABLE IF NOT EXISTS users (
   id INT PRIMARY KEY AUTO_INCREMENT,
   name VARCHAR(100),
   email VARCHAR(100) UNIQUE,
   password VARCHAR(255),
   role ENUM('admin','teacher','student'),
   refresh_token TEXT DEFAULT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
   id INT PRIMARY KEY AUTO_INCREMENT,
   userId INT,
   section VARCHAR(10),
   rollNumber VARCHAR(20),
   dateOfBirth DATE,
   admissionDate DATE,
   guardianInfo TEXT,
   -- New Fields in v2 with Defaults
   phone VARCHAR(20) DEFAULT 'Not Provided',
   gender VARCHAR(20) DEFAULT 'Not Specified',
   address TEXT DEFAULT NULL,
   fatherName VARCHAR(100) DEFAULT 'Not Provided',
   motherName VARCHAR(100) DEFAULT 'Not Provided',
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS teachers (
   id INT PRIMARY KEY AUTO_INCREMENT,
   teacherId VARCHAR(50) NOT NULL,
   teacherName VARCHAR(100) NOT NULL,
   subject VARCHAR(100) NOT NULL,
   user_id INT,
   department VARCHAR(100),
   qualification VARCHAR(100),
   -- New Fields in v2
   phone VARCHAR(20) DEFAULT 'Not Provided',
   email VARCHAR(100) DEFAULT NULL,
   address TEXT DEFAULT NULL,
   FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS classes (
   id INT PRIMARY KEY AUTO_INCREMENT,
   class_name VARCHAR(50),
   section VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS subjects (
   id INT PRIMARY KEY AUTO_INCREMENT,
   subject_name VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS class_subjects (
   id INT PRIMARY KEY AUTO_INCREMENT,
   class_id INT,
   subject_id INT,
   teacher_id INT,
   FOREIGN KEY(class_id) REFERENCES classes(id) ON DELETE CASCADE,
   FOREIGN KEY(subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
   FOREIGN KEY(teacher_id) REFERENCES teachers(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS timetable (
   id INT PRIMARY KEY AUTO_INCREMENT,
   class_id INT,
   subject_id INT,
   teacher_id INT,
   day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
   start_time TIME,
   end_time TIME,
   FOREIGN KEY(class_id) REFERENCES classes(id) ON DELETE CASCADE,
   FOREIGN KEY(subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
   FOREIGN KEY(teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS attendance (
   id INT PRIMARY KEY AUTO_INCREMENT,
   student_id INT,
   date DATE,
   status ENUM('Present','Absent'),
   marked_by INT,
   FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE,
   FOREIGN KEY(marked_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS exams (
   id INT PRIMARY KEY AUTO_INCREMENT,
   exam_name VARCHAR(100),
   class_id INT,
   exam_date DATE,
   FOREIGN KEY(class_id) REFERENCES classes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS marks (
   id INT PRIMARY KEY AUTO_INCREMENT,
   exam_id INT,
   student_id INT,
   subject_id INT,
   marks INT,
   FOREIGN KEY(exam_id) REFERENCES exams(id) ON DELETE CASCADE,
   FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE,
   FOREIGN KEY(subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS assignments (
   id INT PRIMARY KEY AUTO_INCREMENT,
   title VARCHAR(200),
   description TEXT,
   class_id INT,
   teacher_id INT,
   due_date DATE,
   file_url VARCHAR(255) DEFAULT NULL,
   FOREIGN KEY(class_id) REFERENCES classes(id) ON DELETE CASCADE,
   FOREIGN KEY(teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS assignment_submissions (
   id INT PRIMARY KEY AUTO_INCREMENT,
   assignment_id INT,
   student_id INT,
   submission_text TEXT,
   file_url VARCHAR(255) DEFAULT NULL,
   submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   marks_given INT DEFAULT NULL,
   FOREIGN KEY(assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
   FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS fees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    total_amount DECIMAL(10, 2),
    paid_amount DECIMAL(10, 2) DEFAULT 0.00,
    due_date DATE,
    status ENUM('Pending', 'Partial', 'Paid') DEFAULT 'Pending',
    FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS announcements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200),
    content TEXT,
    target_role ENUM('all', 'teacher', 'student'),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS admissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    dateOfBirth DATE NOT NULL,
    address TEXT NOT NULL,
    classId INT NOT NULL,
    section VARCHAR(20) NOT NULL,
    fatherName VARCHAR(100) NOT NULL,
    motherName VARCHAR(100) NOT NULL,
    status ENUM('Pending','Approved','Rejected') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (classId) REFERENCES classes(id)
);
