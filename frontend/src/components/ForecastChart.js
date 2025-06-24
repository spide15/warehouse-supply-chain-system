import React, { useState, useEffect } from 'react';
import { forecastDemand, getProducts } from '../services/api';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ForecastChart = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState('');
  const [history, setHistory] = useState([]);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getProducts(token).then(res => setProducts(res.data));
  }, [token]);

  const handleSelect = async (e) => {
    const id = e.target.value;
    setSelected(id);
    setForecast(null);
    setError('');
    if (!id) return;
    setLoading(true);
    // Simulate demand history
    const hist = Array.from({ length: 6 }, () => Math.floor(Math.random() * 30) + 10);
    setHistory(hist);
    try {
      const res = await forecastDemand({ productId: id, history: hist }, token);
      setForecast(res.data.forecast);
    } catch (err) {
      setError('Forecast failed.');
    }
    setLoading(false);
  };

  const chartData = {
    labels: history.map((_, i) => `Month ${i + 1}`),
    datasets: [
      {
        label: 'Past Demand',
        data: history,
        borderColor: '#1976d2',
        backgroundColor: '#1976d233',
        tension: 0.3
      },
      ...(forecast !== null ? [{
        label: 'Forecast',
        data: [...Array(history.length - 1).fill(null), forecast],
        borderColor: '#388e3c',
        backgroundColor: '#388e3c33',
        pointStyle: 'rectRot',
        pointRadius: 7,
        pointBackgroundColor: '#388e3c',
        showLine: false
      }] : [])
    ]
  };

  return (
    <div className="product-list" style={{ maxWidth: 600, margin: '0 auto' }}>
      <h3>Demand Forecast Chart</h3>
      <div style={{ marginBottom: 16 }}>
        <select value={selected} onChange={handleSelect} style={{ padding: 8, borderRadius: 6, minWidth: 220 }}>
          <option value="">Select a product...</option>
          {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
      </div>
      {loading && <div>Loading forecast...</div>}
      {error && <div className="error">{error}</div>}
      {selected && !loading && (
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #0001', padding: 16 }}>
          <Line data={chartData} options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Past Demand & Forecast' }
            }
          }} />
          {forecast !== null && <div style={{ marginTop: 12, fontWeight: 600 }}>Forecasted Demand: <span style={{ color: '#388e3c' }}>{forecast}</span></div>}
        </div>
      )}
    </div>
  );
};
export default ForecastChart;
