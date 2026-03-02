const express = require('express');
const router = express.Router();
const {
    getFoodByRestaurant,
    addFoodItem,
    updateFoodItem,
    deleteFoodItem
} = require('../controller/foodController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Public / User routes
router.get('/restaurant/:restaurantId', getFoodByRestaurant);
router.get('/:restaurantId', getFoodByRestaurant); // Also allow direct ID for frontend simplicity

// Admin routes
router.post('/:restaurantId', authMiddleware, adminMiddleware, addFoodItem);
router.put('/:id', authMiddleware, adminMiddleware, updateFoodItem);
router.put('/:id/availability', authMiddleware, adminMiddleware, updateFoodItem);
router.delete('/:id', authMiddleware, adminMiddleware, deleteFoodItem);

module.exports = router;
