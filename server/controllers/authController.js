const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// Simple email format check
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/**
 * @route   POST /api/auth/register
 * @desc    Register new user, return JWT
 */
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, monthlyIncome, creditScore, existingDebt, savings } = req.body;

    if (!name || !email || !password) {
      const error = new Error('Please provide name, email and password');
      error.statusCode = 400;
      return next(error);
    }
    if (password.length < 6) {
      const error = new Error('Password must be at least 6 characters');
      error.statusCode = 400;
      return next(error);
    }
    if (!isValidEmail(email)) {
      const error = new Error('Invalid email format');
      error.statusCode = 400;
      return next(error);
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      const error = new Error('User already exists with this email');
      error.statusCode = 400;
      return next(error);
    }

    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    };
    if (typeof monthlyIncome === 'number' || (monthlyIncome !== undefined && monthlyIncome !== '')) {
      userData.monthlyIncome = Number(monthlyIncome) || 0;
    }
    if (typeof creditScore === 'number' || (creditScore !== undefined && creditScore !== '')) {
      userData.creditScore = Number(creditScore) || 650;
    }
    if (typeof existingDebt === 'number' || (existingDebt !== undefined && existingDebt !== '')) {
      userData.existingDebt = Number(existingDebt) || 0;
    }
    if (typeof savings === 'number' || (savings !== undefined && savings !== '')) {
      userData.savings = Number(savings) || 0;
    }

    const user = await User.create(userData);

    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        monthlyIncome: user.monthlyIncome,
        creditScore: user.creditScore,
        existingDebt: user.existingDebt,
        savings: user.savings,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user, return JWT
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error('Please provide email and password');
      error.statusCode = 400;
      return next(error);
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      return next(error);
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      return next(error);
    }

    const token = generateToken(user._id);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        monthlyIncome: user.monthlyIncome,
        creditScore: user.creditScore,
        existingDebt: user.existingDebt,
        savings: user.savings,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   GET /api/auth/profile
 * @desc    Get logged-in user profile (protected)
 */
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }
    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        monthlyIncome: user.monthlyIncome,
        creditScore: user.creditScore,
        existingDebt: user.existingDebt,
        savings: user.savings,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
