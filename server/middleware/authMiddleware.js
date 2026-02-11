const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes: verify JWT and attach user to req.user.
 * Token expected in: Authorization: Bearer <token>
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');
      if (!req.user) {
        const error = new Error('User not found');
        error.statusCode = 401;
        return next(error);
      }
      next();
    } catch (err) {
      const error = new Error('Not authorized, invalid or expired token');
      error.statusCode = 401;
      next(error);
    }
  } else {
    const error = new Error('Not authorized, no token');
    error.statusCode = 401;
    next(error);
  }
};

module.exports = { protect };
