const express = require('express');
const router = express.Router();
const {
    createAdmission,
    getAllAdmissions,
    getAdmissionById,
    updateAdmissionStatus,
    deleteAdmission
} = require('../controllers/admissions.controller.js');
const { verifyToken, allowRoles } = require('../middleware/auth.js');

// Public route for creating an admission (parents apply directly)
router.post('/', createAdmission);

// Protected routes (Admin only)
router.use(verifyToken);
router.use(allowRoles('admin'));

router.get('/', getAllAdmissions);
router.get('/:id', getAdmissionById);
router.put('/', updateAdmissionStatus); // wait, put /:id is preferred
router.put('/:id', updateAdmissionStatus);
router.delete('/:id', deleteAdmission);

module.exports = router;
