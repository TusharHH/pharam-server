const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const PrescriptionController = require("../../controllers/precription");
const authenticate = require("../../middlewares/authenticate");

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../../uploads/prescriptions");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `prescription-${uniqueSuffix}${ext}`);
  }
});

// File validation
const fileFilter = (req, file, cb) => {
  const validTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (validTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and PDF are allowed."), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5 // Max 5 files
  },
  fileFilter
});

// Routes
router.post("/upload", upload.array("images", 5), PrescriptionController.uploadFiles);
router.post("/", authenticate, PrescriptionController.createPrescription);
router.get("/", PrescriptionController.getUserPrescriptions);
router.get("/:id", PrescriptionController.getPrescriptionById);
router.patch("/:id/status", PrescriptionController.approvePrescription);

module.exports = router;