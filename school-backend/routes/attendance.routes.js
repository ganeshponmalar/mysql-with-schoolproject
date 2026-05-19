const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');
const { verifyToken, allowRoles } = require('../middleware/auth');

router.use(verifyToken);

router.post('/', allowRoles('teacher'), attendanceController.markAttendance);
router.get('/student/:id', allowRoles('admin', 'teacher', 'student', 'parent'), attendanceController.getStudentAttendance);
router.put('/:id', allowRoles('admin', 'teacher'), attendanceController.updateAttendance);
router.delete('/:id', allowRoles('admin'), attendanceController.deleteAttendance);

module.exports = router;
