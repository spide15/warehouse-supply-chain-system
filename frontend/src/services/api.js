import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const login = (email, password) =>
  axios.post(`${API_URL}/auth/login`, { email, password });

export const register = (data) =>
  axios.post(`${API_URL}/auth/register`, data);

export const getProducts = (token) =>
  axios.get(`${API_URL}/products`, { headers: { Authorization: `Bearer ${token}` } });

export const addProduct = (data, token) =>
  axios.post(`${API_URL}/products`, data, { headers: { Authorization: `Bearer ${token}` } });

export const raisePurchaseRequest = (data, token) =>
  axios.post(`${API_URL}/purchase`, data, { headers: { Authorization: `Bearer ${token}` } });

export const getPurchaseRequests = (token) =>
  axios.get(`${API_URL}/purchase`, { headers: { Authorization: `Bearer ${token}` } });

export const forecastDemand = (data, token) =>
  axios.post(`${API_URL}/forecast`, data, { headers: { Authorization: `Bearer ${token}` } });
