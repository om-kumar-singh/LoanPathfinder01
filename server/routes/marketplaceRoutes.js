const express = require('express');
const { getRankedLoans } = require('../controllers/marketplaceController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/rank', protect, getRankedLoans);

module.exports = router;
