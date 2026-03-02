const Order = require('../models/Order');
const Cart = require('../models/Cart');

// @desc    Create new order
// @route   POST /api/order
// @access  Private
// @desc    Create new order
// @route   POST /api/order
// @access  Private
exports.createOrder = async (req, res) => {
    const { deliveryAddress, paymentMethod } = req.body;

    try {
        const cart = await Cart.findOne({ userId: req.user.id }).populate('items.foodId');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Your cart is empty' });
        }

        // Snapshot items from cart
        const orderItems = cart.items.map(item => ({
            foodId: item.foodId._id,
            name: item.foodId.name,
            price: item.foodId.price,
            quantity: item.quantity
        }));

        const order = new Order({
            userId: req.user.id,
            items: orderItems,
            totalAmount: cart.totalAmount,
            deliveryAddress,
            paymentMethod: paymentMethod || 'COD'
        });

        const createdOrder = await order.save();

        // Clear cart after order
        cart.items = [];
        cart.totalAmount = 0;
        await cart.save();

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user orders
// @route   GET /api/orders/user
// @access  Private
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            userId: req.user.id
        }).sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        console.error('getUserOrders error:', error);
        res.status(500).json({
            message: 'Failed to fetch orders',
            error: error.message
        });
    }
};

exports.getUserOrders = getUserOrders;

// @desc    Get all orders (Admin)
// @route   GET /api/order
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('userId', 'name email').sort('-createdAt');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/order/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = req.body.status || order.status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
