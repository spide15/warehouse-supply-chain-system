const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/auth');

// List all products
router.get('/', authenticate, productController.listProducts);

// Seller adds a product
router.post('/', authenticate, authorize(['seller']), productController.addProduct);

// Seller updates a product
router.put('/:id', authenticate, authorize(['seller']), productController.updateProduct);

// Buyer rates a product after purchase
router.post('/rate', authenticate, authorize(['buyer']), productController.rateProduct);

module.exports = router;
