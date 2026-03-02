const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getAllOrders, updateOrderStatus } = require('../controller/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/', authMiddleware, createOrder);
router.get('/user', authMiddleware, getUserOrders);
router.get('/', authMiddleware, adminMiddleware, getAllOrders);
router.put('/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);

module.exports = router;
