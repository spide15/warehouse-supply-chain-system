const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['seller', 'buyer', 'admin'], default: 'buyer' },
  approved: { type: Boolean, default: function() { return this.role !== 'seller'; } }
});

module.exports = mongoose.model('User', userSchema);
