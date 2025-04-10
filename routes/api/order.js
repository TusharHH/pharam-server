const express = require("express");
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getUserOrders
} = require("../../controllers/order");
const authenticate = require("../../middlewares/authenticate");
const validateBody = require("../../middlewares/validateBody");
const { createOrderSchema, updateOrderStatusSchema } = require("../../models/order");

// Correct order
router.get("/admin", getAllOrders);
router.patch("/admin/:id/status", updateOrderStatus);
router.delete("/admin/:id", deleteOrder);

router.get("/user", authenticate, getUserOrders);
router.get("/:id", getOrderById); // <- this comes after
router.patch("/:id/status", updateOrderStatus);
router.delete("/:id", deleteOrder);


module.exports = router;