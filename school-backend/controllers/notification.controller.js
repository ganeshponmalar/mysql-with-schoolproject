const db = require('../db/db');
const { verifyToken, allowRoles } = require('../middleware/auth');

// SEND NOTIFICATION (Admin/Teacher)
const sendNotification = async (req, res, next) => {
    try {
        const { title, message, recipientGroup } = req.body;

        if (!title || !message || !recipientGroup) {
            return res.status(400).json({ success: false, message: "Please provide all required fields" });
        }

        const senderId = req.user.id;

        const query = `
            INSERT INTO notifications
            (sender_id, title, message, recipient_group)
            VALUES (?, ?, ?, ?)
        `;

        const [result] = await db.query(query, [senderId, title, message, recipientGroup]);

        res.status(201).json({
            success: true,
            message: "Notification sent successfully",
            notificationId: result.insertId,
        });
    } catch (error) {
        next(error);
    }
};

// GET MY NOTIFICATIONS
const getMyNotifications = async (req, res, next) => {
    try {
        const role = req.user.role;

        // Example: student -> students, teacher -> teachers
        const recipientGroup = `${role}s`;

        const query = `
            SELECT *
            FROM notifications
            WHERE recipient_group IN ('all', ?)
            AND status = 'active'
            ORDER BY created_at DESC
        `;

        const [results] = await db.query(query, [recipientGroup]);

        res.status(200).json({
            success: true,
            notifications: results,
        });
    } catch (error) {
        next(error);
    }
};

// DELETE NOTIFICATION (Admin only)
const deleteNotification = async (req, res, next) => {
    try {
        const notificationId = req.params.id;

        const checkQuery = `SELECT * FROM notifications WHERE id = ?`;
        const [results] = await db.query(checkQuery, [notificationId]);

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

        const deleteQuery = `DELETE FROM notifications WHERE id = ?`;
        await db.query(deleteQuery, [notificationId]);

        res.status(200).json({
            success: true,
            message: "Notification deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    sendNotification,
    getMyNotifications,
    deleteNotification
};
