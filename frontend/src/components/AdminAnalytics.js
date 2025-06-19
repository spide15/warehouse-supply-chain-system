import React, { useEffect, useState } from 'react';
import { getProducts, getPurchaseRequests } from '../services/api';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const AdminAnalytics = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    getProducts(token).then(res => setProducts(res.data));
    getPurchaseRequests(token).then(res => {
      // Sort by most recent first
      setRequests(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [token]);

  // Aggregate product stock
  const totalStock = products.reduce((sum, p) => sum + (p.quantity || 0), 0);
  // Aggregate requests by status
  const statusCount = requests.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="product-list" style={{maxWidth:600}}>
      <h3>Admin Analytics</h3>
      <div style={{display:'flex',gap:20,marginBottom:20}}>
        <div className="card" style={{flex:1}}>
          <b>Total Products:</b> {products.length}<br/>
          <b>Total Stock:</b> {totalStock}
        </div>
        <div className="card" style={{flex:1}}>
          <b>Purchase Requests:</b><br/>
          <span style={{color:'#1976d2'}}>Pending:</span> {statusCount['pending'] || 0}<br/>
          <span style={{color:'#388e3c'}}>Approved:</span> {statusCount['approved'] || 0}<br/>
          <span style={{color:'#d32f2f'}}>Rejected:</span> {statusCount['rejected'] || 0}
        </div>
      </div>
      <button onClick={fetchData} style={{marginBottom:10, background:'#1976d2', color:'#fff', border:'none', borderRadius:6, padding:'6px 16px', cursor:'pointer'}}>Refresh</button>
      <h4>All Purchase Requests</h4>
      {loading ? <div>Loading...</div> : (
        <table>
          <thead>
            <tr><th>Product</th><th>Qty</th><th>Status</th><th>By</th></tr>
          </thead>
          <tbody>
            {requests.map(r => (
              <tr key={r._id}>
                <td>{r.product?.name}</td>
                <td>{r.quantity}</td>
                <td>{r.status}</td>
                <td>{r.requestedBy?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
export default AdminAnalytics;
