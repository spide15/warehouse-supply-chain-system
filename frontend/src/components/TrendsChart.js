import React, { useEffect, useState } from 'react';
import { getProducts, getPurchaseRequests } from '../services/api';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const TrendsChart = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProducts(token).then(res => setProducts(res.data)),
      getPurchaseRequests(token).then(res => setRequests(res.data))
    ]).then(() => setLoading(false));
  }, [token]);

  // Aggregate monthly purchase requests for the last 8 months
  const now = new Date();
  const months = Array.from({ length: 8 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (7 - i), 1);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
  });
  const monthlyCounts = months.map(m =>
    requests.filter(r => {
      const d = new Date(r.date || r.createdAt);
      return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}` === m;
    }).length
  );

  // Top 5 products by number of requests
  const productCounts = {};
  requests.forEach(r => {
    if (!r.product?.name) return;
    productCounts[r.product.name] = (productCounts[r.product.name] || 0) + 1;
  });
  const topProducts = Object.entries(productCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Top 5 products by quantity (stock)
  const topByQuantity = [...products]
    .sort((a, b) => (b.quantity || 0) - (a.quantity || 0))
    .slice(0, 5);

  if (loading) return <div>Loading analytics...</div>;

  return (
    <div className="product-list" style={{maxWidth:900}}>
      <h3>Advanced Analytics & Trends</h3>
      <div style={{marginBottom:40}}>
        <h4>Monthly Purchase Requests (Last 8 Months)</h4>
        <Line
          data={{
            labels: months,
            datasets: [
              {
                label: 'Requests',
                data: monthlyCounts,
                borderColor: '#1976d2',
                backgroundColor: 'rgba(25, 118, 210, 0.2)',
                tension: 0.3
              }
            ]
          }}
          options={{ responsive: true, plugins: { legend: { display: false } } }}
        />
      </div>
      <div style={{marginBottom:40}}>
        <h4>Top 5 Products by Quantity (Stock)</h4>
        <Bar
          data={{
            labels: topByQuantity.map(p => p.name),
            datasets: [
              {
                label: 'Quantity',
                data: topByQuantity.map(p => p.quantity),
                backgroundColor: '#81c784'
              }
            ]
          }}
          options={{ responsive: true, plugins: { legend: { display: false } } }}
        />
      </div>
      <div>
        <h4>Top 5 Products by Requests</h4>
        <Bar
          data={{
            labels: topProducts.map(([name]) => name),
            datasets: [
              {
                label: 'Requests',
                data: topProducts.map(([, count]) => count),
                backgroundColor: '#64b5f6'
              }
            ]
          }}
          options={{ responsive: true, plugins: { legend: { display: false } } }}
        />
      </div>
    </div>
  );
};
export default TrendsChart;
