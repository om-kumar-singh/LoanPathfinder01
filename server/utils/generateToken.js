const jwt = require('jsonwebtoken');

/**
 * Generate JWT for authenticated user.
 * @param {string} userId - MongoDB user _id
 * @returns {string} JWT token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

module.exports = generateToken;
