const db = require("./db");

async function migrate() {
    try {
        console.log("Dropping old fees table if exists...");
        await db.query("DROP TABLE IF EXISTS fees;");
        
        console.log("Creating new fees table...");
        const query = `
        CREATE TABLE fees (
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
        console.log("Table 'fees' recreated successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Error during migration:", error);
        process.exit(1);
    }
}

migrate();
