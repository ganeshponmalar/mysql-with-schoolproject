const mysql = require('mysql2/promise');
require('dotenv').config({ path: __dirname + '/../.env' });

const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'school_v2_db',
    multipleStatements: true
};

async function migrate() {
    let connection;
    try {
        console.log("Connecting to the database...");
        connection = await mysql.createConnection(config);

        console.log("Modifying 'role' ENUM in 'users' table...");
        await connection.query("ALTER TABLE users MODIFY COLUMN role ENUM('admin','teacher','student','parent');");
        console.log("Success: Modified users role.");

        console.log("Modifying 'target_role' ENUM in 'announcements' table...");
        await connection.query("ALTER TABLE announcements MODIFY COLUMN target_role ENUM('all','teacher','student','parent');");
        console.log("Success: Modified announcements target_role.");

        console.log("Creating 'parent_students' table...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS parent_students (
                id INT PRIMARY KEY AUTO_INCREMENT,
                parent_id INT,
                student_id INT,
                FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
            );
        `);
        console.log("Success: Created parent_students table.");

        console.log("Creating 'messages' table...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id INT PRIMARY KEY AUTO_INCREMENT,
                sender_id INT,
                receiver_id INT,
                content TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(sender_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY(receiver_id) REFERENCES users(id) ON DELETE CASCADE
            );
        `);
        console.log("Success: Created messages table.");

        console.log("Migration for Parent role additions completed successfully.");
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        if (connection) {
            await connection.end();
            console.log("Database connection closed.");
        }
    }
}

migrate();
