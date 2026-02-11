import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        LoanPathfinder
      </Link>
      <button
        type="button"
        className="navbar-menu-toggle"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
      >
        <span />
        <span />
        <span />
      </button>
      {menuOpen && <div className="navbar-backdrop" onClick={() => setMenuOpen(false)} />}
      <nav className={`navbar-links ${menuOpen ? 'navbar-links-open' : ''}`}>
        {user ? (
          <>
            <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
              Dashboard
            </Link>
            <Link to="/loan-score" onClick={() => setMenuOpen(false)}>
              Loan Score
            </Link>
            <Link to="/simulator" onClick={() => setMenuOpen(false)}>
              Simulator
            </Link>
            <Link to="/marketplace" onClick={() => setMenuOpen(false)}>
              Marketplace
            </Link>
            <Link to="/profile" onClick={() => setMenuOpen(false)}>
              Profile
            </Link>
            <button type="button" className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
            <Link to="/register" onClick={() => setMenuOpen(false)}>
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
