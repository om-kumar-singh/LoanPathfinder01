const mongoose = require('mongoose');

const breakdownItemSchema = new mongoose.Schema(
  {
    factor: { type: String, required: true },
    impact: { type: Number, required: true },
    type: { type: String, enum: ['positive', 'negative'], required: true },
  },
  { _id: false }
);

const loanScoreSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    loanReadinessScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    estimatedAPR: {
      type: Number,
      required: true,
    },
    breakdown: {
      type: [breakdownItemSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LoanScore', loanScoreSchema);
