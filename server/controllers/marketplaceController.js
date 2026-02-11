const LoanScore = require('../models/LoanScore');
const { getLoanOffers } = require('../utils/loadLoanOffers');

const VALID_GOALS = [
  'lowest_interest',
  'lowest_monthly_payment',
  'fastest_funding',
];

function assignInterestRateFromLRS(lender, lrs) {
  if (lrs > 80) return lender.minInterest;
  if (lrs > 65) return (lender.minInterest + lender.maxInterest) / 2;
  return lender.maxInterest;
}

/**
 * @route   POST /api/marketplace/rank
 * @desc    Get loan offers ranked by user goal (protected)
 */
const getRankedLoans = async (req, res, next) => {
  try {
    // 1. Get user
    const user = req.user;
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 401;
      return next(error);
    }

    // 2. Get user's latest LoanScore from DB
    const latestScore = await LoanScore.findOne({ user: user._id }).sort({
      createdAt: -1,
    });
    if (!latestScore) {
      const error = new Error(
        'No LoanScore found. Please calculate your Loan Readiness Score first.'
      );
      error.statusCode = 400;
      return next(error);
    }

    // 3. Extract LRS value
    const lrs = Number(latestScore.loanReadinessScore) || 0;

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

    // 5. Load lenders from cached dataset
    const lenders = getLoanOffers();

    // 6. Filter lenders by profile and requested amount
    const creditScore = Number(user.creditScore) || 0;
    const monthlyIncome = Number(user.monthlyIncome) || 0;

    const eligible = lenders.filter((lender) => {
      return (
        creditScore >= lender.minCreditScore &&
        monthlyIncome >= lender.minIncome &&
        amount <= lender.maxAmount
      );
    });

    if (eligible.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No lenders available for your profile',
        goal,
        requestedAmount: amount,
        count: 0,
        loans: [],
      });
    }

    // 7-9. Assign dynamic interest rate based on LRS and compute payments
    const computed = eligible.map((lender) => {
      const assignedInterestRate = assignInterestRateFromLRS(lender, lrs);
      const totalInterest =
        amount * (assignedInterestRate / 100) * (lender.tenureMonths / 12);
      const monthlyPayment = (amount + totalInterest) / lender.tenureMonths;

      return {
        lenderName: lender.lenderName,
        assignedInterestRate: Math.round(assignedInterestRate * 100) / 100,
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        totalInterest: Math.round(totalInterest * 100) / 100,
        fundingSpeedDays: lender.fundingSpeedDays,
        processingFeePercent: lender.processingFeePercent,
        tenureMonths: lender.tenureMonths,
      };
    });

    // 10. Ranking
    if (goal === 'lowest_interest') {
      computed.sort((a, b) => a.assignedInterestRate - b.assignedInterestRate);
    } else if (goal === 'lowest_monthly_payment') {
      computed.sort((a, b) => a.monthlyPayment - b.monthlyPayment);
    } else if (goal === 'fastest_funding') {
      computed.sort((a, b) => a.fundingSpeedDays - b.fundingSpeedDays);
    }

    const top10 = computed.slice(0, 10);

    res.status(200).json({
      success: true,
      goal,
      requestedAmount: amount,
      lrs,
      count: top10.length,
      loans: top10,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getRankedLoans };
