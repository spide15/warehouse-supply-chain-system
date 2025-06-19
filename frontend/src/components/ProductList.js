import React, { useEffect, useState } from 'react';
import { getProducts } from '../services/api';
import RequestProductModal from './RequestProductModal';
import { rateProduct } from '../services/rating';

const ProductList = ({ token, refresh, user }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [ratingModal, setRatingModal] = useState(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getProducts(token).then(res => setProducts(res.data));
  }, [token, refresh]);

  // Responsive: show table on desktop/tablet, cards on mobile
  const isMobile = window.innerWidth < 700;

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleRate = async (product) => {
    setRatingModal(product);
    setRatingValue(5);
    setRatingComment('');
  };

  const submitRating = async () => {
    setSubmitting(true);
    await rateProduct({ productId: ratingModal._id, rating: ratingValue, comment: ratingComment }, token);
    setSubmitting(false);
    setRatingModal(null);
    // Optionally refresh product list to show new avg rating
    getProducts(token).then(res => setProducts(res.data));
  };

  // Helper: check if employee can rate (has purchased and approved)
  const canRate = (product) => {
    // Optionally, you can pass in a list of approved requests for this user and check here
    // For now, allow the Rate button for all employees (backend will enforce purchase check)
    return user?.role === 'employee';
  };

  return (
    <div className="product-list" style={{ maxWidth: isMobile ? '98vw' : 900, margin: '0 auto', padding: isMobile ? 8 : 24 }}>
      <h3 style={{ color: '#1976d2', textAlign: 'center', marginBottom: 24 }}>Available Products</h3>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search by product name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: '1px solid #bdbdbd', width: isMobile ? '90%' : 300, fontSize: 16 }}
        />
      </div>
      {!isMobile && (
        <div className="table-responsive">
          <table className="styled-table">
            <thead>
              <tr><th>Name</th><th>Description</th><th>Qty</th><th>Price</th><th>Supplier</th><th>Rating</th>{user?.role === 'employee' && <th>Action</th>}</tr>
            </thead>
            <tbody>
              {filteredProducts.map((p, idx) => (
                <tr key={p._id} className={idx % 2 === 0 ? 'even-row' : 'odd-row'}>
                  <td>{p.name}</td>
                  <td>{p.description}</td>
                  <td>{p.quantity}</td>
                  <td>₹{p.price}</td>
                  <td>{p.supplier?.name}</td>
                  <td>{p.avgRating ? `${p.avgRating} ★` : 'No ratings'}</td>
                  {user?.role === 'employee' && <td>{p.quantity > 0 ? <button onClick={() => setSelectedProduct(p)} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', cursor: 'pointer' }}>Request</button> : <span style={{ color: '#d32f2f' }}>Out of stock</span>}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {isMobile && (
        <div className="product-cards" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filteredProducts.map((p) => (
            <div className="product-card" key={p._id} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #0001', padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="product-title" style={{ fontSize: 18, fontWeight: 600, color: '#1976d2' }}>{p.name}</div>
              <div className="product-desc" style={{ color: '#555' }}>{p.description}</div>
              <div><b>Qty:</b> {p.quantity}</div>
              <div><b>Price:</b> ₹{p.price}</div>
              <div><b>Supplier:</b> {p.supplier?.name}</div>
              <div><b>Rating:</b> {p.avgRating ? `${p.avgRating} ★` : 'No ratings'}</div>
              {user?.role === 'employee' && (p.quantity > 0 ? <button onClick={() => setSelectedProduct(p)} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', marginTop: 8, fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Request</button> : <span style={{ color: '#d32f2f', fontWeight: 600 }}>Out of stock</span>)}
            </div>
          ))}
        </div>
      )}
      {selectedProduct && <RequestProductModal product={selectedProduct} token={token} onClose={() => setSelectedProduct(null)} onSuccess={() => setSelectedProduct(null)} />}
      {ratingModal && (
        <div className="modal" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, minWidth: 300 }}>
            <h4>Rate {ratingModal.name}</h4>
            <div style={{ margin: '12px 0' }}>
              <label>Rating: </label>
              <select value={ratingValue} onChange={e => setRatingValue(Number(e.target.value))}>
                {[5,4,3,2,1].map(v => <option key={v} value={v}>{v} ★</option>)}
              </select>
            </div>
            <div style={{ margin: '12px 0' }}>
              <textarea value={ratingComment} onChange={e => setRatingComment(e.target.value)} placeholder="Comment (optional)" style={{ width: '100%', minHeight: 60 }} />
            </div>
            <button onClick={submitRating} disabled={submitting} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Submit</button>
            <button onClick={() => setRatingModal(null)} style={{ marginLeft: 12, background: '#eee', color: '#333', border: 'none', borderRadius: 6, padding: '8px 16px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProductList;
