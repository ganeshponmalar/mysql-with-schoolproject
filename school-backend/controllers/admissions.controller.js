const db = require("../db/db.js");
const { errorHandler } = require("../middleware/errorHandler.js");
const ErrorHandler = require("../middleware/errorMiddleware.js");

// CREATE ADMISSION
exports.createAdmission = errorHandler(async (req, res, next) => {
    const {
        name, email, phone, gender, dateOfBirth, address, classId, section, fatherName, motherName
    } = req.body;

    if (!name || !email || !phone || !gender || !dateOfBirth || !address || !classId || !section || !fatherName || !motherName) {
        return next(new ErrorHandler("Please fill all required fields", 400));
    }

    const [existing] = await db.query("SELECT id FROM admissions WHERE email = ?", [email]);
    if (existing.length > 0) {
        return next(new ErrorHandler("Admission record with this email already exists", 400));
    }

    const [result] = await db.query(
        `INSERT INTO admissions (name, email, phone, gender, dateOfBirth, address, classId, section, fatherName, motherName)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, email, phone, gender, dateOfBirth, address, classId, section, fatherName, motherName]
    );

    res.status(201).json({ success: true, message: "Admission created successfully", admissionId: result.insertId });
});


// GET ALL ADMISSIONS
exports.getAllAdmissions = errorHandler(async (req, res, next) => {
    const [admissions] = await db.query(`
    SELECT a.*, c.class_name
    FROM admissions a
    JOIN classes c ON a.classId = c.id
    ORDER BY a.created_at DESC
  `);
    res.status(200).json({ success: true, count: admissions.length, admissions });
});

// GET SINGLE ADMISSION
exports.getAdmissionById = errorHandler(async (req, res, next) => {
    const [rows] = await db.query(
        `SELECT a.*, c.class_name FROM admissions a JOIN classes c ON a.classId = c.id WHERE a.id = ?`,
        [req.params.id]
    );
    if (rows.length === 0) {
        return next(new ErrorHandler("Admission record not found", 404));
    }
    res.status(200).json({ success: true, admission: rows[0] });
});

// UPDATE STATUS
exports.updateAdmissionStatus = errorHandler(async (req, res, next) => {
    const { status } = req.body;
    if (!status) return next(new ErrorHandler("Status is required", 400));

    const [result] = await db.query("UPDATE admissions SET status = ? WHERE id = ?", [status, req.params.id]);
    if (result.affectedRows === 0) return next(new ErrorHandler("Admission record not found", 404));

    res.status(200).json({ success: true, message: `Admission status updated to ${status}` });
});

// DELETE ADMISSION
exports.deleteAdmission = errorHandler(async (req, res, next) => {
    const [result] = await db.query("DELETE FROM admissions WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return next(new ErrorHandler("Admission record not found", 404));
    res.status(200).json({ success: true, message: "Admission deleted successfully" });
});
