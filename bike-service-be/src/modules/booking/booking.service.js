const Booking = require('./booking.model');
const Service = require('../service/service.model');

const createBooking = async (bookingData) => {
    // If service name is provided instead of ID (ObjectId is 24 hex chars)
    if (bookingData.service && typeof bookingData.service === 'string' && bookingData.service.length !== 24) {
        const service = await Service.findOne({ name: bookingData.service });
        if (service) {
            bookingData.service = service._id;
        }
    }
    return await Booking.create(bookingData);
};

const findUserBookings = async (userId) => {
    return await Booking.find({ user: userId });
};

const findAllBookings = async () => {
    return await Booking.find();
};

const updateBookingStatus = async (id, status) => {
    return await Booking.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
    ).populate('user').populate('service');
};

const updateBookingById = async (id, updateData) => {
    return await Booking.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
    ).populate('user').populate('service');
};

const deleteBookingById = async (id) => {
    return await Booking.findByIdAndDelete(id);
};

module.exports = {
    createBooking,
    findUserBookings,
    findAllBookings,
    updateBookingStatus,
    updateBookingById,
    deleteBookingById,
};
