const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const userService = require('../modules/user/user.service');

const auth = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        throw new ApiError(401, 'Please authenticate');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userService.findUserById(decoded.id);

    if (!user) {
        throw new ApiError(401, 'User not found');
    }

    req.user = user;
    next();
});

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new ApiError(403, 'Forbidden');
        }
        next();
    };
};

module.exports = {
    auth,
    authorize,
};
