const LoanScore = require('../models/LoanScore');

/**
 * @route   POST /api/loan/calculate
 * @desc    Calculate Loan Readiness Score from user financial data (protected)
 */
const calculateLoanScore = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 401;
      return next(error);
    }

    const monthlyIncome = Number(user.monthlyIncome) || 0;
    const creditScore = Number(user.creditScore) || 650;
    const existingDebt = Number(user.existingDebt) || 0;
    const savings = Number(user.savings) || 0;

    // 2. Debt-to-Income ratio (for reference; not in LRS formula)
    const debtToIncome =
      monthlyIncome > 0 ? (existingDebt / monthlyIncome) * 100 : 0;

    // 3. Loan Readiness Score (0-100)
    const baseScore = 50;
    const creditImpact = (creditScore - 600) * 0.1;
    const incomeImpact = monthlyIncome * 0.0005;
    const debtImpact = existingDebt * 0.0007;
    const savingsImpact = savings * 0.0003;

    let loanReadinessScore =
      baseScore + creditImpact + incomeImpact - debtImpact + savingsImpact;
    loanReadinessScore = Math.max(0, Math.min(100, Math.round(loanReadinessScore * 10) / 10));

    // 4. Estimate APR
    let estimatedAPR = 18;
    if (loanReadinessScore > 80) estimatedAPR = 8;
    else if (loanReadinessScore > 65) estimatedAPR = 11;
    else if (loanReadinessScore > 50) estimatedAPR = 14;

    // 5. Breakdown array
    const breakdown = [
      {
        factor: 'Credit Score',
        impact: Math.round(creditImpact * 100) / 100,
        type: creditImpact >= 0 ? 'positive' : 'negative',
      },
      {
        factor: 'Monthly Income',
        impact: Math.round(incomeImpact * 100) / 100,
        type: 'positive',
      },
      {
        factor: 'Existing Debt',
        impact: Math.round(debtImpact * 100) / 100,
        type: 'negative',
      },
      {
        factor: 'Savings Buffer',
        impact: Math.round(savingsImpact * 100) / 100,
        type: 'positive',
      },
    ];

    // 6. Save LoanScore in DB
    const loanScoreDoc = await LoanScore.create({
      user: user._id,
      loanReadinessScore,
      estimatedAPR,
      breakdown,
    });

    // 7. Return response
    res.status(200).json({
      success: true,
      loanReadinessScore: loanScoreDoc.loanReadinessScore,
      estimatedAPR: loanScoreDoc.estimatedAPR,
      breakdown: loanScoreDoc.breakdown,
      debtToIncome: Math.round(debtToIncome * 10) / 10,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { calculateLoanScore };
