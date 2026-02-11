import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    monthlyIncome: '',
    creditScore: '',
    existingDebt: '',
    savings: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
      };
      if (form.monthlyIncome !== '') payload.monthlyIncome = Number(form.monthlyIncome);
      if (form.creditScore !== '') payload.creditScore = Number(form.creditScore);
      if (form.existingDebt !== '') payload.existingDebt = Number(form.existingDebt);
      if (form.savings !== '') payload.savings = Number(form.savings);
      await register(payload);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth-page">
      <div className="card auth-card auth-card-wide">
        <h1>Register</h1>
        {error && <p className="error-msg">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Name
            <input type="text" name="name" value={form.name} onChange={handleChange} required autoComplete="name" />
          </label>
          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={handleChange} required autoComplete="email" />
          </label>
          <label>
            Password (min 6)
            <div className="password-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((s) => !s)}
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </label>
          <label>
            Monthly income (optional)
            <input type="number" name="monthlyIncome" min={0} step={1} value={form.monthlyIncome} onChange={handleChange} placeholder="e.g. 50000" />
          </label>
          <label>
            Credit score (optional)
            <input type="number" name="creditScore" min={300} max={850} value={form.creditScore} onChange={handleChange} placeholder="e.g. 720" />
          </label>
          <label>
            Existing debt (optional)
            <input type="number" name="existingDebt" min={0} step={1} value={form.existingDebt} onChange={handleChange} placeholder="e.g. 15000" />
          </label>
          <label>
            Savings (optional)
            <input type="number" name="savings" min={0} step={1} value={form.savings} onChange={handleChange} placeholder="e.g. 80000" />
          </label>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
