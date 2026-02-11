/**
 * Shared scoring logic (same as loanController).
 * @returns { score, apr }
 */
function computeScoreAndAPR(monthlyIncome, creditScore, existingDebt, savings) {
  const baseScore = 50;
  const creditImpact = (creditScore - 600) * 0.1;
  const incomeImpact = monthlyIncome * 0.0005;
  const debtImpact = existingDebt * 0.0007;
  const savingsImpact = savings * 0.0003;

  let score = baseScore + creditImpact + incomeImpact - debtImpact + savingsImpact;
  score = Math.max(0, Math.min(100, Math.round(score * 10) / 10));

  let apr = 18;
  if (score > 80) apr = 8;
  else if (score > 65) apr = 11;
  else if (score > 50) apr = 14;

  return { score, apr };
}

/**
 * @route   POST /api/simulator/run
 * @desc    Simulate Loan Readiness Score with hypothetical financial changes (protected)
 */
const simulateLoanScenario = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 401;
      return next(error);
    }

    // 1. Original user financial data
    const monthlyIncome = Number(user.monthlyIncome) || 0;
    const creditScore = Number(user.creditScore) || 650;
    const existingDebt = Number(user.existingDebt) || 0;
    const savings = Number(user.savings) || 0;

    // 2. Hypothetical changes from body (default 0)
    const incomeChange = Number(req.body.incomeChange) || 0;
    const debtChange = Number(req.body.debtChange) || 0;
    const savingsChange = Number(req.body.savingsChange) || 0;
    const creditScoreChange = Number(req.body.creditScoreChange) || 0;

    // 3. Simulated values (prevent negatives)
    const newIncome = Math.max(0, monthlyIncome + incomeChange);
    const newDebt = Math.max(0, existingDebt - debtChange);
    const newSavings = Math.max(0, savings + savingsChange);
    const newCreditScore = Math.max(300, Math.min(850, creditScore + creditScoreChange));

    // 4 & 5. Same scoring formula and APR as loanController
    const { score: originalScore, apr: originalAPR } = computeScoreAndAPR(
      monthlyIncome,
      creditScore,
      existingDebt,
      savings
    );
    const { score: simulatedScore, apr: simulatedAPR } = computeScoreAndAPR(
      newIncome,
      newCreditScore,
      newDebt,
      newSavings
    );

    // 6. Comparison
    const scoreImprovement = Math.round((simulatedScore - originalScore) * 10) / 10;

    // 7. Message (e.g. "APR reduced by 3%")
    let message = '';
    const aprDiff = simulatedAPR - originalAPR;
    if (aprDiff < 0) {
      message = `APR reduced by ${Math.abs(aprDiff)}%`;
    } else if (aprDiff > 0) {
      message = `APR increased by ${aprDiff}%`;
    } else {
      message = 'APR unchanged';
    }

    res.status(200).json({
      success: true,
      originalScore,
      simulatedScore,
      scoreImprovement,
      originalAPR,
      simulatedAPR,
      message,
      simulatedValues: {
        newIncome,
        newDebt,
        newSavings,
        newCreditScore,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { simulateLoanScenario };
