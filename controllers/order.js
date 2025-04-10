const { Order } = require("../models/order");
const { Cart } = require("../models/cart");
const { Product } = require("../models/products");
const { User } = require("../models/users");
const httpError = require("../services/httpError");
const ctrlWrapper = require("../services/ctrlWrapper");

const createOrder = async (req, res, next) => {
  const { _id: userId } = req.user;
  const { cartId, shippingAddress, paymentMethod } = req.body;

  // Get cart and verify ownership
  const cart = await Cart.findOne({ _id: cartId, userId }).populate({
    path: "products.productId",
    model: "product"
  });

  if (!cart) {
    throw httpError(404, "Cart not found or doesn't belong to user");
  }

  // Prepare order products
  const orderProducts = cart.products.map(item => ({
    productId: item.productId._id,
    name: item.productId.name,
    quantity: item.quantity,
    price: item.productId.price
  }));

  // Calculate total
  const totalAmount = orderProducts.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Create order
  const order = await Order.create({
    userId,
    cartId,
    products: orderProducts,
    totalAmount,
    shippingAddress,
    paymentMethod,
    statusHistory: [{ status: "pending" }]
  });

  // Mark cart as ordered
  cart.isOrdered = true;
  await cart.save();

  res.status(201).json(order);
};

const getAllOrders = async (req, res, next) => {
  const orders = await Order.find()
    .populate("userId", "name email")
    .sort({ createdAt: -1 });
  res.json(orders);
};

const getOrderById = async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById(id).populate("userId", "name email");
  
  if (!order) {
    throw httpError(404, "Order not found");
  }

  res.json(order);
};
// controllers/orders.js
const getUserOrders = async (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      throw httpError(401, "Not authenticated");
    }

    const userId = req.user._id;
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate("products.productId", "name price"); // Optional: populate product details

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await Order.findByIdAndUpdate(
    id,
    {
      status,
      $push: { statusHistory: { status } }
    },
    { new: true }
  );

  if (!order) {
    throw httpError(404, "Order not found");
  }

  res.json(order);
};

const deleteOrder = async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findByIdAndDelete(id);
  
  if (!order) {
    throw httpError(404, "Order not found");
  }

  res.json({ message: "Order deleted successfully" });
};

module.exports = {
  createOrder: ctrlWrapper(createOrder),
  getAllOrders: ctrlWrapper(getAllOrders),
  getOrderById: ctrlWrapper(getOrderById),
  getUserOrders: ctrlWrapper(getUserOrders),
  updateOrderStatus: ctrlWrapper(updateOrderStatus),
  deleteOrder: ctrlWrapper(deleteOrder)
};