const User = require('../models/User');

exports.listPendingSuppliers = async (req, res) => {
  const pending = await User.find({ role: 'seller', approved: false });
  res.json(pending);
};

exports.approveSupplier = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
  if (!user) return res.status(404).json({ error: 'Seller not found' });
  res.json({ message: 'Seller approved', user });
};
