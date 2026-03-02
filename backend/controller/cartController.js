const Cart = require('../models/Cart');
const FoodItem = require('../models/FoodItem');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
exports.getUserCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user.id }).populate('items.foodId');
        if (!cart) {
            cart = await Cart.create({ userId: req.user.id, items: [], totalAmount: 0 });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add item to cart or update quantity
// @route   POST /api/cart/add
// @access  Private
exports.addToCart = async (req, res) => {
    const { foodId, quantity } = req.body;
    console.log('Add to cart request:', { foodId, quantity, userId: req.user?.id });

    try {
        const food = await FoodItem.findById(foodId);
        if (!food) {
            console.log('Food item not found:', foodId);
            return res.status(404).json({ message: 'Food item not found' });
        }

        let cart = await Cart.findOne({ userId: req.user.id });

        if (!cart) {
            console.log('Creating new cart for user:', req.user.id);
            cart = new Cart({ userId: req.user.id, items: [], totalAmount: 0 });
        }

        const itemIndex = cart.items.findIndex(p => p.foodId.toString() === foodId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ foodId, quantity });
        }

        cart.totalAmount += food.price * quantity;
        await cart.save();
        console.log('Cart updated successfully');
        res.status(200).json(cart);
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:foodId
// @access  Private
exports.removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id }).populate('items.foodId');

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(p => p.foodId._id.toString() === req.params.foodId);

        if (itemIndex > -1) {
            const item = cart.items[itemIndex];
            cart.totalAmount -= item.foodId.price * item.quantity;
            cart.items.splice(itemIndex, 1);
            await cart.save();
            res.json(cart);
        } else {
            res.status(404).json({ message: 'Item not found in cart' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
exports.clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id });
        if (cart) {
            cart.items = [];
            cart.totalAmount = 0;
            await cart.save();
        }
        res.json({ message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
