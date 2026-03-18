const express = require('express');
const bookingController = require('../booking/booking.controller');
const { auth, authorize } = require('../../middleware/auth');

const router = express.Router();

router.use(auth);
router.use(authorize('admin'));

router.get('/bookings', bookingController.getAllBookings);
router.patch('/bookings/:id', bookingController.updateBookingStatus);
router.put('/bookings/:id', bookingController.updateBooking);
router.delete('/bookings/:id', bookingController.deleteBooking);

module.exports = router;
