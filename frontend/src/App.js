import React, { useState } from 'react';
import AppRoutes from './routes';
import { BrowserRouter as Router, Link, useNavigate } from 'react-router-dom';
import './components/styles.css';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const handleLogin = (data) => {
    setUser(data.user);
    setToken(data.token);
    navigate('/dashboard');
  };
  const handleRegister = () => {};
  const handleLogout = () => {
    setUser(null);
    setToken('');
    window.location.href = '/';
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="nav-logo">
          Warehouse SCM
        </Link>
        <div className="nav-links">
          {user ? (
            <>
              <span style={{ marginRight: 20 }}>
                Hi, <b>{user.name}</b> ({user.role})
              </span>
              <button onClick={handleLogout} className="nav-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-btn">
                Login
              </Link>
              <Link to="/register" className="nav-btn">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
      <AppRoutes
        user={user}
        token={token}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onLogout={handleLogout}
      />
    </>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}
