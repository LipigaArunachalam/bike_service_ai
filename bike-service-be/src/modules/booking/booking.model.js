const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Booking must belong to a user'],
    },
    service: {
        type: mongoose.Schema.ObjectId,
        ref: 'Service',
        required: [true, 'Booking must have a service'],
    },
    serviceDate: {
        type: Date,
        required: [true, 'Please provide a booking date'],
    },
    notes: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'cancelled'],
        default: 'pending',
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        versionKey: false,
        transform: function (doc, ret) {
            ret.id = ret._id;
            ret.userId = ret.user?.id || ret.user?._id || ret.user;
            ret.userName = ret.user?.name;
            ret.userEmail = ret.user?.email;
            ret.service = ret.service?.name || ret.service;
            ret.dateBooked = ret.createdAt?.toISOString().split('T')[0];
            ret.serviceDate = ret.serviceDate ? new Date(ret.serviceDate).toISOString().split('T')[0] : undefined;
            delete ret._id;
            delete ret.user;
        },
    },
});

// Populate user and service on find
bookingSchema.pre(/^find/, function () {
    this.populate({
        path: 'user',
        select: 'name email',
    }).populate({
        path: 'service',
        select: 'name price',
    });
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
