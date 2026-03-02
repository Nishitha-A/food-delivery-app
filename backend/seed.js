const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Restaurant = require('./models/Restaurant');
const FoodItem = require('./models/FoodItem');

dotenv.config();

const restaurants = [
    {
        name: "Pizza Palace",
        description: "Best wood-fired pizzas in town. Fresh ingredients, crispy crust.",
        address: "123 Main Street, Mumbai",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600",
        isActive: true
    },
    {
        name: "Burger Barn",
        description: "Juicy burgers, crispy fries. Your comfort food destination.",
        address: "456 Park Avenue, Delhi",
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600",
        isActive: true
    },
    {
        name: "Noodle House",
        description: "Authentic Chinese noodles and rice dishes.",
        address: "789 China Town, Bangalore",
        image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600",
        isActive: true
    },
    {
        name: "Taco Town",
        description: "Mexican street food — tacos, burritos, nachos and more.",
        address: "321 Spice Road, Chennai",
        image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600",
        isActive: true
    }
];

const pizzaPalaceFoods = [
    {
        name: "Margherita Pizza", price: 299, category: "Pizza",
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",
        isAvailable: true
    },
    {
        name: "Pepperoni Pizza", price: 349, category: "Pizza",
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400",
        isAvailable: true
    },
    {
        name: "Garlic Bread", price: 99, category: "Sides",
        image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=400",
        isAvailable: true
    },
    {
        name: "Coke", price: 60, category: "Drinks",
        image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400",
        isAvailable: true
    }
];

const burgerBarnFoods = [
    {
        name: "Classic Chicken Burger", price: 199, category: "Burgers",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
        isAvailable: true
    },
    {
        name: "Veg Burger", price: 149, category: "Burgers",
        image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400",
        isAvailable: true
    },
    {
        name: "French Fries", price: 89, category: "Sides",
        image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400",
        isAvailable: true
    },
    {
        name: "Chocolate Shake", price: 129, category: "Drinks",
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400",
        isAvailable: true
    }
];

const noodleHouseFoods = [
    {
        name: "Veg Hakka Noodles", price: 149, category: "Noodles",
        image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400",
        isAvailable: true
    },
    {
        name: "Chicken Fried Rice", price: 179, category: "Rice",
        image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400",
        isAvailable: true
    },
    {
        name: "Spring Rolls", price: 119, category: "Starters",
        image: "https://images.unsplash.com/photo-1548869206-93b036288d7b?w=400",
        isAvailable: true
    }
];

const tacoTownFoods = [
    {
        name: "Chicken Taco", price: 129, category: "Tacos",
        image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400",
        isAvailable: true
    },
    {
        name: "Veg Burrito", price: 159, category: "Burritos",
        image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400",
        isAvailable: true
    },
    {
        name: "Nachos with Salsa", price: 109, category: "Sides",
        image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400",
        isAvailable: true
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        // Clear existing data
        await Restaurant.deleteMany({});
        await FoodItem.deleteMany({});
        console.log("Cleared existing restaurants and food items.");

        // Insert Restaurants
        await Restaurant.insertMany(restaurants);
        console.log("Restaurants inserted.");

        // Get inserted restaurants to associate foods
        const dbRestaurants = await Restaurant.find({});

        const allFoodItems = [];

        dbRestaurants.forEach(res => {
            let foodsToAdd = [];
            if (res.name === "Pizza Palace") foodsToAdd = pizzaPalaceFoods;
            else if (res.name === "Burger Barn") foodsToAdd = burgerBarnFoods;
            else if (res.name === "Noodle House") foodsToAdd = noodleHouseFoods;
            else if (res.name === "Taco Town") foodsToAdd = tacoTownFoods;

            foodsToAdd.forEach(food => {
                allFoodItems.push({
                    ...food,
                    restaurantId: res._id
                });
            });
        });

        // Insert Food Items
        await FoodItem.insertMany(allFoodItems);

        console.log("✅ Restaurants + Food Items seeded successfully!");
        console.log("🍕 4 restaurants added");
        console.log(`🍔 ${allFoodItems.length} food items added`);

        process.exit();
    } catch (error) {
        console.error("❌ Seed failed:" + error);
        process.exit(1);
    }
};

seedDB();
