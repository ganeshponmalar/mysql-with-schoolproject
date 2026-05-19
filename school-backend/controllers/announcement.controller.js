const db = require('../db/db');

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Admin, Teacher
const createAnnouncement = async (req, res, next) => {
    try {
        const { title, message, target_role, priority, expiry_date } = req.body;
        const created_by = req.user.id;

        if (!title || !message) {
            return res.status(400).json({ success: false, message: "Please provide title and message." });
        }

        const query = `
            INSERT INTO announcements (title, message, target_role, priority, created_by, expiry_date)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [title, message, target_role, priority, created_by, expiry_date]);

        res.status(201).json({
            success: true,
            message: "Announcement created successfully",
            announcementId: result.insertId
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all announcements (role filtering)
// @route   GET /api/announcements
// @access  All
const getAnnouncements = async (req, res, next) => {
    try {
        const role = req.user.role;
        const query = `
            SELECT * FROM announcements 
            WHERE target_role IN ('all', ?) 
            AND (expiry_date IS NULL OR expiry_date >= CURDATE())
            ORDER BY created_at DESC
        `;
        const [results] = await db.query(query, [role]);

        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Admin
const deleteAnnouncement = async (req, res, next) => {
    try {
        const announcementId = req.params.id;
        const [existing] = await db.query(`SELECT id FROM announcements WHERE id = ?`, [announcementId]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: "Announcement not found" });
        }

        await db.query(`DELETE FROM announcements WHERE id = ?`, [announcementId]);

        res.status(200).json({
            success: true,
            message: "Announcement deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createAnnouncement,
    getAnnouncements,
    deleteAnnouncement
};
