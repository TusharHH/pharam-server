const { Schema, model } = require("mongoose");
const Joi = require("joi");
const handleMongooseError = require("../services/handleMongooseError");

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    isOrdered: {
      type: Boolean,
      default: false,
    },
    payment: {
      type: String,
      enum: ["cash", "bank"],
    },
    name: {
      type: String,
      ref: "user",
    },
    email: {
      type: String,
      ref: "user",
      match: emailRegex,
    },
    phone: {
      type: String,
      ref: "user",
    },
    address: {
      type: String,
      ref: "user",
    },
    total: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true }
);

cartSchema.post("save", handleMongooseError);

const updateCartSchema = Joi.object({
  products: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
      })
    )
    .min(1)
    .required("Products are required"),
});

const cartCheckoutSchema = Joi.object({
  name: Joi.string().required("Name is required"),
  email: Joi.string().pattern(emailRegex).required("Email is required"),
  phone: Joi.string().required("Phone number is required"),
  address: Joi.string().required("Address is required"),
  payment: Joi.string()
    .valid("cash", "bank")
    .required("Payment method is required"),
});

const addToCartSchema = Joi.object({
  productId: Joi.string().required("Product id is required"),
  quantity: Joi.number().integer().required("Product quantity is required"),
});

const decreaseQuantitySchema = Joi.object({
  productId: Joi.string().required("Product id is required"),
  quantity: Joi.number().integer().required("Product quantity is required"),
});

const schemas = {
  updateCartSchema,
  cartCheckoutSchema,
  addToCartSchema,
  decreaseQuantitySchema,
};

const Cart = model("cart", cartSchema);

module.exports = {
  Cart,
  schemas,
};
