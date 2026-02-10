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

export default function App() {
  const [authMode, setAuthMode] = useState('register');
  const [credentials, setCredentials] = useState({ name: 'Aarav Singh', email: 'aarav@example.com', password: 'Pass@1234' });
  const [token, setToken] = useState('');
  const [profile, setProfile] = useState(profileDefaults);
  const [assessment, setAssessment] = useState(null);
  const [simulation, setSimulation] = useState(null);
  const [offers, setOffers] = useState([]);
  const [message, setMessage] = useState('Create an account to begin your loan-readiness journey.');

  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const submitAuth = async () => {
    try {
      const endpoint = authMode === 'register' ? '/auth/register' : '/auth/login';
      const payload = authMode === 'register' ? credentials : { email: credentials.email, password: credentials.password };
      const { data } = await api.post(endpoint, payload);
      setToken(data.token);
      setMessage(`Welcome, ${data.user.name}. Profile and run your assessment.`);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Authentication failed');
    }
  };

  const saveProfile = async () => {
    try {
      await api.put('/profile', profile, { headers });
      setMessage('Profile updated. Now run your Loan Readiness Score.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to save profile');
    }
  };

  const runAssessment = async () => {
    const { data } = await api.post('/assessment/run', {}, { headers });
    setAssessment(data);
    setMessage('Assessment generated with transparent explanation factors.');
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
      <header>
        <h1>LoanPathfinder</h1>
        <p>An explainable path from uncertainty to loan readiness.</p>
      </header>

      <section className="card auth">
        <div className="tabs">
          <button className={authMode === 'register' ? 'active' : ''} onClick={() => setAuthMode('register')}>Register</button>
          <button className={authMode === 'login' ? 'active' : ''} onClick={() => setAuthMode('login')}>Login</button>
        </div>
        {authMode === 'register' && <input value={credentials.name} onChange={(e) => setCredentials((p) => ({ ...p, name: e.target.value }))} placeholder="Name" />}
        <input value={credentials.email} onChange={(e) => setCredentials((p) => ({ ...p, email: e.target.value }))} placeholder="Email" />
        <input value={credentials.password} type="password" onChange={(e) => setCredentials((p) => ({ ...p, password: e.target.value }))} placeholder="Password" />
        <button onClick={submitAuth}>{authMode === 'register' ? 'Create Account' : 'Sign In'}</button>
      </section>

      <p className="status">{message}</p>

      {token && (
        <>
          <section className="card">
            <h2>Financial Profile</h2>
            <div className="grid">
              {Object.entries(profile).map(([k, v]) => (
                <label key={k}>
                  {k}
                  <input type="number" value={v} onChange={(e) => updateProfile(k, e.target.value)} />
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
