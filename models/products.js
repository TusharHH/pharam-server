const { Schema, model } = require("mongoose");
const handleMongooseError = require("../services/handleMongooseError");

const productsSchema = new Schema(
  {
    photo: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    suppliers: {
      type: String,
      required: true,
    },
    stock: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

productsSchema.post("save", handleMongooseError);

const Product = model("product", productsSchema);

module.exports = {
  Product,
};
