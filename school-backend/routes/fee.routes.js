const express = require('express');
const router = express.Router();
const { verifyToken, allowRoles } = require('../middleware/auth');
const { createFee, getAllFees, getMyFees, updateFee, deleteFee } = require('../controllers/fee.controller');

// Teacher/Admin routes
router.post('/', verifyToken, allowRoles('admin', 'teacher'), createFee);
router.get('/all', verifyToken, allowRoles('admin', 'teacher'), getAllFees);
router.put('/:id', verifyToken, allowRoles('admin', 'teacher'), updateFee);
router.delete('/:id', verifyToken, allowRoles('admin'), deleteFee);

// Student routes
router.get('/my', verifyToken, allowRoles('student'), getMyFees);

module.exports = router;
