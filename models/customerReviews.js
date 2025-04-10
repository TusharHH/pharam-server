const { Schema, model } = require("mongoose");
const handleMongooseError = require("../services/handleMongooseError");

const customerReviewsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    testimonial: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

customerReviewsSchema.post("save", handleMongooseError);

const CustomerReview = model("review", customerReviewsSchema);

module.exports = {
  CustomerReview,
};
