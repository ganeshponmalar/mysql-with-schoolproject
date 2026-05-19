const express = require('express');
const router = express.Router();
const homeworkController = require('../controllers/homework.controller');
const { verifyToken, allowRoles } = require('../middleware/auth');

router.use(verifyToken);

router.post('/', allowRoles('teacher'), homeworkController.createHomework);
router.get('/class/:id', allowRoles('admin', 'teacher', 'student', 'parent'), homeworkController.getClassHomework);
router.put('/:id', allowRoles('admin', 'teacher'), homeworkController.updateHomework);
router.delete('/:id', allowRoles('admin', 'teacher'), homeworkController.deleteHomework);

module.exports = router;
