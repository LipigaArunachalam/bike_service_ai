const express = require('express');
const userController = require('./user.controller');
const { auth } = require('../../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/:id', userController.getUser);

module.exports = router;
