const { Schema, model } = require("mongoose");
const Joi = require("joi");
const handleMongooseError = require("../services/handleMongooseError");

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    cartId: {
      type: Schema.Types.ObjectId,
      ref: "cart",
      required: true
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "product",
          required: true
        },
        name: String,
        quantity: Number,
        price: Number
      }
    ],
    totalAmount: {
      type: Number,
      required: true
    },
    shippingAddress: {
      type: String,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "bank"],
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending"
    },
    statusHistory: [
      {
        status: String,
        changedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    trackingNumber: String
  },
  { versionKey: false, timestamps: true }
);

orderSchema.post("save", handleMongooseError);

// Joi validation schemas
const createOrderSchema = Joi.object({
  cartId: Joi.string().required(),
  shippingAddress: Joi.string().required(),
  paymentMethod: Joi.string().valid("cash", "bank").required()
});

const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid("pending", "processing", "shipped", "delivered", "cancelled").required()
});

const schemas = {
  createOrderSchema,
  updateOrderStatusSchema
};

const Order = model("order", orderSchema);

module.exports = {
  Order,
  schemas
};