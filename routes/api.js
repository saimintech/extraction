const express = require('express');
const router = express.Router();
const heroController = require('../controllers/heroController');

// Define the endpoint and map to controller
router.get('/', (req, res) => {
  res.json({ message: 'The agent is up and running!' });
});


router.get('/get', heroController.getData);

module.exports = router;
