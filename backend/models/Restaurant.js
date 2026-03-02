const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true }, // Cloudinary URL
    description: { type: String, required: true },
    address: { type: String, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
