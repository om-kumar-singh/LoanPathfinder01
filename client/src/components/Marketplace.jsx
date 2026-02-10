import { useState } from 'react';

const goals = [
  { value: 'lowest_total_interest', label: 'Lowest Total Interest' },
  { value: 'lowest_monthly_payment', label: 'Lowest Monthly Payment' },
  { value: 'fastest_funding', label: 'Fastest Funding' }
];

export default function Marketplace({ offers, onGoalChange }) {
  const [goal, setGoal] = useState(goals[0].value);

  const handleGoal = (value) => {
    setGoal(value);
    onGoalChange(value);
  };

  return (
    <div className="card">
      <h2>Commission-Neutral Marketplace</h2>
      <div className="goal-buttons">
        {goals.map((g) => (
          <button key={g.value} className={goal === g.value ? 'active' : ''} onClick={() => handleGoal(g.value)}>
            {g.label}
          </button>
        ))}
      </div>

      <div className="offer-list">
        {offers.map((offer) => (
          <article key={offer._id} className="offer-item">
            <h3>{offer.lenderName}</h3>
            <p>Estimated APR: {offer.estimatedApr}%</p>
            <p>EMI: ₹{offer.estimatedEmi}</p>
            <p>Total Interest: ₹{offer.estimatedTotalInterest}</p>
            <p>Funding in: {offer.fundingDays} day(s)</p>
          </article>
        ))}
      </div>
    </div>
  );
}
