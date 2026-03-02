const FoodItem = require('../models/FoodItem');

// @desc    Get food items by restaurant
// @route   GET /api/food/restaurant/:restaurantId (and /api/food/:restaurantId)
// @access  Public
exports.getFoodByRestaurant = async (req, res) => {
    try {
        const query = { restaurantId: req.params.restaurantId };
        // If it's the admin asking (usually we can check req.user.role here, 
        // but let's just allow it for now if we want to show all in admin panel)
        // For simplicity, we'll return all if we're on the admin page, 
        // but for public we should filter. Let's return all and let frontend decide or just return all for simplicity.
        const foodItems = await FoodItem.find(query);
        res.json(foodItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a food item
// @route   POST /api/food/:restaurantId
// @access  Private/Admin
exports.addFoodItem = async (req, res) => {
    const { name, image, price, category, isAvailable } = req.body;
    const restaurantId = req.params.restaurantId || req.body.restaurantId;

    try {
        const foodItem = await FoodItem.create({
            restaurantId,
            name,
            image,
            price,
            category,
            isAvailable: isAvailable ?? true
        });
        res.status(201).json(foodItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update food item (Generic / Availability)
// @route   PUT /api/food/:id
// @access  Private/Admin
exports.updateFoodItem = async (req, res) => {
    try {
        const foodItem = await FoodItem.findById(req.params.id);
        if (foodItem) {
            foodItem.name = req.body.name || foodItem.name;
            foodItem.image = req.body.image || foodItem.image;
            foodItem.price = req.body.price || foodItem.price;
            foodItem.category = req.body.category || foodItem.category;
            foodItem.isAvailable = req.body.isAvailable ?? foodItem.isAvailable;

            const updatedItem = await foodItem.save();
            res.json(updatedItem);
        } else {
            res.status(404).json({ message: 'Food item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete food item
// @route   DELETE /api/food/:id
// @access  Private/Admin
exports.deleteFoodItem = async (req, res) => {
    try {
        const foodItem = await FoodItem.findById(req.params.id);
        if (foodItem) {
            await foodItem.deleteOne();
            res.json({ message: 'Food item removed' });
        } else {
            res.status(404).json({ message: 'Food item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
