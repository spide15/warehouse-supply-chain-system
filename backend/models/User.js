const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['supplier', 'employee', 'admin'], default: 'employee' },
  approved: { type: Boolean, default: function() { return this.role !== 'supplier'; } }
});

module.exports = mongoose.model('User', userSchema);
