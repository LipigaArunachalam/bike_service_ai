const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Notification must belong to a user'],
    },
    text: {
        type: String,
        required: [true, 'Notification must have text'],
    },
    type: {
        type: String,
        enum: ['success', 'info', 'warning'],
        default: 'info',
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
