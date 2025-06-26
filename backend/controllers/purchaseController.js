const PurchaseRequest = require('../models/PurchaseRequest');
const Product = require('../models/Product');

exports.createRequest = async (req, res) => {
  const { product, requestedQty } = req.body;
  // Check product availability
  const prod = await Product.findById(product);
  if (!prod || prod.quantity < requestedQty) {
    return res.status(400).json({ error: 'Product not available in requested quantity.' });
  }
  const newRequest = new PurchaseRequest({ product, requestedQty, requestedBy: req.user.id });
  await newRequest.save();
  res.status(201).json(newRequest);
};

exports.updateRequest = async (req, res) => {
  // Only seller of the product can approve/reject
  const pr = await PurchaseRequest.findById(req.params.id).populate({ path: 'product', select: 'seller' });
  if (!pr) return res.status(404).json({ error: 'Request not found' });
  if (!pr.product || pr.product.seller.toString() !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden: Only the seller of this product can authorize.' });
  }
  const { status } = req.body;
  if (status !== 'approved' && status !== 'rejected') {
    return res.status(400).json({ error: 'Invalid status. Only approve or reject allowed.' });
  }
  pr.status = status;
  if (status === 'approved') {
    const prod = await Product.findById(pr.product._id);
    if (prod) {
      prod.quantity -= pr.requestedQty;
      await prod.save();
      const now = new Date();
      pr.notification = `Seller (${prod.seller}) notified: Prepare for dispatch. Approved at ${now.toLocaleString()}`;
    }
  } else if (status === 'rejected') {
    const now = new Date();
    pr.notification = `Request rejected by seller at ${now.toLocaleString()}. Please check other options.`;
  }
  await pr.save();
  res.json(pr);
};

exports.listRequests = async (req, res) => {
  let prs;
  if (req.user.role === 'seller') {
    prs = await PurchaseRequest.find()
      .populate({ path: 'product', populate: { path: 'seller', select: '_id name' } })
      .populate('requestedBy', 'name');
    prs = prs.filter(r => r.product && (r.product.seller?._id?.toString() === req.user.id || r.product.seller?.toString() === req.user.id));
  } else if (req.user.role === 'buyer') {
    prs = await PurchaseRequest.find({ requestedBy: req.user.id })
      .populate({ path: 'product', populate: { path: 'seller', select: '_id name' } })
      .populate('requestedBy', 'name');
  } else {
    prs = await PurchaseRequest.find()
      .populate({ path: 'product', populate: { path: 'seller', select: '_id name' } })
      .populate('requestedBy', 'name');
  }
  res.json(prs);
};
