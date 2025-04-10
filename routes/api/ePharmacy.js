const express = require("express");

const router = express.Router();

const ctrl = require("../../controllers/ePharmacy");

router.get("/stores", ctrl.getAllStores);

router.get("/stores/nearest", ctrl.getNearestStores);

router.get("/customer-reviews", ctrl.getCustomerReviews);

router.get("/products", ctrl.getAllProducts);

router.get("/products/:id", ctrl.getProductById);

module.exports = router;
