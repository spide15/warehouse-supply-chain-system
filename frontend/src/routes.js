import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

const AppRoutes = ({ user, token, onLogin, onRegister, onLogout }) => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<LoginPage onLogin={onLogin} />} />
    <Route path="/register" element={<RegisterPage onRegister={onRegister} />} />
    <Route path="/dashboard" element={user ? <DashboardPage user={user} token={token} /> : <Navigate to="/login" />} />
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);
export default AppRoutes;
