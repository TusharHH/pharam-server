const { Schema, model } = require("mongoose");
const handleMongooseError = require("../services/handleMongooseError");

const storesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

storesSchema.post("save", handleMongooseError);

const Store = model("pharmacy", storesSchema);

module.exports = {
  Store,
};
