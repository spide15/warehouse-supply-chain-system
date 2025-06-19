import React, { useEffect, useState } from 'react';
import { getProducts, getPurchaseRequests } from '../services/api';

const AdminKPIs = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    getProducts(token).then(res => setProducts(res.data));
    getPurchaseRequests(token).then(res => setRequests(res.data));
  }, [token]);
  const totalStock = products.reduce((sum, p) => sum + (p.quantity || 0), 0);
  const pending = requests.filter(r => r.status === 'pending').length;
  const approved = requests.filter(r => r.status === 'approved').length;
  const rejected = requests.filter(r => r.status === 'rejected').length;
  return (
    <div className="dashboard-cards">
      <div className="card"><b>Total Products:</b><br />{products.length}</div>
      <div className="card"><b>Total Stock:</b><br />{totalStock}</div>
      <div className="card"><b>Pending Requests:</b><br />{pending}</div>
      <div className="card"><b>Approved:</b> {approved} <b>Rejected:</b> {rejected}</div>
    </div>
  );
};

const SupplierKPIs = ({ token, user, refresh }) => {
  const [products, setProducts] = useState([]);
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    getProducts(token).then(res => setProducts(res.data.filter(p => p.supplier?._id === user.id || p.supplier === user.id)));
    getPurchaseRequests(token).then(res => setRequests(res.data.filter(r => r.product && (r.product.supplier?._id === user.id || r.product.supplier === user.id))));
  }, [token, user.id, refresh]);
  const totalStock = products.reduce((sum, p) => sum + (p.quantity || 0), 0);
  const pending = requests.filter(r => r.status === 'pending').length;
  const approved = requests.filter(r => r.status === 'approved').length;
  return (
    <div className="dashboard-cards">
      <div className="card"><b>My Products:</b><br />{products.length}</div>
      <div className="card"><b>My Stock:</b><br />{totalStock}</div>
      <div className="card"><b>Pending Dispatch:</b><br />{pending}</div>
      <div className="card"><b>Approved Requests:</b><br />{approved}</div>
    </div>
  );
};

const EmployeeKPIs = ({ token, user, refresh }) => {
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    getPurchaseRequests(token).then(res => setRequests(res.data.filter(r => r.requestedBy?._id === user.id)));
  }, [token, user.id, refresh]);
  const pending = requests.filter(r => r.status === 'pending').length;
  const approved = requests.filter(r => r.status === 'approved').length;
  const rejected = requests.filter(r => r.status === 'rejected').length;
  return (
    <div className="dashboard-cards">
      <div className="card"><b>My Requests:</b><br />{requests.length}</div>
      <div className="card"><b>Pending:</b> {pending} <b>Approved:</b> {approved} <b>Rejected:</b> {rejected}</div>
    </div>
  );
};

export { AdminKPIs, SupplierKPIs, EmployeeKPIs };
