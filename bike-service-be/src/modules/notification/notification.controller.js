const notificationService = require('./notification.service');
const catchAsync = require('../../utils/catchAsync');

const getNotifications = catchAsync(async (req, res, next) => {
    const notifications = await notificationService.getUserNotifications(req.user._id);

    res.status(200).json({
        status: 'success',
        results: notifications.length,
        data: {
            notifications,
        },
    });
});

const markAllAsRead = catchAsync(async (req, res, next) => {
    await notificationService.markAllAsRead(req.user._id);

    res.status(200).json({
        status: 'success',
        message: 'All notifications marked as read',
    });
});

module.exports = {
    getNotifications,
    markAllAsRead,
};
