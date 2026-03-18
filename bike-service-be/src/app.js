const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { errorHandler } = require('./middleware/error');
const ApiError = require('./utils/ApiError');

const authRoutes = require('./modules/auth/auth.routes');
const serviceRoutes = require('./modules/service/service.routes');
const bookingRoutes = require('./modules/booking/booking.routes');
const adminRoutes = require('./modules/admin/admin.routes');
const userRoutes = require('./modules/user/user.routes');
const notificationRoutes = require('./modules/notification/notification.routes');
const { sendTestEmail } = require('./modules/notification/email.service');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Routes
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'up' });
});

// Test email route
app.get('/test-email', async (req, res, next) => {
    try {
        await sendTestEmail();
        res.status(200).json({
            status: 'success',
            message: 'Test email sent successfully to ' + process.env.EMAIL_USER
        });
    } catch (error) {
        console.error('Test Email Route Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to send test email',
            error: error.message,
            stack: error.stack
        });
    }
});

// 404 handler
app.use((req, res, next) => {
    next(new ApiError(404, 'Not found'));
});

// Error handler
app.use(errorHandler);

module.exports = app;
