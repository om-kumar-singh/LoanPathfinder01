import { useState } from 'react';
import api from '../services/api';

export default function LoanScore() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCalculate = async () => {
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const { data } = await api.post('/loan/calculate');
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to calculate score');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Loan Readiness Score</h1>
        <p className="page-desc">Based on your profile: income, credit score, debt, and savings.</p>
        {error && <p className="error-msg">{error}</p>}
        <button type="button" className="btn-primary" onClick={handleCalculate} disabled={loading}>
          {loading ? 'Calculating...' : 'Calculate Loan Readiness Score'}
        </button>
        {result && (
          <div className="result-card loan-result">
            <div className="score-row">
              <span>Loan Readiness Score</span>
              <strong>{result.loanReadinessScore}/100</strong>
            </div>
            <div className="score-row">
              <span>Estimated APR</span>
              <strong>{result.estimatedAPR}%</strong>
            </div>
            {result.debtToIncome != null && (
              <div className="score-row">
                <span>Debt-to-Income</span>
                <strong>{result.debtToIncome}%</strong>
              </div>
            )}
            {result.breakdown?.length > 0 && (
              <div className="breakdown-section">
                <h3>Breakdown</h3>
                <div className="breakdown-cards">
                  {result.breakdown.map((item, i) => (
                    <div key={i} className={`breakdown-card ${item.type}`}>
                      <span className="breakdown-factor">{item.factor}</span>
                      <span className="breakdown-impact">
                        {item.type === 'positive' ? '+' : '-'}{item.impact}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
