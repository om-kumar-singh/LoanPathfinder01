const express = require('express');
const { calculateLoanScore } = require('../controllers/loanController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/calculate', protect, calculateLoanScore);

module.exports = router;
