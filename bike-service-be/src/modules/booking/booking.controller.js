const bookingService = require('./booking.service');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');
const { sendEmail } = require('../notification/email.service');
const notificationService = require('../notification/notification.service');

const createBooking = catchAsync(async (req, res, next) => {
    let newBooking = await bookingService.createBooking({
        user: req.user._id,
        service: req.body.serviceId || req.body.service, // Handle both ID and Name
        serviceDate: req.body.serviceDate,
        notes: req.body.notes,
    });

    // Populate user and service for email notification
    newBooking = await newBooking.populate('user');
    newBooking = await newBooking.populate('service');

    // Send confirmation email
    const message = `Hello ${newBooking.user.name}, your bike service for "${newBooking.service.name}" on ${new Date(newBooking.serviceDate).toLocaleDateString()} has been booked successfully. We will notify you when it's completed!`;
    console.log(`Attempting to send confirmation email for booking ${newBooking._id}`);
    console.log(`Recipient email: ${newBooking.user.email}`);

    try {
        await sendEmail({
            email: newBooking.user.email,
            subject: 'Booking Confirmation - RevUp',
            message,
        });
        console.log(`Confirmation email sent successfully for booking ${newBooking._id}`);
    } catch (err) {
        console.error(`Failed to send confirmation email for booking ${newBooking._id}:`, err.message);
    }

    // Trigger in-app notification
    await notificationService.createNotification(
        req.user._id,
        `New booking created for ${newBooking.service.name}`,
        'success'
    );

    res.status(201).json({
        status: 'success',
        data: {
            booking: newBooking,
        },
    });
});

const getMyBookings = catchAsync(async (req, res, next) => {
    const bookings = await bookingService.findUserBookings(req.user._id);

    res.status(200).json({
        status: 'success',
        results: bookings.length,
        data: {
            bookings,
        },
    });
});

const getAllBookings = catchAsync(async (req, res, next) => {
    const bookings = await bookingService.findAllBookings();

    res.status(200).json({
        status: 'success',
        results: bookings.length,
        data: {
            bookings,
        },
    });
});

const updateBookingStatus = catchAsync(async (req, res, next) => {
    console.log(`--- Status Update Request ---`);
    console.log(`Booking ID: ${req.params.id}, New Status: ${req.body.status}`);

    const booking = await bookingService.updateBookingStatus(
        req.params.id,
        req.body.status
    );

    if (!booking) {
        console.error(`Booking not found: ${req.params.id}`);
        throw new ApiError(404, 'No booking found with that ID');
    }

    // Send notification for status change
    // Using a simple message for any status update
    const statusMessages = {
        'pending': 'is now pending authorization',
        'in-progress': 'is now in progress',
        'completed': 'is now completed'
    };

    const statusMsg = statusMessages[booking.status] || `has been updated to ${booking.status}`;
    const message = `Hello ${booking.user?.name || 'Customer'}, your bike service "${booking.service?.name || 'Bike Service'}" ${statusMsg}. Thank you for choosing RevUp!`;
    
    console.log(`Preparing to send status update email...`);
    // Ensure we have user email
    const recipientEmail = booking.user?.email;

    if (recipientEmail) {
        console.log(`Attempting to send ${booking.status} email to: ${recipientEmail}`);
        try {
            await sendEmail({
                email: recipientEmail,
                subject: `Service ${booking.status.toUpperCase()} - RevUp`,
                message,
            });
            console.log(`Status update email sent successfully.`);
        } catch (err) {
            console.error(`Failed to send status update email:`, err.message);
        }
    }

    // Trigger in-app notification
    await notificationService.createNotification(
        booking.user._id || booking.user,
        `Your bike service "${booking.service?.name}" ${statusMsg}`,
        booking.status === 'completed' ? 'success' : 'info'
    );

    res.status(200).json({
        status: 'success',
        data: {
            booking,
        },
    });
});

const updateBooking = catchAsync(async (req, res, next) => {
    const booking = await bookingService.updateBookingById(
        req.params.id,
        req.body
    );

    if (!booking) {
        throw new ApiError(404, 'No booking found with that ID');
    }

    // Trigger notification if status changed or if it was explicitly cancelled
    if (req.body.status) {
        const statusMessages = {
            'pending': 'is now pending authorization',
            'in-progress': 'is now in progress',
            'completed': 'is now completed',
            'cancelled': 'has been cancelled'
        };

        const statusMsg = statusMessages[booking.status] || `has been updated to ${booking.status}`;
        
        await notificationService.createNotification(
            booking.user._id || booking.user,
            `Your bike service "${booking.service?.name}" ${statusMsg}`,
            booking.status === 'completed' ? 'success' : (booking.status === 'cancelled' ? 'warning' : 'info')
        );

        // Also send email if status is cancelled (others are handled in updateBookingStatus, but this is a general update)
        if (booking.status === 'cancelled' && booking.user?.email) {
            try {
                await sendEmail({
                    email: booking.user.email,
                    subject: 'Service Cancelled - RevUp',
                    message: `Hello ${booking.user.name}, your bike service "${booking.service.name}" has been cancelled. If you have any questions, please contact us.`,
                });
            } catch (err) {
                console.error('Failed to send cancellation email:', err.message);
            }
        }
    }

    res.status(200).json({
        status: 'success',
        data: {
            booking,
        },
    });
});

const deleteBooking = catchAsync(async (req, res, next) => {
    const booking = await bookingService.deleteBookingById(req.params.id);

    if (!booking) {
        throw new ApiError(404, 'No booking found with that ID');
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

module.exports = {
    createBooking,
    getMyBookings,
    getAllBookings,
    updateBookingStatus,
    updateBooking,
    deleteBooking,
};
