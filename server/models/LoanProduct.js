const mongoose = require('mongoose');

const loanProductSchema = new mongoose.Schema(
  {
    lenderName: {
      type: String,
      required: [true, 'Lender name is required'],
      trim: true,
    },
    interestRate: {
      type: Number,
      required: [true, 'Interest rate is required'],
    },
    maxAmount: {
      type: Number,
      required: [true, 'Max amount is required'],
    },
    tenureMonths: {
      type: Number,
      required: [true, 'Tenure in months is required'],
    },
    processingFee: {
      type: Number,
      required: [true, 'Processing fee is required'],
    },
    fundingSpeedDays: {
      type: Number,
      required: [true, 'Funding speed in days is required'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LoanProduct', loanProductSchema);
