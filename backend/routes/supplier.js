const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { authenticate, authorize } = require('../middleware/auth');

// List all pending sellers (admin only)
router.get('/pending', authenticate, authorize(['admin']), supplierController.listPendingSuppliers);
// Approve a seller (admin only)
router.put('/approve/:id', authenticate, authorize(['admin']), supplierController.approveSupplier);

module.exports = router;
