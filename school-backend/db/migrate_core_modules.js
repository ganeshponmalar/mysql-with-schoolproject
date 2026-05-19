const db = require('./db');

async function migrate() {
    try {
        console.log("Starting migration for core school modules...");

        // 1. ATTENDANCE TABLE
        await db.query(`
            DROP TABLE IF EXISTS attendance;
        `);
        await db.query(`
            CREATE TABLE attendance (
              id INT PRIMARY KEY AUTO_INCREMENT,
              student_id INT NOT NULL,
              class_id INT NOT NULL,
              date DATE NOT NULL,
              status ENUM('present','absent','late','leave') NOT NULL,
              remarks VARCHAR(255),
              marked_by INT,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE,
              FOREIGN KEY(class_id) REFERENCES classes(id),
              FOREIGN KEY(marked_by) REFERENCES users(id)
            );
        `);
        console.log("- Attendance table recreated with full schema.");

        // 2. EXAM RESULTS TABLE
        await db.query(`
            DROP TABLE IF EXISTS exam_results;
        `);
        await db.query(`
            CREATE TABLE exam_results (
              id INT PRIMARY KEY AUTO_INCREMENT,
              student_id INT NOT NULL,
              exam_name VARCHAR(100),
              subject VARCHAR(100),
              marks DECIMAL(5,2),
              total_marks DECIMAL(5,2),
              grade VARCHAR(5),
              remarks TEXT,
              exam_date DATE,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE
            );
        `);
        console.log("- Exam Results table created.");

        // 3. HOMEWORK TABLE
        await db.query(`
            DROP TABLE IF EXISTS homework;
        `);
        await db.query(`
            CREATE TABLE homework (
              id INT PRIMARY KEY AUTO_INCREMENT,
              title VARCHAR(255) NOT NULL,
              description TEXT,
              subject VARCHAR(100),
              class_id INT,
              due_date DATE,
              assigned_by INT,
              attachment_url VARCHAR(255),
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY(class_id) REFERENCES classes(id),
              FOREIGN KEY(assigned_by) REFERENCES users(id)
            );
        `);
        console.log("- Homework table created.");

        // 4. ANNOUNCEMENTS TABLE
        await db.query(`
            DROP TABLE IF EXISTS announcements;
        `);
        await db.query(`
            CREATE TABLE announcements (
              id INT PRIMARY KEY AUTO_INCREMENT,
              title VARCHAR(255) NOT NULL,
              message TEXT NOT NULL,
              target_role ENUM('all','teacher','student','parent') DEFAULT 'all',
              priority ENUM('low','medium','high') DEFAULT 'medium',
              created_by INT,
              expiry_date DATE,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY(created_by) REFERENCES users(id)
            );
        `);
        console.log("- Announcements table recreated with full schema.");

        console.log("Migration completed successfully.");
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}

migrate();
