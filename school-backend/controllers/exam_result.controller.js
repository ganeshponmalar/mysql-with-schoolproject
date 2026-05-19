const db = require('../db/db');

// @desc    Record exam results
// @route   POST /api/results
// @access  Teacher
const createResult = async (req, res, next) => {
    try {
        const { student_id, exam_name, subject, marks, total_marks, grade, remarks, exam_date } = req.body;

        if (!student_id || !exam_name || !subject || !marks || !total_marks) {
            return res.status(400).json({ success: false, message: "Please provide student_id, exam_name, subject, marks, and total_marks." });
        }

        const query = `
            INSERT INTO exam_results (student_id, exam_name, subject, marks, total_marks, grade, remarks, exam_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [student_id, exam_name, subject, marks, total_marks, grade, remarks, exam_date]);

        res.status(201).json({
            success: true,
            message: "Exam result recorded successfully",
            resultId: result.insertId
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get results by student ID
// @route   GET /api/results/student/:id
// @access  Admin, Teacher, Student, Parent
const getStudentResults = async (req, res, next) => {
    try {
        const studentId = req.params.id;
        const query = `SELECT * FROM exam_results WHERE student_id = ? ORDER BY exam_date DESC`;
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

// @desc    Update exam result
// @route   PUT /api/results/:id
// @access  Admin, Teacher
const updateResult = async (req, res, next) => {
    try {
        const resultId = req.params.id;
        const { marks, total_marks, grade, remarks, exam_date } = req.body;

        const [existing] = await db.query(`SELECT id FROM exam_results WHERE id = ?`, [resultId]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: "Result record not found" });
        }

        const query = `UPDATE exam_results SET marks = ?, total_marks = ?, grade = ?, remarks = ?, exam_date = ? WHERE id = ?`;
        await db.query(query, [marks, total_marks, grade, remarks, exam_date, resultId]);

        res.status(200).json({
            success: true,
            message: "Result record updated successfully"
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete exam result
// @route   DELETE /api/results/:id
// @access  Admin
const deleteResult = async (req, res, next) => {
    try {
        const resultId = req.params.id;
        const [existing] = await db.query(`SELECT id FROM exam_results WHERE id = ?`, [resultId]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: "Result record not found" });
        }

        await db.query(`DELETE FROM exam_results WHERE id = ?`, [resultId]);

        res.status(200).json({
            success: true,
            message: "Result record deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createResult,
    getStudentResults,
    updateResult,
    deleteResult
};
