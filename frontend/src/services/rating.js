import axios from 'axios';
const API_URL = 'http://localhost:5000/api';

export const rateProduct = (data, token) =>
  axios.post(`${API_URL}/products/rate`, data, { headers: { Authorization: `Bearer ${token}` } });
