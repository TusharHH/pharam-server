const express = require("express");

const router = express.Router();

const ctrl = require("../../controllers/cart");
const authenticate = require("../../middlewares/authenticate");
const validateBody = require("../../middlewares/validateBody");
const { schemas } = require("../../models/cart");

router.get("/cart", authenticate, ctrl.getCartItems);

router.put(
  "/cart/update",
  authenticate,
  validateBody(schemas.updateCartSchema),
  ctrl.updateCart
);

router.post(
  "/cart/checkout",
  authenticate,
  validateBody(schemas.cartCheckoutSchema),
  ctrl.cartCheckout
);

router.patch(
  "/cart/add",
  authenticate,
  validateBody(schemas.addToCartSchema),
  ctrl.addToCart
);

router.patch(
  "/cart/decrease",
  authenticate,
  validateBody(schemas.decreaseQuantitySchema),
  ctrl.decreaseQuantity
);

router.delete("/cart/remove/:productId", authenticate, ctrl.deleteFromCart);

module.exports = router;
