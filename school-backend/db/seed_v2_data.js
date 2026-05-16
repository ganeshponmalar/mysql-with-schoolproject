const mysql = require("mysql2/promise");
require("dotenv").config();

async function seed() {
    console.log("🌱 Seeding v2 data...");

    const pool = mysql.createPool({
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "ganesh123",
        database: "school_v2_db"
    });

    try {
        // Update a student with new v2 data
        console.log("Updating sample student data...");
        await pool.query(
            "UPDATE students SET phone = ?, gender = ?, address = ?, fatherName = ?, motherName = ? WHERE id = 1",
            ["+91 9876543210", "Male", "123 Academic Way, Education City", "John Doe Sr.", "Jane Doe Sr."]
        );

        // Update a teacher with new v2 data
        console.log("Updating sample teacher data...");
        await pool.query(
            "UPDATE teachers SET phone = ?, email = ?, address = ? WHERE id = 1",
            ["+91 1234567890", "james.teacher@school.com", "456 Faculty Lane, Education City"]
        );

        console.log("✅ Seeding completed!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
}

seed();
