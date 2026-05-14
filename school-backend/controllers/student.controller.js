const db = require("../db/db.js");
const { errorHandler } = require("../middleware/errorHandler.js");
const ErrorHandler = require("../middleware/errorMiddleware.js");

// CREATE STUDENT
exports.createStudent = errorHandler(async (req, res, next) => {
    const {
        userId,
        section,
        rollNumber,
        dateOfBirth,
        admissionDate,
        guardianInfo
    } = req.body;

    if (!userId || !section || !rollNumber || !dateOfBirth || !admissionDate) {
        return next(new ErrorHandler("Please provide all required fields", 400));
    }

    // New: Check if userId exists in users table
    const [userExists] = await db.query("SELECT id FROM users WHERE id = ?", [userId]);
    if (userExists.length === 0) {
        return next(new ErrorHandler(`User ID ${userId} not found in database. Student must be a registered user first.`, 404));
    }

    // check duplicate roll number in same section
    const [existingStudent] = await db.query(
        "SELECT id FROM students WHERE section = ? AND rollNumber = ?",
        [section, rollNumber]
    );

    if (existingStudent.length > 0) {
        return next(
            new ErrorHandler("Roll number already exists in this section", 400)
        );
    }

    const [result] = await db.query(
        `INSERT INTO students
    (userId, section, rollNumber, dateOfBirth, admissionDate, guardianInfo)
    VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, section, rollNumber, dateOfBirth, admissionDate, guardianInfo]
    );

    res.status(201).json({
        success: true,
        message: "Student created successfully",
        studentId: result.insertId
    });
});

// GET SINGLE STUDENT
exports.getSingleStudent = errorHandler(async (req, res, next) => {
    const { id } = req.params;

    const [rows] = await db.query(
        `
    SELECT 
      s.*,
      u.name AS studentName,
      u.email
    FROM students s
    JOIN users u ON s.userId = u.id
    WHERE s.id = ?
    `,
        [id]
    );

    if (rows.length === 0) {
        return next(new ErrorHandler("Student not found", 404));
    }

    res.status(200).json({
        success: true,
        student: rows[0]
    });
});

// GET ALL STUDENTS
exports.getAllStudents = errorHandler(async (req, res, next) => {
    const [students] = await db.query(`
    SELECT
      s.*,
      u.name AS studentName,
      u.email
    FROM students s
    JOIN users u ON s.userId = u.id
    ORDER BY s.created_at DESC
  `);

    if (students.length === 0) {
        return res.status(200).json({
            success: true,
            count: 0,
            students: []
        });
    }

    res.status(200).json({
        success: true,
        count: students.length,
        students
    });
});

// UPDATE STUDENT
exports.updateStudent = errorHandler(async (req, res, next) => {
    const { id } = req.params;
    const {
        section,
        rollNumber,
        dateOfBirth,
        admissionDate,
        guardianInfo
    } = req.body;

    const [result] = await db.query(
        `
    UPDATE students
    SET section = ?, rollNumber = ?, dateOfBirth = ?, admissionDate = ?, guardianInfo = ?
    WHERE id = ?
    `,
        [section, rollNumber, dateOfBirth, admissionDate, guardianInfo, id]
    );

    if (result.affectedRows === 0) {
        return next(new ErrorHandler("Student not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Student updated successfully"
    });
});

// DELETE STUDENT
exports.deleteStudent = errorHandler(async (req, res, next) => {
    const { id } = req.params;

    const [result] = await db.query(
        "DELETE FROM students WHERE id = ?",
        [id]
    );

    if (result.affectedRows === 0) {
        return next(new ErrorHandler("Student not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Student deleted successfully"
    });
});

// LOGOUT
exports.logoutStudent = (req, res) => {
    try {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        res.status(200).json({
            success: true,
            message: "Logout successful",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Logout failed",
        });
    }
};

// STUDENT PROFILE
exports.studentProfile = errorHandler(async (req, res, next) => {
    if (!req.user) {
        return next(new ErrorHandler("Please login first", 401));
    }

    const [rows] = await db.query(
        `
    SELECT
      s.*,
      u.name AS studentName,
      u.email
    FROM students s
    JOIN users u ON s.userId = u.id
    WHERE s.userId = ?
    `,
        [req.user.id]
    );

    if (rows.length === 0) {
        return next(new ErrorHandler(`Student record not found for user ID: ${req.user.id}`, 404));
    }

    res.status(200).json({
        success: true,
        message: "Student profiles fetched successfully",
        count: rows.length,
        students: rows
    });
});

