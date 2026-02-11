import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="page">
      <div className="card dashboard-card">
        <h1>Welcome{user?.name ? `, ${user.name}` : ''}</h1>
        <p className="dashboard-sub">Choose a feature below to get started.</p>
        <div className="dashboard-grid">
          <Link to="/loan-score" className="dashboard-tile">
            <h2>Loan Score</h2>
            <p>Calculate your Loan Readiness Score and see estimated APR.</p>
          </Link>
          <Link to="/simulator" className="dashboard-tile">
            <h2>Simulator</h2>
            <p>What-if: see how income, debt, savings, and credit changes affect your score.</p>
          </Link>
          <Link to="/marketplace" className="dashboard-tile">
            <h2>Marketplace</h2>
            <p>Compare loan offers ranked by your goal (interest, payment, or funding speed).</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
