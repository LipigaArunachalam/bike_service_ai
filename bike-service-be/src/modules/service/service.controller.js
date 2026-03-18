const serviceService = require('./service.service');
const catchAsync = require('../../utils/catchAsync');
const ApiError = require('../../utils/ApiError');

const getAllServices = catchAsync(async (req, res, next) => {
    const services = await serviceService.findAllServices();
    res.status(200).json({
        status: 'success',
        results: services.length,
        data: {
            services,
        },
    });
});

const createService = catchAsync(async (req, res, next) => {
    const newService = await serviceService.createService(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            service: newService,
        },
    });
});

const updateService = catchAsync(async (req, res, next) => {
    const service = await serviceService.updateServiceById(req.params.id, req.body);

    if (!service) {
        throw new ApiError(404, 'No service found with that ID');
    }

    res.status(200).json({
        status: 'success',
        data: {
            service,
        },
    });
});

const deleteService = catchAsync(async (req, res, next) => {
    const service = await serviceService.deleteServiceById(req.params.id);

    if (!service) {
        throw new ApiError(404, 'No service found with that ID');
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

module.exports = {
    getAllServices,
    createService,
    updateService,
    deleteService,
};
