const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A service must have a name'],
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'A service must have a description'],
    },
    price: {
        type: Number,
        required: [true, 'A service must have a price'],
    },
    duration: {
        type: String,
        required: [true, 'A service must have a duration (e.g., 2 hours)'],
    },
}, {
    timestamps: true,
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
