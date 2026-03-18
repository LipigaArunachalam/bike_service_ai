const Service = require('./service.model');

const findAllServices = async () => {
    return await Service.find();
};

const createService = async (serviceData) => {
    return await Service.create(serviceData);
};

const updateServiceById = async (id, updateData) => {
    return await Service.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });
};

const deleteServiceById = async (id) => {
    return await Service.findByIdAndDelete(id);
};

module.exports = {
    findAllServices,
    createService,
    updateServiceById,
    deleteServiceById,
};
