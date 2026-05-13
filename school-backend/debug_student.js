const db = require("./db/db");

async function debugStudentCreation() {
    try {
        console.log("Simulating student creation...");
        const userId = 1;
        const section = "A";
        const rollNumber = "DEBUG_" + Date.now();
        const dateOfBirth = "2000-01-01";
        const admissionDate = "2024-01-01";
        const guardianInfo = "Debug Guardian";

        const query = `INSERT INTO students
            (userId, section, rollNumber, dateOfBirth, admissionDate, guardianInfo)
            VALUES (?, ?, ?, ?, ?, ?)`;

        console.log("Executing Query:", query);
        console.log("Values:", [userId, section, rollNumber, dateOfBirth, admissionDate, guardianInfo]);

        const [result] = await db.query(query, [userId, section, rollNumber, dateOfBirth, admissionDate, guardianInfo]);

        console.log("Success! Result:", result);
        process.exit(0);
    } catch (error) {
        console.error("FAILED with error:");
        console.error(error);
        process.exit(1);
    }
}

debugStudentCreation();
