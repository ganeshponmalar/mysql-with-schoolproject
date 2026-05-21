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
        return res.status(200).json({
            success: true,
            message: "No student records found",
            count: 0,
            students: []
        });
    }

    res.status(200).json({
        success: true,
        message: "Student profiles fetched successfully",
        count: rows.length,
        students: rows
    });
});

// LINK PARENT TO STUDENT
exports.linkParent = errorHandler(async (req, res, next) => {
    const { id: student_id } = req.params;
    const { parentEmail } = req.body;

    if (!parentEmail) {
        return next(new ErrorHandler("Please provide parent email", 400));
    }

    const [parents] = await db.query('SELECT id, role FROM users WHERE email = ?', [parentEmail]);
    if (parents.length === 0) {
        return next(new ErrorHandler("User not found with this email", 404));
    }

    const parent = parents[0];
    if (parent.role !== 'parent') {
        return next(new ErrorHandler(`The user associated with this email has the role '${parent.role}', not 'parent'`, 400));
    }

    const parentId = parent.id;

    const [existing] = await db.query('SELECT * FROM parent_students WHERE parent_id = ? AND student_id = ?', [parentId, student_id]);
    if (existing.length > 0) {
        return res.status(200).json({ success: true, message: "Parent is already linked to this student" });
    }

    await db.query('INSERT INTO parent_students (parent_id, student_id) VALUES (?, ?)', [parentId, student_id]);

    res.status(200).json({ success: true, message: "Parent linked successfully" });
});

// GET STUDENT ATTENDANCE (View for Student)
exports.getAttendance = errorHandler(async (req, res, next) => {
    const userId = req.user.id;
    const [students] = await db.query("SELECT id FROM students WHERE userId = ?", [userId]);
    if (students.length === 0) return res.status(404).json({ success: false, message: "Student record not found" });

    const student_id = students[0].id;
    const [attendance] = await db.query("SELECT * FROM attendance WHERE student_id = ? ORDER BY date DESC", [student_id]);
    res.status(200).json({ success: true, attendance });
});

// GET STUDENT RESULTS (View for Student)
exports.getResults = errorHandler(async (req, res, next) => {
    const userId = req.user.id;

    const [students] = await db.query(
        "SELECT id FROM students WHERE userId = ?",
        [userId]
    );

    if (students.length === 0) {
        return res.status(404).json({
            success: false,
            message: "Student record not found"
        });
    }

    const student_id = students[0].id;

    const [results] = await db.query(`
        SELECT
            id,
            exam_name,
            subject,
            marks,
            total_marks,
            grade,
            remarks,
            exam_date,
            created_at
        FROM exam_results
        WHERE student_id = ?
        ORDER BY exam_date DESC
    `, [student_id]);

    res.status(200).json({
        success: true,
        count: results.length,
        results
    });
});

// GET STUDENT HOMEWORK (View for Student)
exports.getHomework = errorHandler(async (req, res, next) => {
    const userId = req.user.id;
    const [students] = await db.query("SELECT section FROM students WHERE userId = ?", [userId]);
    if (students.length === 0) return res.status(404).json({ success: false, message: "Student record not found" });

    // For now, return all or match by some logic.
    // In real app, we use class_id.
    const [homework] = await db.query("SELECT * FROM homework ORDER BY due_date ASC");
    res.status(200).json({ success: true, homework });
});

