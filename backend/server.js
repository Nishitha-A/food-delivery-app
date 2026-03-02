const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

console.log("🔥 REAL SERVER.JS IS RUNNING");

connectDB();

const app = express();

app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true
}));
app.use(express.json());

const authRoutes = require('./routes/auth');
const restaurantRoutes = require('./routes/restaurant');
const foodRoutes = require('./routes/food');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');


app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

const path = require("path");

// Serve frontend build
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// For any route not starting with /api, serve React app
app.get("*", (req, res) => {
    if (!req.originalUrl.startsWith("/api")) {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    }
});

app.get('/', (req, res) => {
    res.send('QuickBite API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});