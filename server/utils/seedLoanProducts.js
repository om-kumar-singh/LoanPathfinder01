require('dotenv').config();
const connectDB = require('../config/db');
const LoanProduct = require('../models/LoanProduct');

const loanProducts = [
  {
    lenderName: 'Lender A',
    interestRate: 8,
    maxAmount: 500000,
    tenureMonths: 60,
    processingFee: 2000,
    fundingSpeedDays: 5,
  },
  {
    lenderName: 'Lender B',
    interestRate: 11,
    maxAmount: 300000,
    tenureMonths: 48,
    processingFee: 1500,
    fundingSpeedDays: 2,
  },
  {
    lenderName: 'Lender C',
    interestRate: 14,
    maxAmount: 200000,
    tenureMonths: 36,
    processingFee: 1000,
    fundingSpeedDays: 1,
  },
  {
    lenderName: 'Lender D',
    interestRate: 10,
    maxAmount: 400000,
    tenureMonths: 72,
    processingFee: 2500,
    fundingSpeedDays: 7,
  },
  {
    lenderName: 'Lender E',
    interestRate: 9,
    maxAmount: 350000,
    tenureMonths: 60,
    processingFee: 1800,
    fundingSpeedDays: 3,
  },
];

const seed = async () => {
  try {
    await connectDB();
    await LoanProduct.deleteMany({});
    await LoanProduct.insertMany(loanProducts);
    console.log('Loan products seeded successfully:', loanProducts.length);
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
};

seed();
