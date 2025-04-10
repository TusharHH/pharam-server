const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const { Product } = require('../models/products');
const { Store } = require('../models/stores');
const { NearestStore } = require('../models/nearestStores');
const { CustomerReview } = require('../models/customerReviews');
const { User } = require('../models/users');
const { Cart } = require('../models/cart');
const generateData = () => {
  const products = Array.from({ length: 50 }, (_, i) => ({
    name: `Product ${i + 1}`,
    photo: `https://source.unsplash.com/random/150x150?sig=${i}`,
    suppliers: `Supplier ${i % 5 + 1}`,
    stock: Math.floor(Math.random() * 200) + 10,
    price: parseFloat((Math.random() * 50 + 5).toFixed(2)),
    category: ['Pain Relief', 'Vitamins', 'Antibiotics', 'Supplements', 'Cold & Flu'][i % 5]
  }));

  const stores = Array.from({ length: 10 }, (_, i) => ({
    name: `Pharmacy ${i + 1}`,
    address: `${i + 1} Main Street`,
    city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami'][i % 5],
    phone: `+1 212-555-${1000 + i}`,
    rating: parseFloat((Math.random() * 2 + 3).toFixed(1))
  }));

  const nearestStores = Array.from({ length: 10 }, (_, i) => ({
    name: `Nearest Pharmacy ${i + 1}`,
    address: `${i + 1} Oak Avenue`,
    city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami'][i % 5],
    phone: `+1 212-555-${2000 + i}`,
    rating: parseFloat((Math.random() * 2 + 3).toFixed(1))
  }));

  const customerReviews = Array.from({ length: 20 }, (_, i) => ({
    name: `Customer ${i + 1}`,
    testimonial: `This is my review #${i + 1}. Excellent service!`
  }));

  const users = Array.from({ length: 15 }, (_, i) => ({
    name: `User ${i + 1}`,
    phone: `+1 212-555-${3000 + i}`,
    email: `user${i + 1}@example.com`,
    password: `password${i + 1}`,
    verify: Math.random() > 0.5
  }));

  return { products, stores, nearestStores, customerReviews, users };
};

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DB_HOST, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to MongoDB");

    // Clear existing data
    console.log("Clearing existing data...");
    await Promise.all([
      Product.deleteMany(),
      Store.deleteMany(),
      NearestStore.deleteMany(),
      CustomerReview.deleteMany(),
      User.deleteMany(),
      Cart.deleteMany()
    ]);
    console.log("Existing data cleared");

    // Generate new data
    const { products, stores, nearestStores, customerReviews, users } = generateData();

    // Insert data in proper order
    console.log("Inserting products...");
    const createdProducts = await Product.insertMany(products);
    console.log(`${createdProducts.length} products inserted`);

    console.log("Inserting stores...");
    const createdStores = await Store.insertMany(stores);
    console.log(`${createdStores.length} stores inserted`);

    console.log("Inserting nearest stores...");
    const createdNearestStores = await NearestStore.insertMany(nearestStores);
    console.log(`${createdNearestStores.length} nearest stores inserted`);

    console.log("Inserting reviews...");
    const createdReviews = await CustomerReview.insertMany(customerReviews);
    console.log(`${createdReviews.length} reviews inserted`);

    // Insert users with carts
    console.log("Creating users with carts...");
    for (const userData of users) {
      const user = new User(userData);
      await user.save();

      // Get a random product
      const randomProduct = createdProducts[
        Math.floor(Math.random() * createdProducts.length)
      ];

      // Create cart with reference to the product
      const cart = new Cart({
        userId: user._id,
        products: [{
          productId: randomProduct._id,
          quantity: Math.floor(Math.random() * 5) + 1
        }],
        total: (randomProduct.price * quantity).toFixed(2)
      });
      await cart.save();

      user.cart = cart._id;
      await user.save();
    }
    console.log(`${users.length} users with carts created`);

    console.log("✅ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();