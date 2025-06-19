import React, { useEffect, useState } from 'react';
import { getPurchaseRequests } from '../services/api';
import { rateProduct } from '../services/rating';

const MyRequests = ({ token, user, onRated }) => {
  const [requests, setRequests] = useState([]);
  const [ratingModal, setRatingModal] = useState(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getPurchaseRequests(token).then(res => {
      setRequests(res.data.filter(r => r.requestedBy?._id === user.id));
    });
  }, [token, user.id]);

  const handleRate = (request) => {
    setRatingModal(request);
    setRatingValue(5);
    setRatingComment('');
  };

  const submitRating = async () => {
    setSubmitting(true);
    await rateProduct({ productId: ratingModal.product._id, rating: ratingValue, comment: ratingComment }, token);
    setSubmitting(false);
    setRatingModal(null);
    if (onRated) onRated(); // Notify parent to refresh products
  };

  return (
    <div className="product-list" style={{maxWidth:600}}>
      <h3>My Purchase Requests</h3>
      <table className="styled-table">
        <thead>
          <tr><th>Product</th><th>Qty</th><th>Status</th><th>Date</th><th>Notification</th><th>Rate</th></tr>
        </thead>
        <tbody>
          {requests.map(r => (
            <tr key={r._id}>
              <td>{r.product?.name}</td>
              <td>{r.quantity}</td>
              <td>{r.status}</td>
              <td>{new Date(r.createdAt).toLocaleDateString()}</td>
              <td>{r.notification}</td>
              <td>{r.status === 'approved' ? <button onClick={() => handleRate(r)} style={{ background: 'linear-gradient(90deg,#1976d2,#42a5f5)', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 16px', fontWeight: 600, fontSize: 15, cursor: 'pointer', boxShadow: '0 2px 8px #1976d233' }}>Rate</button> : <span style={{ color: '#aaa' }}>-</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {requests.length === 0 && <div style={{marginTop:20, textAlign:'center'}}>No requests found.</div>}
      {ratingModal && (
        <div className="modal" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, minWidth: 320, boxShadow: '0 4px 24px #1976d244' }}>
            <h4 style={{ color: '#1976d2', marginBottom: 16 }}>Rate {ratingModal.product?.name}</h4>
            <div style={{ margin: '12px 0' }}>
              <label style={{ fontWeight: 600 }}>Rating: </label>
              <select value={ratingValue} onChange={e => setRatingValue(Number(e.target.value))} style={{ fontSize: 18, borderRadius: 6, padding: 4, marginLeft: 8 }}>
                {[5,4,3,2,1].map(v => <option key={v} value={v}>{v} ★</option>)}
              </select>
            </div>
            <div style={{ margin: '12px 0' }}>
              <textarea value={ratingComment} onChange={e => setRatingComment(e.target.value)} placeholder="Comment (optional)" style={{ width: '100%', minHeight: 60, borderRadius: 6, border: '1px solid #bdbdbd', fontSize: 15, padding: 8 }} />
            </div>
            <button onClick={submitRating} disabled={submitting} style={{ background: 'linear-gradient(90deg,#1976d2,#42a5f5)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 600, fontSize: 16, cursor: 'pointer', marginRight: 8 }}>Submit</button>
            <button onClick={() => setRatingModal(null)} style={{ background: '#eee', color: '#333', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};
export default MyRequests;
