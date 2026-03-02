const express = require('express');
const router = express.Router();
const {
    getRestaurants,
    getRestaurantById,
    createRestaurant,
    updateRestaurant,
    updateRestaurantStatus,
    deleteRestaurant
} = require('../controller/restaurantController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);
router.post('/', authMiddleware, adminMiddleware, createRestaurant);
router.put('/:id', authMiddleware, adminMiddleware, updateRestaurant);
router.put('/:id/status', authMiddleware, adminMiddleware, updateRestaurantStatus);
router.delete('/:id', authMiddleware, adminMiddleware, deleteRestaurant);

module.exports = router;
