import React, { useState } from 'react';
import { addProduct } from '../services/api';

const ProductForm = ({ token, onProductAdded }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    quantity: '',
    price: '',
    sku: ''
  });
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await addProduct({
        ...form,
        quantity: Number(form.quantity),
        price: Number(form.price)
      }, token);
      setShowModal(true);
      setForm({ name: '', description: '', quantity: '', price: '', sku: '' });
      if (onProductAdded) onProductAdded();
    } catch (err) {
      setError('Failed to add product.');
    }
  };

  return (
    <div className="product-list" style={{ maxWidth: 500, margin: '2rem auto', boxShadow: '0 4px 24px #1976d220', borderRadius: 16, background: '#f9f9ff' }}>
      <h3 style={{ color: '#1976d2', marginBottom: 20 }}>Add New Product</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input name="name" placeholder="Product Name" value={form.name} onChange={handleChange} required style={{ padding: 12, borderRadius: 8, border: '1px solid #bdbdbd' }} />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required style={{ padding: 12, borderRadius: 8, border: '1px solid #bdbdbd', minHeight: 60 }} />
        <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} required min="1" style={{ padding: 12, borderRadius: 8, border: '1px solid #bdbdbd' }} />
        <input name="price" type="number" placeholder="Price (₹)" value={form.price} onChange={handleChange} required min="1" style={{ padding: 12, borderRadius: 8, border: '1px solid #bdbdbd' }} />
        <input name="sku" placeholder="SKU (unique)" value={form.sku} onChange={handleChange} required style={{ padding: 12, borderRadius: 8, border: '1px solid #bdbdbd' }} />
        <button type="submit" style={{ background: 'linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)', color: '#fff', border: 'none', padding: 14, borderRadius: 8, fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', marginTop: 8 }}>Add Product</button>
        {error && <div className="error">{error}</div>}
      </form>
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0006', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 12, boxShadow: '0 4px 24px #1976d220', textAlign: 'center' }}>
            <h2 style={{ color: '#1976d2' }}>Product Added!</h2>
            <p>Your product has been listed successfully.</p>
            <button onClick={() => setShowModal(false)} style={{ background: '#1976d2', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 8, fontSize: '1rem', marginTop: 16, cursor: 'pointer' }}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductForm;
