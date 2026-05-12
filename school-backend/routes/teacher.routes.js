const express = require('express');
const {
    createTeacherController,
    getAllTeacherController,
    getSingleTeacher,
    updateTeacherController,
    deleteTeacherController,
    teacherProfile
} = require('../controllers/teacher.controller');

const { verifyToken, allowRoles } = require('../middleware/auth');

const router = express.Router();

// Profile Route (Teacher accessing their own profile)
router.get('/profile', verifyToken, allowRoles('teacher'), teacherProfile);

// Admin & Teacher Routes (CRUD)
router.post('/', verifyToken, allowRoles('admin', 'teacher'), createTeacherController);
router.get('/', verifyToken, allowRoles('admin', 'teacher'), getAllTeacherController);
router.get('/:id', verifyToken, allowRoles('admin', 'teacher'), getSingleTeacher);
router.put('/:id', verifyToken, allowRoles('admin', 'teacher'), updateTeacherController);
router.delete('/:id', verifyToken, allowRoles('admin', 'teacher'), deleteTeacherController);

module.exports = router;
