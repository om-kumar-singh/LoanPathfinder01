import { useState } from 'react';
import api from '../services/api';

export default function Marketplace() {
  const [requestedAmount, setRequestedAmount] = useState('');
  const [goal, setGoal] = useState('lowest_interest');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const amount = Number(requestedAmount);
      if (!requestedAmount || isNaN(amount) || amount <= 0) {
        setError('Please enter a valid loan amount');
        return;
      }
      const { data } = await api.post('/marketplace/rank', { goal, requestedAmount: amount });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to get ranked loans');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Loan Marketplace</h1>
        <p className="page-desc">Commission-neutral. Loans ranked by your goal.</p>
        {error && <p className="error-msg">{error}</p>}
        <form onSubmit={handleSubmit} className="marketplace-form">
          <label>
            Your goal
            <select value={goal} onChange={(e) => setGoal(e.target.value)}>
              <option value="lowest_interest">Lowest interest</option>
              <option value="lowest_monthly_payment">Lowest monthly payment</option>
              <option value="fastest_funding">Fastest funding</option>
            </select>
          </label>
          <label>
            Loan amount (₹)
            <input
              type="number"
              min={1}
              step={1}
              value={requestedAmount}
              onChange={(e) => setRequestedAmount(e.target.value)}
              placeholder="e.g. 200000"
              required
            />
          </label>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Loading...' : 'Get ranked offers'}
          </button>
        </form>
        {result && (
          <div className="result-card marketplace-result">
            <h3>{result.count} offer{result.count !== 1 ? 's' : ''} for ₹{result.requestedAmount?.toLocaleString()}</h3>
            <p className="goal-label">Sorted by: {goal.replace(/_/g, ' ')}</p>
            <div className="loan-cards">
              {result.loans?.map((loan, i) => (
                <div key={i} className="loan-card">
                  <div className="loan-card-header">
                    <span className="loan-rank">#{i + 1}</span>
                    <span className="loan-lender">{loan.lenderName}</span>
                  </div>
                  <div className="loan-card-body">
                    <div className="loan-row">
                      <span>Interest rate</span>
                      <strong>{(loan.assignedInterestRate ?? loan.interestRate)?.toFixed?.(2) ?? (loan.assignedInterestRate ?? loan.interestRate)}%</strong>
                    </div>
                    <div className="loan-row">
                      <span>Monthly payment</span>
                      <strong>₹{loan.monthlyPayment?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
                    </div>
                    <div className="loan-row">
                      <span>Total interest</span>
                      <span>₹{loan.totalInterest?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="loan-row">
                      <span>Funding</span>
                      <span>{loan.fundingSpeedDays} day{loan.fundingSpeedDays !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {result.count === 0 && (
              <p className="empty-msg">No offers for this amount. Try a lower amount.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
