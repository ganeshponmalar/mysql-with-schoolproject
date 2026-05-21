const express = require('express');
const router = express.Router();
const examResultController = require('../controllers/exam_result.controller');
const { verifyToken, allowRoles } = require('../middleware/auth');

router.use(verifyToken);

router.post('/', allowRoles('admin', 'teacher'), examResultController.createResult);
router.get('/student/:id', allowRoles('admin', 'teacher', 'student', 'parent'), examResultController.getStudentResults);
router.put('/:id', allowRoles('admin', 'teacher'), examResultController.updateResult);
router.delete('/:id', allowRoles('admin'), examResultController.deleteResult);

module.exports = router;
