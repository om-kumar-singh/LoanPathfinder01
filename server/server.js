require('dotenv').config();
const connectDB = require('./config/db');
const app = require('./app');
const path = require('path');
const { loadLoanOffers } = require('./utils/loadLoanOffers');

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();

  const offers = await loadLoanOffers(
    path.join(__dirname, 'data', 'realLoanOffers_1000.csv')
  );
  console.log(`Loan Offers Dataset Loaded: ${offers.length} records`);

  app.listen(PORT, () => {
    console.log(
      `Server running on port ${PORT} (${process.env.NODE_ENV || 'development'})`
    );
  });
}

start().catch((err) => {
  console.error('Server startup failed:', err);
  process.exit(1);
});
