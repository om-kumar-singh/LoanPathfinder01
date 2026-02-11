const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

let cachedOffers = null;
let loadPromise = null;

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Load CSV dataset once and cache in memory.
 * Call this at server startup.
 */
async function loadLoanOffers(
  csvFilePath = path.join(__dirname, '..', 'data', 'realLoanOffers_1000.csv')
) {
  if (cachedOffers) return cachedOffers;
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(csvFilePath)
      .on('error', (err) => reject(err))
      .pipe(csv())
      .on('data', (row) => {
        // Normalize and coerce types from CSV
        results.push({
          lenderName: String(row.lenderName || '').trim(),
          minInterest: toNumber(row.minInterest),
          maxInterest: toNumber(row.maxInterest),
          maxAmount: toNumber(row.maxAmount),
          tenureMonths: toNumber(row.tenureMonths),
          processingFeePercent: toNumber(row.processingFeePercent),
          fundingSpeedDays: toNumber(row.fundingSpeedDays),
          minCreditScore: toNumber(row.minCreditScore),
          minIncome: toNumber(row.minIncome),
        });
      })
      .on('end', () => {
        cachedOffers = results.filter((r) => r.lenderName);
        resolve(cachedOffers);
      });
  });

  return loadPromise;
}

/**
 * Return cached offers.
 * Throws if called before dataset is loaded.
 */
function getLoanOffers() {
  if (!cachedOffers) {
    throw new Error(
      'Loan offers dataset not loaded. Call loadLoanOffers() at server startup.'
    );
  }
  return cachedOffers;
}

module.exports = { loadLoanOffers, getLoanOffers };

