const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller.js');
const { verifyToken, allowRoles } = require('../middleware/auth.js');

// Verify token for all routes
router.use(verifyToken);

// =========================
// STUDENT DASHBOARD ROUTES (STATIC - MUST BE FIRST)
// =========================

router.get('/profile', allowRoles('student'), studentController.studentProfile);
router.get('/attendance', allowRoles('student'), studentController.getAttendance);
router.get('/results', allowRoles('student'), studentController.getResults);
router.get('/homework', allowRoles('student'), studentController.getHomework);
router.post('/logout', allowRoles('student'), studentController.logoutStudent);

// =========================
// ADMIN / TEACHER ROUTES (STATIC)
// =========================

router.get('/', allowRoles('admin', 'teacher'), studentController.getAllStudents);
router.post('/', allowRoles('admin'), studentController.createStudent);
router.post('/:id/link-parent', allowRoles('admin'), studentController.linkParent);

// =========================
// DYNAMIC ROUTE MUST BE LAST
// =========================

router.get('/:id', allowRoles('admin', 'teacher', 'student'), studentController.getSingleStudent);
router.put('/:id', allowRoles('admin'), studentController.updateStudent);
router.delete('/:id', allowRoles('admin'), studentController.deleteStudent);

module.exports = router;
