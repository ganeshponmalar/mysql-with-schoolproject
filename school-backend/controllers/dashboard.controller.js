const db = require('../db/db');
const { errorHandler } = require('../middleware/errorHandler');

const getDashboardStats = errorHandler(async (req, res, next) => {
    // get counts from various tables
    const [students] = await db.query('SELECT COUNT(*) as count FROM students');
    const [teachers] = await db.query('SELECT COUNT(*) as count FROM teachers');
    const [classes] = await db.query('SELECT COUNT(*) as count FROM classes');

    // For fees, typically we sum, but we can do a dummy or sum paid_amount
    const [fees] = await db.query('SELECT SUM(paid_amount) as total FROM fees');

    res.status(200).json({
        success: true,
        stats: {
            totalStudents: students[0].count,
            totalTeachers: teachers[0].count,
            activeClasses: classes[0].count,
            feesCollected: fees[0].total || 0
        }
    });
});

module.exports = {
    getDashboardStats
};
