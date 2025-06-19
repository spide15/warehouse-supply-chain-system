import React, { useState } from 'react';
import { register } from '../services/api';

const Register = ({ onRegister }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'employee' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await register(form);
      if (form.role === 'supplier') {
        setSuccess('Your registration request has been sent to the admin. You can start selling after verification.');
      } else {
        setSuccess('Registration successful! You can now log in.');
      }
      onRegister && onRegister();
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="employee">Employee</option>
          <option value="supplier">Supplier</option>
        </select>
        <button type="submit">Register</button>
        {error && <div className="error">{error}</div>}
        {success && <div className="success" style={{color:'#388e3c',marginTop:8}}>{success}</div>}
      </form>
    </div>
  );
};
export default Register;
