const mongoose = require('mongoose');

const purchaseRequestSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  notification: { type: String, default: '' }, // Notification message for supplier/employee
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PurchaseRequest', purchaseRequestSchema);
