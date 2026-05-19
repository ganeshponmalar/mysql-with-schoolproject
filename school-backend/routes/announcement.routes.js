const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcement.controller');
const { verifyToken, allowRoles } = require('../middleware/auth');

router.use(verifyToken);

router.post('/', allowRoles('admin', 'teacher'), announcementController.createAnnouncement);
router.get('/', announcementController.getAnnouncements);
router.delete('/:id', allowRoles('admin'), announcementController.deleteAnnouncement);

module.exports = router;
