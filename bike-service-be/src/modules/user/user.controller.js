const userService = require('./user.service');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');

const getUser = catchAsync(async (req, res, next) => {
    const user = await userService.findUserById(req.params.id);

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    res.status(200).json({
        status: 'success',
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
    getUser,
};
