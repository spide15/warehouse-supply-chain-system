import React, { useState } from 'react';
import { raisePurchaseRequest } from '../services/api';

const RequestProductModal = ({ product, token, onClose, onSuccess }) => {
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await raisePurchaseRequest({ productId: product._id, quantity: Number(quantity) }, token);
      setSuccess('Request submitted!');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit request.');
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0006', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#fff', padding: 32, borderRadius: 12, boxShadow: '0 4px 24px #1976d220', textAlign: 'center', minWidth: 320 }}>
        <h2 style={{ color: '#1976d2' }}>Request Product</h2>
        <p><b>{product.name}</b></p>
        <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
          <input type="number" min="1" max={product.quantity} value={quantity} onChange={e => setQuantity(e.target.value)} required style={{ padding: 10, borderRadius: 8, border: '1px solid #bdbdbd', width: 80 }} />
          <span style={{ marginLeft: 8 }}>/ {product.quantity} available</span>
          <br />
          <button type="submit" style={{ background: '#1976d2', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 8, fontSize: '1rem', marginTop: 16, cursor: 'pointer' }}>Submit Request</button>
        </form>
        {error && <div className="error" style={{ marginTop: 10 }}>{error}</div>}
        {success && <div style={{ color: 'green', marginTop: 10 }}>{success}</div>}
        <button onClick={onClose} style={{ marginTop: 18, background: 'none', color: '#1976d2', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Close</button>
      </div>
    </div>
  );
};

export default RequestProductModal;
