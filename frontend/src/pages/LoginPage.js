import React from 'react';
import Login from '../components/Login';

const LoginPage = ({ onLogin, onSwitch }) => (
  <div>
    <Login onLogin={onLogin} />
    <div style={{textAlign:'center',marginTop:10}}>
      <button onClick={onSwitch} style={{background:'none',color:'#1976d2',border:'none',cursor:'pointer'}}>
        Don't have an account? Register
      </button>
    </div>
  </div>
);
export default LoginPage;
