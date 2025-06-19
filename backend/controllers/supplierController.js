const User = require('../models/User');

exports.listPendingSuppliers = async (req, res) => {
  const pending = await User.find({ role: 'supplier', approved: false });
  res.json(pending);
};

exports.approveSupplier = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
  if (!user) return res.status(404).json({ error: 'Supplier not found' });
  res.json({ message: 'Supplier approved', user });
};
