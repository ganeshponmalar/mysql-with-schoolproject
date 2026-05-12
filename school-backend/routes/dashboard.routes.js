const express = require('express');
const { getDashboardStats } = require('../controllers/dashboard.controller.js');
const { verifyToken, allowRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', verifyToken, allowRoles('admin'), getDashboardStats);

module.exports = router;
