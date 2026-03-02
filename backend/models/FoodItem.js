const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    name: { type: String, required: true },
    image: { type: String, required: true }, // Cloudinary URL
    price: { type: Number, required: true },
    category: { type: String, required: true },
    isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('FoodItem', foodItemSchema);
