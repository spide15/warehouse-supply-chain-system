import React, { useState } from 'react';
import Dashboard from '../components/Dashboard';
import ProductList from '../components/ProductList';
import Analytics from '../components/Analytics';
import AdminAnalytics from '../components/AdminAnalytics';
import MyRequests from '../components/MyRequests';
import TrendsChart from '../components/TrendsChart';
import ProductForm from '../components/ProductForm';
import SupplierNotifications from '../components/SupplierNotifications';
import SupplierRequests from '../components/SupplierRequests';
import AdminSupplierApproval from '../components/AdminSupplierApproval';
import { useLocation } from 'react-router-dom';
import Chatbot from '../components/Chatbot';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const tabOptionsByRole = {
  admin: [
    { key: 'products', label: 'Products' },
    { key: 'requests', label: 'Purchase Requests' },
    { key: 'forecast', label: 'Demand Forecast' },
    { key: 'analytics', label: 'Analytics' },
    { key: 'suppliers', label: 'Supplier Approvals' },
    { key: 'help', label: 'Help' }
  ],
  employee: [
    { key: 'products', label: 'Products' },
    { key: 'requests', label: 'Purchase Requests' },
    { key: 'forecast', label: 'Demand Forecast' },
    { key: 'analytics', label: 'Analytics' },
    { key: 'help', label: 'Help' }
  ],
  supplier: [
    { key: 'products', label: 'Products' },
    { key: 'requests', label: 'My Product Requests' },
    { key: 'help', label: 'Help' }
  ]
};

const DashboardPage = ({ user, token }) => {
  const query = useQuery();
  const initialTab = query.get('tab') || 'products';
  const [tab, setTab] = useState(initialTab);
  const [refresh, setRefresh] = useState(false);

  const handleProductAdded = () => setRefresh(r => !r);
  const handleStatusChange = () => setRefresh(r => !r);
  const tabOptions = tabOptionsByRole[user.role] || tabOptionsByRole.employee;

  return (
    <div>
      <Dashboard user={user} token={token} refresh={refresh} />
      <div className="tab-bar">
        {tabOptions.map(opt => (
          <button
            key={opt.key}
            className={`tab-btn${tab === opt.key ? ' active' : ''}`}
            onClick={() => setTab(opt.key)}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {user.role === 'supplier' && <SupplierNotifications token={token} user={user} />}
        {tab === 'products' && user.role === 'supplier' && <ProductForm token={token} onProductAdded={handleProductAdded} />}
        {tab === 'products' && <ProductList token={token} refresh={refresh} user={user} />}
        {tab === 'requests' && user.role === 'supplier' && <SupplierRequests token={token} user={user} onStatusChange={handleStatusChange} />}
        {tab === 'requests' && user.role === 'employee' && <MyRequests token={token} user={user} onRated={handleProductAdded} />}
        {tab === 'requests' && user.role === 'admin' && <AdminAnalytics token={token} />}
        {tab === 'forecast' && user.role === 'employee' && <Analytics token={token} />}
        {tab === 'forecast' && user.role === 'admin' && (
          <div style={{ margin: '2rem', textAlign: 'center' }}>
            Feature coming soon: Admin Forecast
          </div>
        )}
        {tab === 'analytics' && <TrendsChart token={token} />}
        {tab === 'suppliers' && user.role === 'admin' && <AdminSupplierApproval token={token} />}
        {tab === 'help' && (
          <div className="product-list" style={{ maxWidth: 600 }}>
            <h3>Help: Role-based Access</h3>
            <ul>
              <li>
                <b>Employee:</b> View all available products, search/filter by name, raise purchase requests, see and track their own requests, rate products after purchase (from the requests tab), and view product ratings and analytics.
              </li>
              <li>
                <b>Supplier:</b> Add and manage their own products, see and approve/reject requests for their products, view notifications for request status changes, and see KPIs/analytics for their products.
              </li>
              <li>
                <b>Admin:</b> View all products and all purchase requests, see analytics and KPIs for the entire system. Cannot approve/reject requests.
              </li>
            </ul>
            <p><b>Product Ratings:</b> Employees can rate products only after their purchase request is approved (from the requests tab). Ratings are displayed in the product list for all roles and update in real-time after each new rating.</p>
            <p>Use the tabs above to switch between features. On mobile, tabs stack vertically for easier access.</p>
          </div>
        )}
      </div>
      <Chatbot token={token} />
    </div>
  );
};
export default DashboardPage;
