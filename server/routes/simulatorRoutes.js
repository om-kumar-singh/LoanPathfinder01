const express = require('express');
const { simulateLoanScenario } = require('../controllers/simulatorController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/run', protect, simulateLoanScenario);

module.exports = router;
