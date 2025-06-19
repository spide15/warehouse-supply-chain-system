import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminKPIs, SupplierKPIs, EmployeeKPIs } from './RoleKPIs';

const Dashboard = ({ user, token, refresh }) => {
  const navigate = useNavigate();
  return (
    <div className="dashboard">
      <h2 style={{textAlign:'center', color:'#1976d2'}}>Welcome to SmartSupply!</h2>
      <div style={{marginBottom:24, textAlign:'center', color:'#555'}}>Role: <b>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</b></div>
      {user.role === 'admin' && <AdminKPIs token={token} />}
      {user.role === 'supplier' && <SupplierKPIs token={token} user={user} refresh={refresh} />}
      {user.role === 'employee' && <EmployeeKPIs token={token} user={user} refresh={refresh} />}
    </div>
  );
};
export default Dashboard;
