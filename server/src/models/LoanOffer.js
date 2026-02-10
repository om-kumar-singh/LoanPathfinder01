import mongoose from 'mongoose';

const loanOfferSchema = new mongoose.Schema(
  {
    lenderName: { type: String, required: true },
    minApr: { type: Number, required: true },
    maxApr: { type: Number, required: true },
    minAmount: { type: Number, required: true },
    maxAmount: { type: Number, required: true },
    maxTenureMonths: { type: Number, required: true },
    fundingDays: { type: Number, required: true },
    commissionWeight: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('LoanOffer', loanOfferSchema);
