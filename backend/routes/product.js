const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/auth');

// List all products
router.get('/', authenticate, productController.listProducts);

// Supplier adds a product
router.post('/', authenticate, authorize(['supplier']), productController.addProduct);

// Supplier updates a product
router.put('/:id', authenticate, authorize(['supplier']), productController.updateProduct);

// Employee rates a product after purchase
router.post('/rate', authenticate, authorize(['employee']), productController.rateProduct);

module.exports = router;
