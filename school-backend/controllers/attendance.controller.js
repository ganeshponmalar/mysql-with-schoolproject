const db = require('../db/db');

// @desc    Mark attendance
// @route   POST /api/attendance
// @access  Teacher
const markAttendance = async (req, res, next) => {
    try {
        const { student_id, class_id, date, status, remarks } = req.body;
        const marked_by = req.user.id;

        if (!student_id || !class_id || !date || !status) {
            return res.status(400).json({ success: false, message: "Please provide student_id, class_id, date, and status." });
        }

        const query = `
            INSERT INTO attendance (student_id, class_id, date, status, remarks, marked_by)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [student_id, class_id, date, status, remarks, marked_by]);

        res.status(201).json({
            success: true,
            message: "Attendance marked successfully",
            attendanceId: result.insertId
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get attendance by student ID
// @route   GET /api/attendance/student/:id
// @access  Admin, Teacher, Student, Parent
const getStudentAttendance = async (req, res, next) => {
    try {
        const studentId = req.params.id;
        const query = `SELECT * FROM attendance WHERE student_id = ? ORDER BY date DESC`;
        const [results] = await db.query(query, [studentId]);

        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update attendance record
// @route   PUT /api/attendance/:id
// @access  Admin, Teacher
const updateAttendance = async (req, res, next) => {
    try {
        const attendanceId = req.params.id;
        const { status, remarks } = req.body;

        const [existing] = await db.query(`SELECT id FROM attendance WHERE id = ?`, [attendanceId]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: "Attendance record not found" });
        }

        const query = `UPDATE attendance SET status = ?, remarks = ? WHERE id = ?`;
        await db.query(query, [status, remarks, attendanceId]);

        res.status(200).json({
            success: true,
            message: "Attendance record updated successfully"
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete attendance record
// @route   DELETE /api/attendance/:id
// @access  Admin
const deleteAttendance = async (req, res, next) => {
    try {
        const attendanceId = req.params.id;
        const [existing] = await db.query(`SELECT id FROM attendance WHERE id = ?`, [attendanceId]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: "Attendance record not found" });
        }

        await db.query(`DELETE FROM attendance WHERE id = ?`, [attendanceId]);

        res.status(200).json({
            success: true,
            message: "Attendance record deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    markAttendance,
    getStudentAttendance,
    updateAttendance,
    deleteAttendance
};
