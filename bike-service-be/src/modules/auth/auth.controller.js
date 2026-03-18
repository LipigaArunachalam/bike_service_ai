const userService = require('../user/user.service');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');


const register = catchAsync(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
        throw new ApiError(400, 'Email already in use');
    }

    const user = await userService.createUser({
        name,
        email,
        password,
        role,
    });

    const token = userService.signToken(user._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
            },
        },
    });
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, 'Please provide email and password');
    }

    const user = await userService.findUserByEmail(email, true);

    if (!user || !(await user.comparePassword(password, user.password))) {
        throw new ApiError(401, 'Incorrect email or password');
    }

    const token = userService.signToken(user._id);

    res.status(200).json({
        status: 'success',
        token,
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
            },
        },
    });
});

module.exports = {
    register,
    login,
};
