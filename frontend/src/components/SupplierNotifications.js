import React, { useEffect, useState } from 'react';
import { getPurchaseRequests } from '../services/api';

const SupplierNotifications = ({ token, user }) => {
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    getPurchaseRequests(token).then(res => {
      // Only show requests for products supplied by this supplier
      setRequests(res.data.filter(r => r.product?.supplier === user.id && r.status === 'approved'));
    });
  }, [token, user.id]);
  if (!requests.length) return null;
  return (
    <div className="product-list" style={{ maxWidth: 600, margin: '2rem auto', background: '#e3f2fd' }}>
      <h3>Supplier Notifications</h3>
      <ul>
        {requests.map(r => (
          <li key={r._id} style={{ marginBottom: 10 }}>
            Product <b>{r.product?.name}</b> (Qty: {r.quantity}) approved for dispatch.
          </li>
        ))}
      </ul>
    </div>
  );
};
export default SupplierNotifications;
