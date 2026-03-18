require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/modules/user/user.model');
const Service = require('./src/modules/service/service.model');

const services = [
    { name: 'Full Service', description: 'Comprehensive checkup and servicing', price: 150, duration: '4 hours' },
    { name: 'Oil Change', description: 'Standard engine oil and filter change', price: 50, duration: '1 hour' },
    { name: 'Brake Adjustment', description: 'Brake pad check and calibration', price: 30, duration: '45 mins' },
    { name: 'Tire Replacement', description: 'New tire installation and balancing', price: 80, duration: '1.5 hours' },
    { name: 'Chain Lubrication', description: 'Cleaning and oiling the drive chain', price: 15, duration: '20 mins' },
    { name: 'Engine Tune-Up', description: 'Performance optimization and tuning', price: 120, duration: '3 hours' },
    { name: 'Wheel Alignment', description: 'Ensuring perfect wheel tracking', price: 40, duration: '1 hour' },
    { name: 'General Inspection', description: 'Full safety and performance check', price: 25, duration: '30 mins' },
    { name: 'Bike Wash', description: 'Thorough cleaning and polishing', price: 20, duration: '30 mins' }
];

const seedDB = async () => {
    try {
        mongoose.set('debug', true);
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        console.log('Cleaning collection...');
        await User.deleteMany({});
        await Service.deleteMany({});
        console.log('Cleaned.');

        console.log('Seeding Users...');
        const users = [
            {
                name: 'Alex Thompson',
                email: 'alex@revup.com',
                password: 'admin1234',
                role: 'admin',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop'
            },
            {
                name: 'Jordan Lee',
                email: 'jordan@revup.com',
                password: 'user1234',
                role: 'user',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop'
            },
            {
                name: 'Sam Rivera',
                email: 'sam@revup.com',
                password: 'user1234',
                role: 'user',
                avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=100&auto=format&fit=crop'
            }
        ];

        for (const u of users) {
            console.log(`Creating user: ${u.email}`);
            await User.create(u);
        }

        console.log('Seeding Services...');
        await Service.insertMany(services);

        console.log('Database Seeded! 🚀');
        process.exit();
    } catch (error) {
        console.error('SEEDING FAILED');
        console.error('Error Message:', error.message);
        if (error.errors) {
            console.error('Validation Errors:', JSON.stringify(error.errors, null, 2));
        }
        process.exit(1);
    }
};

seedDB();
