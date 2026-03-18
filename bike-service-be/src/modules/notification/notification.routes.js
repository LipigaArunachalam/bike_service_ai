const express = require('express');
const notificationController = require('./notification.controller');
const { auth } = require('../../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', notificationController.getNotifications);
router.patch('/mark-read', notificationController.markAllAsRead);

module.exports = router;
