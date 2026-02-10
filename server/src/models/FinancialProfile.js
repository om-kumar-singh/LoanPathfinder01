import mongoose from 'mongoose';

const financialProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    monthlyIncome: { type: Number, required: true },
    monthlyDebtPayment: { type: Number, required: true },
    creditUtilization: { type: Number, required: true },
    savingsBalance: { type: Number, required: true },
    employmentYears: { type: Number, required: true },
    existingLoans: { type: Number, required: true },
    creditHistoryYears: { type: Number, required: true },
    desiredLoanAmount: { type: Number, required: true }
  },
  { timestamps: true }
);

export default mongoose.model('FinancialProfile', financialProfileSchema);
