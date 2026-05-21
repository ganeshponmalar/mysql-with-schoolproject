const db = require('../db/db');

// @desc    Record exam results
// @route   POST /api/results
// @access  Teacher, Admin
const createResult = async (req, res, next) => {
    try {
        const { student_id, exam_name, subject, marks, total_marks, grade, remarks, exam_date } = req.body;

        console.log('[createResult] Input:', { student_id, exam_name, subject, marks, total_marks });

        if (!student_id || !exam_name || !subject || !marks || !total_marks) {
            return res.status(400).json({ success: false, message: "Please provide student_id, exam_name, subject, marks, and total_marks." });
        }

        const [studentRecords] = await db.query('SELECT id, userId FROM students WHERE id = ?', [student_id]);
        if (studentRecords.length === 0) {
            return res.status(404).json({ success: false, message: `Student with id ${student_id} not found. Use the student.id value, not userId.` });
        }

        // Insert exam result
        const query = `
            INSERT INTO exam_results (student_id, exam_name, subject, marks, total_marks, grade, remarks, exam_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [student_id, exam_name, subject, marks, total_marks, grade, remarks, exam_date]);

        console.log('[createResult] Result inserted with ID:', result.insertId);

        // Find linked parents
        const [parents] = await db.query(
            'SELECT parent_id FROM parent_students WHERE student_id = ?',
            [student_id]
        );

        console.log('[createResult] Found', parents.length, 'linked parents');

        // Optional: Create notifications for parents (if announcements table exists)
        if (parents.length > 0) {
            try {
                const notificationMsg = `New exam result: ${subject} (${marks}/${total_marks}) for ${exam_name}`;
                for (const parent of parents) {
                    await db.query(
                        'INSERT INTO announcements (title, content, target_role, created_by) VALUES (?, ?, ?, ?)',
                        ['Exam Result Notification', notificationMsg, 'parent', 'system']
                    ).catch(() => {
                        console.log('[createResult] Announcements table not available, skipping notification');
                    });
                }
            } catch (notifyErr) {
                console.log('[createResult] Notification creation failed:', notifyErr.message);
            }
        }

        res.status(201).json({
            success: true,
            message: "Exam result recorded successfully",
            resultId: result.insertId
        });
    } catch (error) {
        console.error('[createResult] Error:', error);
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
