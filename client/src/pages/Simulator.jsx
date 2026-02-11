import { useState } from 'react';
import api from '../services/api';

export default function Simulator() {
  const [incomeChange, setIncomeChange] = useState(0);
  const [debtChange, setDebtChange] = useState(0);
  const [savingsChange, setSavingsChange] = useState(0);
  const [creditScoreChange, setCreditScoreChange] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRun = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const body = {};
      if (incomeChange !== 0) body.incomeChange = Number(incomeChange);
      if (debtChange !== 0) body.debtChange = Number(debtChange);
      if (savingsChange !== 0) body.savingsChange = Number(savingsChange);
      if (creditScoreChange !== 0) body.creditScoreChange = Number(creditScoreChange);
      const { data } = await api.post('/simulator/run', body);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Simulation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <h1>What-If Simulator</h1>
        <p className="page-desc">See how your Loan Readiness Score and APR change with hypothetical changes.</p>
        {error && <p className="error-msg">{error}</p>}
        <form onSubmit={handleRun} className="simulator-form">
          <label>
            Income change (₹): {incomeChange}
            <input
              type="range"
              min="-50000"
              max="100000"
              step="1000"
              value={incomeChange}
              onChange={(e) => setIncomeChange(Number(e.target.value))}
            />
          </label>
          <label>
            Debt paid off (₹): {debtChange}
            <input
              type="range"
              min="0"
              max="100000"
              step="1000"
              value={debtChange}
              onChange={(e) => setDebtChange(Number(e.target.value))}
            />
          </label>
          <label>
            Savings change (₹): {savingsChange}
            <input
              type="range"
              min="-20000"
              max="100000"
              step="1000"
              value={savingsChange}
              onChange={(e) => setSavingsChange(Number(e.target.value))}
            />
          </label>
          <label>
            Credit score change: {creditScoreChange}
            <input
              type="range"
              min="-50"
              max="50"
              step="5"
              value={creditScoreChange}
              onChange={(e) => setCreditScoreChange(Number(e.target.value))}
            />
          </label>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Running...' : 'Run Simulation'}
          </button>
        </form>
        {result && (
          <div className="result-card simulator-result">
            <h3>Comparison</h3>
            <div className="sim-grid">
              <div className="sim-item">
                <span className="sim-label">Original Score</span>
                <span className="sim-value">{result.originalScore}/100</span>
              </div>
              <div className="sim-item">
                <span className="sim-label">Simulated Score</span>
                <span className="sim-value highlight">{result.simulatedScore}/100</span>
              </div>
              <div className="sim-item">
                <span className="sim-label">Improvement</span>
                <span className={`sim-value ${result.scoreImprovement >= 0 ? 'positive' : 'negative'}`}>
                  {result.scoreImprovement >= 0 ? '+' : ''}{result.scoreImprovement}
                </span>
              </div>
              <div className="sim-item">
                <span className="sim-label">Original APR</span>
                <span className="sim-value">{result.originalAPR}%</span>
              </div>
              <div className="sim-item">
                <span className="sim-label">Simulated APR</span>
                <span className="sim-value highlight">{result.simulatedAPR}%</span>
              </div>
            </div>
            <p className="sim-message">{result.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
