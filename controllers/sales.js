// controllers/analytics.js
const { Order } = require("../models/order");
const { Product } = require("../models/products");
const ctrlWrapper = require("../services/ctrlWrapper");

const getSalesAnalytics = async (req, res) => {
  // Get top 5 sold products
  const topProducts = await Order.aggregate([
    { $unwind: "$products" },
    {
      $group: {
        _id: "$products.productId",
        name: { $first: "$products.name" },
        totalSold: { $sum: "$products.quantity" },
        totalRevenue: { $sum: { $multiply: ["$products.price", "$products.quantity"] } }
      }
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 }
  ]);

  // Get sales data by time period (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const salesTrend = await Order.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        },
        totalSales: { $sum: "$totalAmount" },
        orderCount: { $sum: 1 }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ]);

  res.json({
    topProducts,
    salesTrend
  });
};

module.exports = {
  getSalesAnalytics: ctrlWrapper(getSalesAnalytics)
};