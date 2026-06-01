const db = require('../db/db');

// @desc    Assign homework
// @route   POST /api/homework
// @access  Teacher
const createHomework = async (req, res, next) => {
    try {
        const { title, description, subject, class_id, due_date, attachment_url } = req.body;
        const userId = req.user.id;

        if (!title || !class_id) {
            return res.status(400).json({ success: false, message: "Please provide title and class_id." });
        }

        const [classRows] = await db.query(`SELECT id FROM classes WHERE id = ?`, [class_id]);
        if (classRows.length === 0) {
            return res.status(400).json({ success: false, message: `Class with id ${class_id} does not exist.` });
        }

        const assigned_by = userId;

        const query = `
            INSERT INTO homework (title, description, subject, class_id, due_date, assigned_by, attachment_url)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [title, description, subject, class_id, due_date, assigned_by, attachment_url]);

        res.status(201).json({
            success: true,
            message: "Homework assigned successfully",
            homeworkId: result.insertId
        });

    } catch (error) {
        console.error("createHomework error:", error);
        next(error);
    }
};

// @desc    Get homework by class ID
// @route   GET /api/homework/class/:id
// @access  Admin, Teacher, Student, Parent
const getClassHomework = async (req, res, next) => {
    try {
        const classId = req.params.id;
        const query = `SELECT * FROM homework WHERE class_id = ? ORDER BY due_date ASC`;
        const [results] = await db.query(query, [classId]);

        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (error) {
        next(error);
    }
};


// @desc    Update homework
// @route   PUT /api/homework/:id
// @access  Admin, Teacher
const updateHomework = async (req, res, next) => {
    try {
        const homeworkId = req.params.id;
        const { title, description, subject, due_date, attachment_url } = req.body;

        const [existing] = await db.query(`SELECT id FROM homework WHERE id = ?`, [homeworkId]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: "Homework record not found" });
        }

        const query = `UPDATE homework SET title = ?, description = ?, subject = ?, due_date = ?, attachment_url = ? WHERE id = ?`;
        await db.query(query, [title, description, subject, due_date, attachment_url, homeworkId]);

        res.status(200).json({
            success: true,
            message: "Homework record updated successfully"
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete homework
// @route   DELETE /api/homework/:id
// @access  Admin, Teacher
const deleteHomework = async (req, res, next) => {
    try {
        const homeworkId = req.params.id;
        const [existing] = await db.query(`SELECT id FROM homework WHERE id = ?`, [homeworkId]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: "Homework record not found" });
        }

        await db.query(`DELETE FROM homework WHERE id = ?`, [homeworkId]);

        res.status(200).json({
            success: true,
            message: "Homework record deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createHomework,
    getClassHomework,
    updateHomework,
    deleteHomework
};
