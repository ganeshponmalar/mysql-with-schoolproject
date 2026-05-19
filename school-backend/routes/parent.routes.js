const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parent.controller');
const { verifyToken, allowRoles } = require('../middleware/auth');

router.use(verifyToken);
router.use(allowRoles('parent'));

router.get('/children', parentController.getChildren);
router.get('/children/:studentId/profile', parentController.getChildProfile);
router.get('/children/:studentId/attendance', parentController.getChildAttendance);
router.get('/children/:studentId/results', parentController.getChildResults);
router.get('/children/:studentId/assignments', parentController.getChildAssignments);
router.get('/notifications', parentController.getNotifications);
router.get('/teachers', parentController.getTeachers);
router.get('/messages/:teacherId', parentController.getMessages);
router.post('/messages/:teacherId', parentController.sendMessage);

module.exports = router;
