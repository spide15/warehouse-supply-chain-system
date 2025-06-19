import React, { useState, useEffect } from 'react';
import { forecastDemand, getProducts } from '../services/api';

const Analytics = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [forecastResults, setForecastResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getProducts(token).then(res => setProducts(res.data));
  }, [token]);

  // Simulate demand history for each product
  const generateHistory = () => Array.from({ length: 6 }, () => Math.floor(Math.random() * 30) + 10);

  const handleForecastAll = async () => {
    setLoading(true);
    setForecastResults([]);
    setError('');
    try {
      const results = await Promise.all(
        products.map(async (p) => {
          const history = generateHistory();
          const res = await forecastDemand({ productId: p._id, history }, token);
          return { name: p.name, forecast: res.data.forecast, history };
        })
      );
      setForecastResults(results);
    } catch (err) {
      setError('Forecast failed.');
    }
    setLoading(false);
  };

  return (
    <div className="product-list" style={{maxWidth:600}}>
      <h3>Future Demand Forecast (All Products)</h3>
      <button onClick={handleForecastAll} style={{marginBottom:16}}>Show Forecast for All Products</button>
      {loading && <div>Loading forecasts...</div>}
      {forecastResults.length > 0 && (
        <table>
          <thead>
            <tr><th>Product</th><th>Past Demand</th><th>Forecasted Demand</th><th>Trend</th></tr>
          </thead>
          <tbody>
            {forecastResults.map((r, idx) => {
              const last = r.history[r.history.length - 1];
              let trend = '';
              let color = '';
              if (r.forecast > last) {
                trend = '↑'; color = '#388e3c';
              } else if (r.forecast < last) {
                trend = '↓'; color = '#d32f2f';
              } else {
                trend = '→'; color = '#1976d2';
              }
              return (
                <tr key={idx}>
                  <td>{r.name}</td>
                  <td>{r.history.join(', ')}</td>
                  <td><b>{r.forecast}</b></td>
                  <td style={{ fontSize: 24, color, fontWeight: 700 }}>{trend}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
};
export default Analytics;
