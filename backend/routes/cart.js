const express = require('express');
const router = express.Router();
const { getUserCart, addToCart, clearCart, removeFromCart } = require('../controller/cartController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getUserCart);
router.post('/add', authMiddleware, addToCart);
router.delete('/', authMiddleware, clearCart);
router.delete('/remove/:foodId', authMiddleware, removeFromCart);

module.exports = router;
