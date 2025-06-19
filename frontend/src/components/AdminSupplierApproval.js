import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const AdminSupplierApproval = ({ token }) => {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPending = async () => {
    setLoading(true);
    const res = await axios.get(`${API_URL}/suppliers/pending`, { headers: { Authorization: `Bearer ${token}` } });
    setPending(res.data);
    setLoading(false);
  };

  const approve = async (id) => {
    await axios.put(`${API_URL}/suppliers/approve/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
    fetchPending();
  };

  useEffect(() => { fetchPending(); }, [token]);

  return (
    <div className="product-list" style={{ maxWidth: 600 }}>
      <h3>Pending Supplier Approvals</h3>
      {loading ? <div>Loading...</div> : pending.length === 0 ? <div>No pending suppliers.</div> : (
        <table className="styled-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Action</th></tr>
          </thead>
          <tbody>
            {pending.map(s => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td><button onClick={() => approve(s._id)} style={{ background: '#388e3c', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', cursor: 'pointer' }}>Approve</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
export default AdminSupplierApproval;
