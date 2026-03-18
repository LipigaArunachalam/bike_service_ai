const express = require('express');
const bookingController = require('./booking.controller');
const { auth, authorize } = require('../../middleware/auth');

const router = express.Router();

router.use(auth); // All booking routes are protected

router
    .route('/')
    .get(bookingController.getMyBookings)
    .post(bookingController.createBooking);

module.exports = router;
