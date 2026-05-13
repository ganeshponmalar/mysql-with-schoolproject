const express = require('express');
const router = express.Router();
const { verifyToken, allowRoles } = require('../middleware/auth');
const { sendNotification, getMyNotifications, deleteNotification } = require('../controllers/notification.controller');

// Send Notification (Admin, Teacher)
router.post('/', verifyToken, allowRoles('admin', 'teacher'), sendNotification);

// Get Notifications (Admin, Teacher, Student)
router.get('/', verifyToken, allowRoles('admin', 'teacher', 'student'), getMyNotifications);

// Delete Notification (Admin only)
router.delete('/:id', verifyToken, allowRoles('admin'), deleteNotification);

module.exports = router;
