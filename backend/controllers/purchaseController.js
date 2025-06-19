const PurchaseRequest = require('../models/PurchaseRequest');
const Product = require('../models/Product');

exports.createRequest = async (req, res) => {
  const { productId, quantity } = req.body;
  // Check product availability
  const product = await Product.findById(productId);
  if (!product || product.quantity < quantity) {
    return res.status(400).json({ error: 'Product not available in requested quantity.' });
  }
  const newRequest = new PurchaseRequest({ product: productId, quantity, requestedBy: req.user.id });
  await newRequest.save();
  res.status(201).json(newRequest);
};

exports.updateRequest = async (req, res) => {
  // Only supplier of the product can approve/reject
  const pr = await PurchaseRequest.findById(req.params.id).populate({ path: 'product', select: 'supplier' });
  if (!pr) return res.status(404).json({ error: 'Request not found' });
  if (!pr.product || pr.product.supplier.toString() !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden: Only the supplier of this product can authorize.' });
  }
  const { status } = req.body;
  pr.status = status;
  if (status === 'approved') {
    const product = await Product.findById(pr.product._id);
    if (product) {
      product.quantity -= pr.quantity;
      await product.save();
      const now = new Date();
      pr.notification = `Supplier (${product.supplier}) notified: Prepare for dispatch. Approved at ${now.toLocaleString()}`;
    }
  } else if (status === 'rejected') {
    const now = new Date();
    pr.notification = `Request rejected at ${now.toLocaleString()}. Please check other options.`;
  }
  await pr.save();
  res.json(pr);
};

exports.listRequests = async (req, res) => {
  let prs;
  if (req.user.role === 'supplier') {
    prs = await PurchaseRequest.find()
      .populate({ path: 'product', populate: { path: 'supplier', select: '_id' } })
      .populate('requestedBy', 'name');
    prs = prs.filter(r => r.product && (r.product.supplier?._id?.toString() === req.user.id || r.product.supplier?.toString() === req.user.id));
  } else {
    prs = await PurchaseRequest.find().populate({ path: 'product', populate: { path: 'supplier', select: '_id' } }).populate('requestedBy', 'name');
  }
  res.json(prs);
};
