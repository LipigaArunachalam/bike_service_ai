require('dotenv').config();
const mongoose = require('mongoose');
const Booking = require('./src/modules/booking/booking.model');

const run = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/bike-service');
        const bookings = await Booking.find({});
        console.log("Bookings:", bookings);
    } catch (err) {
        console.error("DEBUG ERROR:", err);
    } finally {
        process.exit();
    }
}
run();
