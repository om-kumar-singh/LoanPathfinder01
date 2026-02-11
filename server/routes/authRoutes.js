const express = require('express');
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Optional: help debug — GET /api/auth returns available routes
router.get('/', (req, res) => {
  res.json({
    message: 'Auth API',
    routes: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET  /api/auth/profile (Authorization: Bearer <token>)',
    ],
  });
});

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

// Return 405 when /register or /login is called with GET (e.g. from browser)
router.all('/register', (req, res) => {
  res.status(405).json({ success: false, message: 'Method not allowed. Use POST to register.' });
});
router.all('/login', (req, res) => {
  res.status(405).json({ success: false, message: 'Method not allowed. Use POST to login.' });
});

module.exports = router;
