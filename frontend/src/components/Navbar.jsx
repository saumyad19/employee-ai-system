import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navLinks = [
    { path: '/dashboard', label: '📊 Dashboard' },
    { path: '/employees', label: '👥 Employees' },
    { path: '/add-employee', label: '➕ Add Employee' },
    { path: '/ai-analytics', label: '🤖 AI Analytics' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">⚡</span>
        <span className="brand-text">EmpAI</span>
        <span className="brand-tag">Analytics</span>
      </div>
      <div className="navbar-links">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div className="navbar-user">
        <div className="user-info">
          <span className="user-avatar">{user?.name?.[0]?.toUpperCase()}</span>
          <div>
            <p className="user-name">{user?.name}</p>
            <p className="user-role">{user?.role}</p>
          </div>
        </div>
        <button className="btn btn-secondary logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
