// models/prescription.js
const { Schema, model } = require("mongoose");
const Joi = require("joi");
const handleMongooseError = require("../services/handleMongooseError");

const prescriptionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    images: [{
      type: String, // URLs to uploaded images
    }],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
    prescriptionDate: {
      type: Date,
      required: true,
    },
    doctorDetails: {
      name: String,
      licenseNumber: String,
      contact: String,
    },
    items: [{
      product: {
        type: Schema.Types.ObjectId,
        ref: "product",
      },
      name: String,
      dosage: String,
      quantity: Number,
      notes: String,
    }],
  },
  { versionKey: false, timestamps: true }
);

prescriptionSchema.post("save", handleMongooseError);

// Joi validation schemas
const createPrescriptionSchema = Joi.object({
  images: Joi.array().items(Joi.string()).min(1).required(),
  prescriptionDate: Joi.date().required(),
  doctorDetails: Joi.object({
    name: Joi.string().required(),
    licenseNumber: Joi.string().allow(""),
    contact: Joi.string().allow(""),
  }).required(),
  items: Joi.array().items(
    Joi.object({
      product: Joi.string(),
      name: Joi.string().required(),
      dosage: Joi.string().required(),
      quantity: Joi.number().integer().min(1).required(),
      notes: Joi.string().allow(""),
    })
  ).min(1).required(),
});

const updatePrescriptionStatusSchema = Joi.object({
  status: Joi.string().valid("approved", "rejected").required(),
  rejectionReason: Joi.string().when("status", {
    is: "rejected",
    then: Joi.string().required(),
    otherwise: Joi.string().allow(""),
  }),
  notes: Joi.string().allow(""),
});

const schemas = {
  createPrescriptionSchema,
  updatePrescriptionStatusSchema,
};

const Prescription = model("prescription", prescriptionSchema);

module.exports = {
  Prescription,
  schemas,
};