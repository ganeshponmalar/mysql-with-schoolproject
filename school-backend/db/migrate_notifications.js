const db = require("./db");

async function migrate() {
    try {
        console.log("Creating notifications table...");
        const query = `
        CREATE TABLE IF NOT EXISTS notifications (
            id INT PRIMARY KEY AUTO_INCREMENT,
            sender_id INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            recipient_group VARCHAR(50) NOT NULL,
            status ENUM('active','inactive') DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
        );`;
        await db.query(query);
        console.log("Table 'notifications' created successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Error creating table:", error);
        process.exit(1);
    }
}

migrate();
