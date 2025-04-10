// controllers/precription.js
const { Prescription } = require("../models/precriptions");
const fs = require("fs");
const path = require("path");

const uploadFiles = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const fileUrls = req.files.map(file => ({
      url: `/uploads/prescriptions/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    }));

    res.json({
      success: true,
      files: fileUrls
    });
  } catch (err) {
    // Cleanup uploaded files on error
    if (req.files) {
      req.files.forEach(file => {
        const filePath = path.join(__dirname, `../../uploads/prescriptions/${file.filename}`);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    next(err);
  }
};

const createPrescription = async (req, res, next) => {
  try {
    const { user } = req;
    const { images, prescriptionDate, doctorDetails, items } = req.body;

    const prescription = await Prescription.create({
      user: user._id,
      images,
      prescriptionDate,
      doctorDetails,
      items,
      status: "pending"
    });

    res.status(201).json({
      success: true,
      prescription
    });
  } catch (err) {
    next(err);
  }
};


const getUserPrescriptions = async (req, res, next) => {
  try {
    const prescriptions = await Prescription.find()
      .sort({ createdAt: -1 })
      .populate("items.product", "name price images");

    res.json(prescriptions);
  } catch (error) {
    next(error);
  }
};

const getPrescriptionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const prescription = await Prescription.findOne({
      _id: id,
    }).populate("items.product", "name price images");

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    res.json(prescription);
  } catch (error) {
    next(error);
  }
};

const approvePrescription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason, notes } = req.body;

    // const { error } = schemas.updatePrescriptionStatusSchema.validate(req.body);
    // if (error) {
    //   return res.status(400).json({ message: error.details[0].message });
    // }

    const prescription = await Prescription.findById(id)
      .populate("user", "name email phone")
      .populate("items.product", "name price");

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    // Update prescription status
    prescription.status = status;
    prescription.rejectionReason = status === "rejected" ? rejectionReason : "";
    prescription.notes = notes || "";
    await prescription.save();

    // If approved, create a cart with prescription items
    // if (status === "approved") {
    //   const cartItems = prescription.items.map(item => ({
    //     product: item.product?._id || null,
    //     name: item.product?.name || item.name,
    //     dosage: item.dosage,
    //     quantity: item.quantity,
    //     price: item.product?.price || 0,
    //     notes: item.notes,
    //   }));

    //   // Create or update user's cart
    //   let cart = await cart.findOne({ user: prescription.user._id });
      
    //   if (cart) {
    //     // Add prescription items to existing cart
    //     cart.items.push(...cartItems);
    //     await cart.save();
    //   } else {
    //     // Create new cart
    //     cart = await cart.create({
    //       user: prescription.user._id,
    //       items: cartItems,
    //     });
    //   }
    // }

    res.json(prescription);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadFiles,
  createPrescription,
  getUserPrescriptions,
  getPrescriptionById,
  approvePrescription,
};