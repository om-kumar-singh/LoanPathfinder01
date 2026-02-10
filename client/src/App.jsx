import { useMemo, useState } from 'react';
import axios from 'axios';
import StatCard from './components/StatCard';
import LoanReadinessBreakdown from './components/LoanReadinessBreakdown';
import WhatIfSimulator from './components/WhatIfSimulator';
import Marketplace from './components/Marketplace';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

const profileDefaults = {
  monthlyIncome: 80000,
  monthlyDebtPayment: 12000,
  creditUtilization: 38,
  savingsBalance: 120000,
  employmentYears: 4,
  existingLoans: 1,
  creditHistoryYears: 5,
  desiredLoanAmount: 350000
};

const profileFieldLabels = {
  monthlyIncome: 'Monthly Income (₹)',
  monthlyDebtPayment: 'Monthly Debt Payment (₹)',
  creditUtilization: 'Credit Utilization (%)',
  savingsBalance: 'Savings Balance (₹)',
  employmentYears: 'Employment Years',
  existingLoans: 'Existing Loans Count',
  creditHistoryYears: 'Credit History (Years)',
  desiredLoanAmount: 'Desired Loan Amount (₹)'
};

export default function App() {
  const [authMode, setAuthMode] = useState('register');
  const [credentials, setCredentials] = useState({ name: 'Aarav Singh', email: 'aarav@example.com', password: 'Pass@1234' });
  const [token, setToken] = useState('');
  const [profile, setProfile] = useState(profileDefaults);
  const [assessment, setAssessment] = useState(null);
  const [simulation, setSimulation] = useState(null);
  const [offers, setOffers] = useState([]);
  const [message, setMessage] = useState('Create your account to begin your loan-readiness journey.');

  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const submitAuth = async () => {
    try {
      const endpoint = authMode === 'register' ? '/auth/register' : '/auth/login';
      const payload = authMode === 'register' ? credentials : { email: credentials.email, password: credentials.password };
      const { data } = await api.post(endpoint, payload);
      setToken(data.token);
      setMessage(`Welcome back, ${data.user.name}. Update your profile and run assessment.`);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Authentication failed. Please retry.');
    }
  };

  const saveProfile = async () => {
    try {
      await api.put('/profile', profile, { headers });
      setMessage('Profile saved. You can now run the Loan Readiness Score.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to save profile');
    }
  };

  const runAssessment = async () => {
    const { data } = await api.post('/assessment/run', {}, { headers });
    setAssessment(data);
    setMessage('Assessment generated with transparent factor-level explanation.');
    await loadOffers('lowest_total_interest');
  };

  const runSimulation = async (adjustments) => {
    const { data } = await api.post('/assessment/simulate', { adjustments }, { headers });
    setSimulation(data);
  };

  const loadOffers = async (goal) => {
    const { data } = await api.get(`/assessment/marketplace?goal=${goal}&desiredAmount=${profile.desiredLoanAmount}&desiredTenure=36`, { headers });
    setOffers(data.offers);
  };

  const updateProfile = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: Number(value) }));
  };

  return (
    <main className="layout">
      <header className="page-header">
        <p className="eyebrow">LoanPathfinder</p>
        <h1>Transparent Loan Assessment for Real-World Decisions</h1>
        <p className="intro">Understand your eligibility, improve your profile, and compare offers on your terms.</p>
      </header>

      <section className="card auth">
        <div className="tabs">
          <button className={authMode === 'register' ? 'active' : ''} onClick={() => setAuthMode('register')}>Register</button>
          <button className={authMode === 'login' ? 'active' : ''} onClick={() => setAuthMode('login')}>Login</button>
        </div>
        {authMode === 'register' && <input value={credentials.name} onChange={(e) => setCredentials((p) => ({ ...p, name: e.target.value }))} placeholder="Full Name" />}
        <input value={credentials.email} onChange={(e) => setCredentials((p) => ({ ...p, email: e.target.value }))} placeholder="Email Address" />
        <input value={credentials.password} type="password" onChange={(e) => setCredentials((p) => ({ ...p, password: e.target.value }))} placeholder="Password" />
        <button onClick={submitAuth}>{authMode === 'register' ? 'Create Account' : 'Sign In'}</button>
      </section>

      <p className="status">{message}</p>

      {token && (
        <>
          <section className="card">
            <h2>Financial Profile</h2>
            <div className="grid">
              {Object.entries(profile).map(([field, value]) => (
                <label key={field}>
                  {profileFieldLabels[field]}
                  <input type="number" value={value} onChange={(e) => updateProfile(field, e.target.value)} />
                </label>
              ))}
            </div>
            <div className="actions">
              <button onClick={saveProfile}>Save Profile</button>
              <button onClick={runAssessment}>Run LRS Assessment</button>
            </div>
          </section>

          {assessment && (
            <section className="stats">
              <StatCard label="Projected APR" value={`${assessment.aprEstimate}%`} accent="orange" />
              <StatCard label="Approval Probability" value={`${assessment.approvalProbability}%`} accent="green" />
            </section>
          )}

          {assessment && <LoanReadinessBreakdown score={assessment.lrs} explanation={assessment.explanation} />}
          {assessment && <WhatIfSimulator onRun={runSimulation} simulation={simulation} />}
          {assessment && <Marketplace offers={offers} onGoalChange={loadOffers} />}
        </>
      )}
    </main>
  );
}
