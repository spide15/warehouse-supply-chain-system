const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: String,
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  quantity: Number,
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  price: Number,
  sku: { type: String, unique: true, required: true },
  ratings: [ratingSchema]
});

module.exports = mongoose.model('Product', productSchema);
