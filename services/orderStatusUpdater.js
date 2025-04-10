// services/orderStatusUpdater.js
const { Order } = require("../models/order");

const statusFlow = ["pending", "processing", "shipped", "delivered"];

const updateOrderStatuses = async () => {
  try {
    // Get all orders that aren't delivered or cancelled
    const orders = await Order.find({
      status: { $nin: ["delivered", "cancelled"] }
    });

    for (const order of orders) {
      const currentStatusIndex = statusFlow.indexOf(order.status);
      if (currentStatusIndex < statusFlow.length - 1) {
        const newStatus = statusFlow[currentStatusIndex + 1];
        await Order.findByIdAndUpdate(order._id, {
          status: newStatus,
          $push: { statusHistory: { status: newStatus } }
        });
      }
    }

    console.log(`Updated ${orders.length} order statuses`);
  } catch (error) {
    console.error("Error updating order statuses:", error);
  }
};

// Export for manual triggering if needed
module.exports = {
  updateOrderStatuses,
  startAutoUpdates: () => {
    // Run every 10 seconds for testing
    return setInterval(updateOrderStatuses, 10000);
  }
};