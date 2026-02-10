import AssessmentHistory from '../models/AssessmentHistory.js';
import FinancialProfile from '../models/FinancialProfile.js';
import LoanOffer from '../models/LoanOffer.js';
import { getPrediction, getSimulation } from '../services/mlService.js';

const monthlyPayment = (principal, annualRate, tenureMonths) => {
  const r = annualRate / 1200;
  if (r === 0) return principal / tenureMonths;
  return (principal * r) / (1 - (1 + r) ** -tenureMonths);
};

export const runAssessment = async (req, res) => {
  const profile = await FinancialProfile.findOne({ userId: req.user.id }).lean();
  if (!profile) {
    return res.status(400).json({ message: 'Please complete your financial profile first' });
  }

  const prediction = await getPrediction(profile);

  await AssessmentHistory.create({
    userId: req.user.id,
    lrs: prediction.lrs,
    approvalProbability: prediction.approvalProbability,
    aprEstimate: prediction.aprEstimate,
    explanation: prediction.explanation
  });

  return res.json(prediction);
};

export const simulateScenario = async (req, res) => {
  const profile = await FinancialProfile.findOne({ userId: req.user.id }).lean();
  if (!profile) {
    return res.status(400).json({ message: 'Please complete your financial profile first' });
  }

  const simulation = await getSimulation(profile, req.body.adjustments || {});
  return res.json(simulation);
};

export const marketplace = async (req, res) => {
  const goal = req.query.goal || 'lowest_total_interest';
  const desiredAmount = Number(req.query.desiredAmount || 200000);
  const desiredTenure = Number(req.query.desiredTenure || 36);

  const offers = await LoanOffer.find({
    minAmount: { $lte: desiredAmount },
    maxAmount: { $gte: desiredAmount }
  }).lean();

  const ranked = offers.map((offer) => {
    const apr = (offer.minApr + offer.maxApr) / 2;
    const emi = monthlyPayment(desiredAmount, apr, desiredTenure);
    const totalInterest = emi * desiredTenure - desiredAmount;

    let score;
    if (goal === 'lowest_monthly_payment') score = emi;
    else if (goal === 'fastest_funding') score = offer.fundingDays;
    else score = totalInterest;

    return {
      ...offer,
      estimatedApr: Number(apr.toFixed(2)),
      estimatedEmi: Number(emi.toFixed(2)),
      estimatedTotalInterest: Number(totalInterest.toFixed(2)),
      rankingScore: Number(score.toFixed(2))
    };
  });

  ranked.sort((a, b) => a.rankingScore - b.rankingScore);
  return res.json({ goal, desiredAmount, desiredTenure, offers: ranked });
};

export const history = async (req, res) => {
  const items = await AssessmentHistory.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(10);
  return res.json(items);
};
