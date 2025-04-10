const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// Initialize Express app
const app = express();

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:5173"
].filter(Boolean); // removes undefined/null if FRONTEND_URL isn't set

// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true
// }));
app.use(cors())

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));
// Add this with your other routes
app.use("/api/analytics", require("./routes/api/sales"));

const authRouter = require("./routes/api/auth");
const cartRouter = require("./routes/api/cart");
const productRouter = require("./routes/api/product");
const orderRouter = require("./routes/api/order");
const ePharmacyRouter = require("./routes/api/ePharmacy");

// Routes
app.use("/api/prescriptions", require("./routes/api/precription")); // Fixed typo in "prescription"
app.use("/api", ePharmacyRouter);
app.use("/api", authRouter);
app.use("/api", cartRouter);
app.use("/api/cms", productRouter);
app.use("/api/orders", orderRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});
if (process.env.AUTO_UPDATE_ORDERS === "true") {
  const { startAutoUpdates } = require("./services/orderStatusUpdater");
  const updateInterval = startAutoUpdates();
  process.on('SIGTERM', () => clearInterval(updateInterval));
}

// Export the Express app
module.exports = app;