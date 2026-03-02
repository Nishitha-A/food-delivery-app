const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    deliveryAddress: { type: String, required: true },
    paymentMethod: { type: String, enum: ['COD', 'Online'], default: 'COD' },
    status: {
        type: String,
        enum: ['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
