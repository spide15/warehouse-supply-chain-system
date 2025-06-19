const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const { authenticate, authorize } = require('../middleware/auth');

// Employee raises a purchase request
router.post('/', authenticate, authorize(['employee']), purchaseController.createRequest);

// Supplier approves/rejects a request for their product
router.put('/:id', authenticate, authorize(['supplier']), purchaseController.updateRequest);

// List all purchase requests
router.get('/', authenticate, authorize(['admin', 'employee', 'supplier']), purchaseController.listRequests);

module.exports = router;
