const Notification = require('./notification.model');

const createNotification = async (userId, text, type = 'info') => {
    return await Notification.create({
        user: userId,
        text,
        type,
    });
};

const getUserNotifications = async (userId) => {
    return await Notification.find({ user: userId }).sort('-createdAt').limit(20);
};

const markAllAsRead = async (userId) => {
    return await Notification.updateMany(
        { user: userId, isRead: false },
        { isRead: true }
    );
};

module.exports = {
    createNotification,
    getUserNotifications,
    markAllAsRead,
};
