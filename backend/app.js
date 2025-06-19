// Main Express app setup
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const purchaseRoutes = require('./routes/purchase');
const forecastRoutes = require('./routes/forecast');
const supplierRoutes = require('./routes/supplier');
const chatRoutes = require('./routes/chat');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/forecast', forecastRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/chat', chatRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(5000, () => console.log('Server running on 5000')))
  .catch(err => console.log(err));
