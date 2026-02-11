import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    monthlyIncome: '',
    creditScore: '',
    existingDebt: '',
    savings: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        monthlyIncome: user.monthlyIncome ?? '',
        creditScore: user.creditScore ?? '',
        existingDebt: user.existingDebt ?? '',
        savings: user.savings ?? '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        monthlyIncome: form.monthlyIncome === '' ? undefined : Number(form.monthlyIncome),
        creditScore: form.creditScore === '' ? undefined : Number(form.creditScore),
        existingDebt: form.existingDebt === '' ? undefined : Number(form.existingDebt),
        savings: form.savings === '' ? undefined : Number(form.savings),
      };
      await updateProfile(payload);
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="page">
        <div className="card">
          <p>You must be logged in to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Profile</h1>
        <p className="page-desc">Update your personal and financial details.</p>
        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            <span className="field-label">
              Name<span className="required">*</span>
            </span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          </label>
          <label>
            Email
            <input type="email" name="email" value={form.email} disabled />
          </label>
          <label>
            Monthly income
            <input
              type="number"
              name="monthlyIncome"
              min={0}
              step={1}
              value={form.monthlyIncome}
              onChange={handleChange}
              placeholder="e.g. 50000"
            />
          </label>
          <label>
            Credit score
            <input
              type="number"
              name="creditScore"
              min={300}
              max={850}
              step={1}
              value={form.creditScore}
              onChange={handleChange}
              placeholder="e.g. 720"
            />
          </label>
          <label>
            Existing debt
            <input
              type="number"
              name="existingDebt"
              min={0}
              step={1}
              value={form.existingDebt}
              onChange={handleChange}
              placeholder="e.g. 15000"
            />
          </label>
          <label>
            Savings
            <input
              type="number"
              name="savings"
              min={0}
              step={1}
              value={form.savings}
              onChange={handleChange}
              placeholder="e.g. 80000"
            />
          </label>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

