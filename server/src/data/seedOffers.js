import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import LoanOffer from '../models/LoanOffer.js';

dotenv.config();

const offers = [
  { lenderName: 'TrustAxis Finance', minApr: 9.5, maxApr: 14.2, minAmount: 50000, maxAmount: 1000000, maxTenureMonths: 72, fundingDays: 3 },
  { lenderName: 'NavaCapital', minApr: 10.2, maxApr: 16.4, minAmount: 25000, maxAmount: 800000, maxTenureMonths: 60, fundingDays: 2 },
  { lenderName: 'SaharaCredit Union', minApr: 8.9, maxApr: 13.8, minAmount: 75000, maxAmount: 1200000, maxTenureMonths: 84, fundingDays: 5 },
  { lenderName: 'MetroLend', minApr: 11.1, maxApr: 17.9, minAmount: 20000, maxAmount: 500000, maxTenureMonths: 48, fundingDays: 1 },
  { lenderName: 'HarborLine Bank', minApr: 9.8, maxApr: 15.0, minAmount: 100000, maxAmount: 1500000, maxTenureMonths: 96, fundingDays: 4 }
];

const run = async () => {
  await connectDB();
  await LoanOffer.deleteMany({});
  await LoanOffer.insertMany(offers);
  console.log('Loan offers seeded');
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
