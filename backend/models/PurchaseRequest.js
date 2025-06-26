const mongoose = require('mongoose');

const purchaseRequestSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  requestedQty: Number,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  notification: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  date: { type: Date } // for compatibility with seed and analytics
});

module.exports = mongoose.model('PurchaseRequest', purchaseRequestSchema);
