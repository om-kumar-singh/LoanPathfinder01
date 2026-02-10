export default function LoanReadinessBreakdown({ score, explanation = [] }) {
  const normalized = Math.max(0, Math.min(100, ((score - 300) / 600) * 100));

  return (
    <div className="card">
      <h2>Loan Readiness Score</h2>
      <div className="score-row">
        <strong>{score.toFixed(0)}</strong>
        <div className="meter">
          <div className="fill" style={{ width: `${normalized}%` }} />
        </div>
      </div>
      <ul className="insights">
        {explanation.map((item) => (
          <li key={item.feature}>
            <span>{item.feature}</span>
            <strong className={item.impactPoints >= 0 ? 'positive' : 'negative'}>
              {item.impactPoints >= 0 ? '+' : ''}
              {item.impactPoints}
            </strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
