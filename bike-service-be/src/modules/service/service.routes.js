const express = require('express');
const serviceController = require('./service.controller');
const { auth, authorize } = require('../../middleware/auth');

const router = express.Router();

router
    .route('/')
    .get(serviceController.getAllServices)
    .post(auth, authorize('admin'), serviceController.createService);

router
    .route('/:id')
    .patch(auth, authorize('admin'), serviceController.updateService)
    .delete(auth, authorize('admin'), serviceController.deleteService);

module.exports = router;
