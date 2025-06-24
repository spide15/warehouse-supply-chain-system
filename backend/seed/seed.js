// Fresh seed script for MBA-level supply chain project
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Product = mongoose.model('Product', new mongoose.Schema({
  name: String,
  description: String, // Added description
  quantity: Number,    // Added quantity
  sku: { type: String, unique: true },
  price: Number,
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Changed supplier to seller
}));
const PurchaseRequest = mongoose.model('PurchaseRequest', new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  buyerId: mongoose.Schema.Types.ObjectId,
  requestedQty: Number,
  date: Date
}));
const Purchase = mongoose.model('Purchase', new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  buyerId: mongoose.Schema.Types.ObjectId,
  sellerId: mongoose.Schema.Types.ObjectId,
  qty: Number,
  totalPrice: Number,
  purchaseDate: Date
}));
const Inventory = mongoose.model('Inventory', new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  stock: Number
}));

const stationeryNames = [
  'Notebooks', 'Pens', 'Pencils', 'Erasers', 'Markers', 'Chalk', 'Drawing Sheets', 'Staplers', 'Files', 'Folders',
  'Highlighters', 'Scissors', 'Glue Sticks', 'Rulers', 'Whiteboard Markers', 'Dusters', 'Clipboards', 'Sticky Notes',
  'Paper Reams', 'Envelopes', 'Calculator', 'Register Books', 'ID Cards', 'Attendance Sheets', 'Crayons',
  'Water Bottles', 'Lunch Boxes', 'School Bags', 'Geometry Boxes', 'Art Paper', 'Color Pencils', 'Sketch Pens',
  'Correction Pens', 'Binder Clips', 'Push Pins', 'Rubber Bands', 'Paper Clips', 'Tape', 'Chart Paper',
  'Projector Sheets', 'Plastic Covers', 'Exam Pads', 'Notice Boards', 'Pin Boards', 'Dustbins', 'Water Cooler',
  'Fans', 'Heaters', 'Hand Sanitizer', 'Masks', 'First Aid Kit'
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({});
  await Product.deleteMany({});
  await PurchaseRequest.deleteMany({});
  await Purchase.deleteMany({});
  await Inventory.deleteMany({});

  const password = await bcrypt.hash('password', 10);
  // Users
  const admin = await User.create({ name: 'Admin', email: 'admin@example.com', password, role: 'admin' });
  const sellers = [];
  for (let i = 1; i <= 5; i++) {
    sellers.push(await User.create({ name: `Seller${i}`, email: `seller${i}@example.com`, password, role: 'seller' }));
  }
  const buyers = [];
  for (let i = 1; i <= 5; i++) {
    buyers.push(await User.create({ name: `Buyer${i}`, email: `buyer${i}@example.com`, password, role: 'buyer' }));
  }
  // Products
  const products = [];
  for (let i = 0; i < 50; i++) {
    const seller = sellers[i % sellers.length];
    products.push(await Product.create({
      name: stationeryNames[i],
      description: `High quality ${stationeryNames[i]} for institutional use`,
      quantity: Math.floor(Math.random() * 100) + 10,
      sku: `SKU-${(i+1).toString().padStart(3, '0')}`,
      price: Math.floor(Math.random() * 200) + 20,
      seller: seller._id
    }));
  }
  // Purchase Requests & Purchases
  const now = new Date();
  const purchaseRequests = [];
  const purchases = [];
  for (const buyer of buyers) {
    for (let j = 0; j < 3; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const monthsAgo = Math.floor(Math.random() * 8);
      const date = new Date(now.getFullYear(), now.getMonth() - monthsAgo, Math.floor(Math.random() * 28) + 1);
      const requestedQty = Math.floor(Math.random() * 10) + 1;
      purchaseRequests.push(await PurchaseRequest.create({
        productId: product._id,
        buyerId: buyer._id,
        requestedQty,
        date
      }));
      // Simulate purchase for each request
      if (Math.random() > 0.2) { // 80% requests fulfilled
        purchases.push(await Purchase.create({
          productId: product._id,
          buyerId: buyer._id,
          sellerId: product.seller,
          qty: requestedQty,
          totalPrice: requestedQty * product.price,
          purchaseDate: date
        }));
      }
    }
  }
  // Inventory
  for (const product of products) {
    await Inventory.create({ productId: product._id, stock: Math.floor(Math.random() * 100) + 10 });
  }
  console.log('Fresh seed data inserted.');
  process.exit();
}
seed();
