const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller.js');
const { verifyToken, allowRoles } = require('../middleware/auth.js');

// Protected routes (Admin, Teacher see student lists)
router.use(verifyToken);

router.get('/', allowRoles('admin', 'teacher', 'student'), studentController.getAllStudents);
router.get('/profile', allowRoles('student'), studentController.studentProfile);
router.get('/:id', allowRoles('admin', 'teacher', 'student'), studentController.getSingleStudent);

// Now allowing student role for testing/project requirements as requested
router.post('/', allowRoles('admin', 'student'), studentController.createStudent);
router.put('/:id', allowRoles('admin', 'student'), studentController.updateStudent);
router.delete('/:id', allowRoles('admin', 'student'), studentController.deleteStudent);
router.post('/:id/link-parent', allowRoles('admin'), studentController.linkParent);

router.get('/profile', studentController.studentProfile);
router.get('/attendance', studentController.getAttendance);
router.get('/results', studentController.getResults);
router.get('/homework', studentController.getHomework);
router.post('/logout', studentController.logoutStudent);

module.exports = router;
