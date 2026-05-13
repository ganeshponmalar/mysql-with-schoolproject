const db = require("./db");

async function migrate() {
    try {
        console.log("Creating fees table...");
        const query = `
        CREATE TABLE IF NOT EXISTS fees (
            id INT PRIMARY KEY AUTO_INCREMENT,
            student_id INT NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            due_date DATE NOT NULL,
            payment_date DATE DEFAULT NULL,
            status ENUM('pending', 'paid', 'overdue') DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
        );`;
        await db.query(query);
        console.log("Table 'fees' created successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Error creating table:", error);
        process.exit(1);
    }
}

migrate();
