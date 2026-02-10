import { useState } from 'react';

const initialAdjustments = {
  monthlyDebtPayment: -5000,
  monthlyIncome: 10000,
  savingsBalance: 50000
};

export default function WhatIfSimulator({ onRun, simulation }) {
  const [adjustments, setAdjustments] = useState(initialAdjustments);

  const update = (field, value) => {
    setAdjustments((prev) => ({ ...prev, [field]: Number(value) }));
  };

  return (
    <div className="card">
      <h2>What-If Simulator</h2>

      <label>
        Debt Payment Change (₹)
        <input type="range" min={-20000} max={10000} step={500} value={adjustments.monthlyDebtPayment} onChange={(e) => update('monthlyDebtPayment', e.target.value)} />
        <span>{adjustments.monthlyDebtPayment}</span>
      </label>

      <label>
        Income Change (₹)
        <input type="range" min={-10000} max={30000} step={500} value={adjustments.monthlyIncome} onChange={(e) => update('monthlyIncome', e.target.value)} />
        <span>{adjustments.monthlyIncome}</span>
      </label>

      <label>
        Savings Change (₹)
        <input type="range" min={-100000} max={200000} step={1000} value={adjustments.savingsBalance} onChange={(e) => update('savingsBalance', e.target.value)} />
        <span>{adjustments.savingsBalance}</span>
      </label>

      <button onClick={() => onRun(adjustments)}>Run projection</button>

      {simulation && (
        <div className="sim-output">
          <p>APR change: {simulation.before.aprEstimate}% → {simulation.after.aprEstimate}% ({simulation.delta.aprEstimate > 0 ? '+' : ''}{simulation.delta.aprEstimate})</p>
          <p>LRS change: {simulation.before.lrs} → {simulation.after.lrs} ({simulation.delta.lrs > 0 ? '+' : ''}{simulation.delta.lrs})</p>
          <p>Approval chance: {simulation.before.approvalProbability}% → {simulation.after.approvalProbability}%</p>
        </div>
      )}
    </div>
  );
}
