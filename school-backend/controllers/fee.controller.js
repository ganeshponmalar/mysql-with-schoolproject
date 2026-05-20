const db = require("../db/db");

// CREATE FEE
const createFee = async (req, res, next) => {
    try {
        const { studentId, amount, dueDate, paymentDate } = req.body;

        if (!studentId || amount == null || !dueDate) {
            return res.status(400).json({
                success: false,
                message: "Student Roll Number/ID, amount, and dueDate are required"
            });
        }

        let studentQuery = "";
        let studentValue = [];

        // Check whether input is numeric (roll number) or ID
        if (!isNaN(studentId)) {
            studentQuery = `SELECT * FROM students WHERE rollNumber = ?`;
            studentValue = [studentId];
        } else {
            studentQuery = `SELECT * FROM students WHERE id = ?`;
            studentValue = [studentId];
        }

        const [studentResult] = await db.query(studentQuery, studentValue);

        if (studentResult.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found (please check Roll Number or ID)"
            });
        }

        const actualStudentId = studentResult[0].id;

        // Map submitted values to the current DB schema: total_amount and paid_amount
        const total_amount = parseFloat(amount);
        const paid_amount = paymentDate ? parseFloat(amount) : 0.00;

        // Use enum values present in the DB (avoid lowercase mismatch)
        const status = paymentDate ? 'Paid' : 'Pending';

        const insertQuery = `
            INSERT INTO fees
            (student_id, total_amount, paid_amount, due_date, status)
            VALUES (?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(insertQuery, [actualStudentId, total_amount, paid_amount, dueDate, status]);

        res.status(201).json({
            success: true,
            message: "Fee created successfully",
            feeId: result.insertId,
        });
    } catch (error) {
        next(error);
    }
};




// GET ALL FEES
const getAllFees = async (req, res, next) => {
    try {
        const query = `
            SELECT 
                f.*,
                u.name,
                s.rollNumber as roll_number
            FROM fees f
            JOIN students s ON f.student_id = s.id
            JOIN users u ON s.userId = u.id
            ORDER BY f.id DESC
        `;

        const [results] = await db.query(query);

        res.status(200).json({
            success: true,
            count: results.length,
            fees: results,
        });
    } catch (error) {
        next(error);
    }
};

// GET STUDENT FEES (Personal - multiple records support)
const getMyFees = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Find all student record IDs associated with this user
        const [studentRecords] = await db.query("SELECT id FROM students WHERE userId = ?", [userId]);

        if (studentRecords.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No student enrollments found.",
                fees: []
            });
        }

        const studentIds = studentRecords.map(s => s.id);

        const query = `
            SELECT 
                f.*,
                s.rollNumber,
                s.section
            FROM fees f
            JOIN students s ON f.student_id = s.id
            WHERE f.student_id IN (?) 
            ORDER BY f.created_at DESC
        `;

        const [results] = await db.query(query, [studentIds]);

        res.status(200).json({
            success: true,
            fees: results,
        });
    } catch (error) {
        next(error);
    }
};

// UPDATE FEE
const updateFee = async (req, res, next) => {
    try {
        const feeId = req.params.id;
        const { amount, dueDate, paymentDate, status } = req.body;

        const query = `
            UPDATE fees
            SET amount = ?, due_date = ?, payment_date = ?, status = ?
            WHERE id = ?
        `;

        const [result] = await db.query(query, [amount, dueDate, paymentDate || null, status, feeId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Fee not found" });
        }

        res.status(200).json({
            success: true,
            message: "Fee updated successfully",
        });
    } catch (error) {
        next(error);
    }
};

// DELETE FEE
const deleteFee = async (req, res, next) => {
    try {
        const feeId = req.params.id;
        const query = `DELETE FROM fees WHERE id = ?`;
        const [result] = await db.query(query, [feeId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Fee not found" });
        }

        res.status(200).json({
            success: true,
            message: "Fee deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createFee,
    getAllFees,
    getMyFees,
    updateFee,
    deleteFee
};
