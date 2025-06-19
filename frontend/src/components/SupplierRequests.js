import React, { useEffect, useState } from 'react';
import { getPurchaseRequests } from '../services/api';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const SupplierRequests = ({ token, user, onStatusChange }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    getPurchaseRequests(token).then(res => {
      // Only show requests for products supplied by this supplier
      const filtered = res.data.filter(r => r.product && (r.product.supplier?._id === user.id || r.product.supplier === user.id));
      setRequests(filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [token, onStatusChange]);

  const handleAction = async (id, status) => {
    await axios.put(`${API_URL}/purchase/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
    fetchData();
    if (onStatusChange) onStatusChange();
  };

  if (!requests.length) return null;
  return (
    <div className="product-list" style={{ maxWidth: 700, margin: '2rem auto', background: '#f9f9ff' }}>
      <h3>My Product Requests</h3>
      {loading ? <div>Loading...</div> : (
        <table className="styled-table">
          <thead>
            <tr><th>Product</th><th>Qty</th><th>Status</th><th>By</th><th>Action</th></tr>
          </thead>
          <tbody>
            {requests.map(r => (
              <tr key={r._id}>
                <td>{r.product?.name}</td>
                <td>{r.quantity}</td>
                <td>{r.status}</td>
                <td>{r.requestedBy?.name}</td>
                <td>
                  {r.status === 'pending' ? (
                    <>
                      <button onClick={() => handleAction(r._id, 'approved')} style={{ background: '#388e3c', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', marginRight: 8, cursor: 'pointer' }}>Approve</button>
                      <button onClick={() => handleAction(r._id, 'rejected')} style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>Reject</button>
                    </>
                  ) : (
                    <span style={{ color: r.status === 'approved' ? '#388e3c' : '#d32f2f' }}>{r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
export default SupplierRequests;
