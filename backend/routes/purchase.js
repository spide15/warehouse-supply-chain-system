const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const { authenticate, authorize } = require('../middleware/auth');

// Buyer raises a purchase request
router.post('/', authenticate, authorize(['buyer']), purchaseController.createRequest);

// Seller approves/rejects a request for their product
router.put('/:id', authenticate, authorize(['seller']), purchaseController.updateRequest);

// List all purchase requests
router.get('/', authenticate, authorize(['admin', 'buyer', 'seller']), purchaseController.listRequests);

module.exports = router;
