const mysql = require("mysql2/promise");
require("dotenv").config();

async function migrate() {
    console.log("🚀 Starting PRODUCTION-SAFE database migration...");

    const sourceConfig = {
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "ganesh123",
        database: "school_db"
    };

    const targetConfig = {
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "ganesh123",
        database: "school_v2_db"
    };

    const sourcePool = mysql.createPool(sourceConfig);
    const targetConn = await mysql.createConnection(targetConfig);

    try {
        // 1. Disable Foreign Key Checks for bulk migration
        console.log("⚠️ Disabling Foreign Key checks...");
        await targetConn.query("SET FOREIGN_KEY_CHECKS = 0");

        // 2. Start Transaction
        console.log("🛡️ Starting transaction...");
        await targetConn.beginTransaction();

        const tables = [
            { name: "users", columns: ["id", "name", "email", "password", "role", "refresh_token", "created_at"] },
            { name: "students", columns: ["id", "userId", "section", "rollNumber", "dateOfBirth", "admissionDate", "guardianInfo", "created_at"] },
            { name: "teachers", columns: ["id", "teacherId", "teacherName", "subject", "user_id", "department", "qualification"] },
            { name: "classes", columns: ["id", "class_name", "section"] },
            { name: "subjects", columns: ["id", "subject_name"] },
            { name: "class_subjects", columns: ["id", "class_id", "subject_id", "teacher_id"] },
            { name: "timetable", columns: ["id", "class_id", "subject_id", "teacher_id", "day_of_week", "start_time", "end_time"] },
            { name: "attendance", columns: ["id", "student_id", "date", "status", "marked_by"] },
            { name: "exams", columns: ["id", "exam_name", "class_id", "exam_date"] },
            { name: "marks", columns: ["id", "exam_id", "student_id", "subject_id", "marks"] },
            { name: "assignments", columns: ["id", "title", "description", "class_id", "teacher_id", "due_date", "file_url"] },
            { name: "assignment_submissions", columns: ["id", "assignment_id", "student_id", "submission_text", "file_url", "submitted_at", "marks_given"] },
            { name: "fees", columns: ["id", "student_id", "total_amount", "paid_amount", "due_date", "status"] },
            { name: "announcements", columns: ["id", "title", "content", "target_role", "created_by", "created_at"] },
            { name: "admissions", columns: ["id", "name", "email", "phone", "gender", "dateOfBirth", "address", "classId", "section", "fatherName", "motherName", "status", "created_at"] }
        ];

        for (const table of tables) {
            console.log(`📦 Migrating ${table.name}...`);
            const [rows] = await sourcePool.query(`SELECT * FROM ${table.name}`);

            if (rows.length === 0) {
                console.log(`ℹ️ Table ${table.name} is empty, skipping...`);
                continue;
            }

            const placeholders = table.columns.map(() => "?").join(", ");
            const insertQuery = `INSERT INTO ${table.name} (${table.columns.join(", ")}) VALUES (${placeholders})`;

            for (const row of rows) {
                const values = table.columns.map(col => row[col]);
                await targetConn.query(insertQuery, values);
            }
            console.log(`✅ Migrated ${rows.length} rows to ${table.name}.`);
        }

        // 3. Re-enable Foreign Key Checks
        console.log("🛠️ Re-enabling Foreign Key checks...");
        await targetConn.query("SET FOREIGN_KEY_CHECKS = 1");

        // 4. Commit Transaction
        console.log("🏁 Committing transaction...");
        await targetConn.commit();
        console.log("🌟 Migration successful!");

    } catch (error) {
        console.error("❌ Migration failed! Rolling back...", error);
        await targetConn.rollback();
        // Restore Fkey checks even on failure
        await targetConn.query("SET FOREIGN_KEY_CHECKS = 1");
        process.exit(1);
    } finally {
        await targetConn.end();
        await sourcePool.end();
        process.exit(0);
    }
}

migrate();
