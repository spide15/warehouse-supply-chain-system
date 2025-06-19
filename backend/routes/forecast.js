const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Simple linear regression for time series demand forecasting
function linearRegression(history) {
  const n = history.length;
  const x = Array.from({ length: n }, (_, i) => i + 1);
  const y = history;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
  const sumX2 = x.reduce((a, b) => a + b * b, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  // Predict next period
  return Math.round(slope * (n + 1) + intercept);
}

router.post('/', async (req, res) => {
  const { productId, history } = req.body;
  try {
    const product = await Product.findById(productId);
    const forecast = linearRegression(history);
    res.json({ productId, sku: product?.sku, forecast });
  } catch (err) {
    res.status(400).json({ error: 'Forecast failed' });
  }
});

module.exports = router;
