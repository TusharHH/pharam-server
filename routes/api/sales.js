// routes/api/analytics.js
const express = require("express");
const router = express.Router();
const analyticsController = require("../../controllers/sales");

router.get("/sales", analyticsController.getSalesAnalytics);

module.exports = router;