const LoanProduct = require('../models/LoanProduct');

const VALID_GOALS = ['lowest_interest', 'lowest_monthly_payment', 'fastest_funding'];

/**
 * @route   POST /api/marketplace/rank
 * @desc    Get loan offers ranked by user goal (protected)
 */
const getRankedLoans = async (req, res, next) => {
  try {
    const { goal, requestedAmount } = req.body;

    if (!goal || !VALID_GOALS.includes(goal)) {
      const error = new Error('Invalid or missing goal. Use: lowest_interest, lowest_monthly_payment, or fastest_funding');
      error.statusCode = 400;
      return next(error);
    }

    const amount = Number(requestedAmount);
    if (typeof requestedAmount === 'undefined' || requestedAmount === null || isNaN(amount) || amount <= 0) {
      const error = new Error('requestedAmount must be a positive number');
      error.statusCode = 400;
      return next(error);
    }

    const loans = await LoanProduct.find({});
    const filtered = loans.filter((loan) => loan.maxAmount >= amount);

    const withCalculations = filtered.map((loan) => {
      const totalInterest = amount * (loan.interestRate / 100) * (loan.tenureMonths / 12);
      const monthlyPayment = (amount + totalInterest) / loan.tenureMonths;
      return {
        lenderName: loan.lenderName,
        interestRate: loan.interestRate,
        maxAmount: loan.maxAmount,
        tenureMonths: loan.tenureMonths,
        processingFee: loan.processingFee,
        fundingSpeedDays: loan.fundingSpeedDays,
        totalInterest: Math.round(totalInterest * 100) / 100,
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      };
    });

    if (goal === 'lowest_interest') {
      withCalculations.sort((a, b) => a.interestRate - b.interestRate);
    } else if (goal === 'lowest_monthly_payment') {
      withCalculations.sort((a, b) => a.monthlyPayment - b.monthlyPayment);
    } else if (goal === 'fastest_funding') {
      withCalculations.sort((a, b) => a.fundingSpeedDays - b.fundingSpeedDays);
    }

    const response = withCalculations.map((loan) => ({
      lenderName: loan.lenderName,
      interestRate: loan.interestRate,
      monthlyPayment: loan.monthlyPayment,
      totalInterest: loan.totalInterest,
      fundingSpeedDays: loan.fundingSpeedDays,
    }));

    res.status(200).json({
      success: true,
      goal,
      requestedAmount: amount,
      count: response.length,
      loans: response,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getRankedLoans };
