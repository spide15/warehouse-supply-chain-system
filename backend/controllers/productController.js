const Product = require('../models/Product');
const PurchaseRequest = require('../models/PurchaseRequest');

exports.listProducts = async (req, res) => {
  const products = await Product.find().populate('supplier', 'name');
  // Calculate average rating for each product
  const productsWithRating = products.map(p => {
    const avgRating = p.ratings && p.ratings.length > 0 ?
      (p.ratings.reduce((sum, r) => sum + r.rating, 0) / p.ratings.length).toFixed(2) : null;
    return { ...p.toObject(), avgRating };
  });
  res.json(productsWithRating);
};

exports.addProduct = async (req, res) => {
  const { name, description, quantity, price, sku } = req.body;
  const product = new Product({ name, description, quantity, price, sku, supplier: req.user.id });
  await product.save();
  res.status(201).json(product);
};

exports.updateProduct = async (req, res) => {
  const product = await Product.findOneAndUpdate({ _id: req.params.id, supplier: req.user.id }, req.body, { new: true });
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
};

exports.rateProduct = async (req, res) => {
  const { productId, rating, comment } = req.body;
  // Check if user has an approved purchase for this product
  const hasPurchased = await PurchaseRequest.findOne({
    product: productId,
    requestedBy: req.user.id,
    status: 'approved'
  });
  if (!hasPurchased) {
    return res.status(403).json({ error: 'You can only rate products you have purchased.' });
  }
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  // Prevent duplicate rating by same user (optional: update existing)
  const existing = product.ratings.find(r => r.user.toString() === req.user.id);
  if (existing) {
    existing.rating = rating;
    existing.comment = comment;
    existing.createdAt = new Date();
  } else {
    product.ratings.push({ user: req.user.id, rating, comment });
  }
  await product.save();
  res.json({ message: 'Rating submitted', ratings: product.ratings });
};
