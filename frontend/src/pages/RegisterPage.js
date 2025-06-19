import React from 'react';
import Register from '../components/Register';

const RegisterPage = ({ onRegister, onSwitch }) => (
  <div>
    <Register onRegister={onRegister} />
    <div style={{textAlign:'center',marginTop:10}}>
      <button onClick={onSwitch} style={{background:'none',color:'#1976d2',border:'none',cursor:'pointer'}}>
        Already have an account? Login
      </button>
    </div>
  </div>
);
export default RegisterPage;
