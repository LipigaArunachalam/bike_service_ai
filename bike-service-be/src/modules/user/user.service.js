const User = require('./user.model');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createUser = async (userData) => {
    return await User.create(userData);
};

const findUserByEmail = async (email, selectPassword = false) => {
    const query = User.findOne({ email });
    if (selectPassword) query.select('+password');
    return await query;
};

const findUserById = async (id) => {
    return await User.findById(id);
};

module.exports = {
    signToken,
    createUser,
    findUserByEmail,
    findUserById,
};
