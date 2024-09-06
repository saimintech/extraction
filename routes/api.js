const express = require('express');
const router = express.Router();
const heroController = require('../controllers/heroController');

// Define the endpoint and map to controller
router.get('/get', heroController.getData);

module.exports = router;
