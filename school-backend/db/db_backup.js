const { exec } = require("child_process");
const path = require("path");
require("dotenv").config();

async function backup() {
    console.log("💾 Starting database backup...");

    const dbName = process.env.DB_NAME || "school_db";
    const dbUser = process.env.DB_USER || "root";
    const dbPass = process.env.DB_PASSWORD || "ganesh123";
    const dbHost = process.env.DB_HOST || "localhost";

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupFile = path.join(__dirname, "..", "backups", `${dbName}_${timestamp}.sql`);

    const command = `mysqldump -h ${dbHost} -u ${dbUser} -p${dbPass} ${dbName} > "${backupFile}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Backup failed: ${error.message}`);
            process.exit(1);
        }
        if (stderr && !stderr.includes("Using a password on the command line interface can be insecure")) {
            console.warn(`⚠️ Backup Warning: ${stderr}`);
        }
        console.log(`✅ Backup successful: ${backupFile}`);
        process.exit(0);
    });
}

backup();
