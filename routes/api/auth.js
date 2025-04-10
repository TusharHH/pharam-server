const express = require("express");

const router = express.Router();

const ctrl = require("../../controllers/auth");
const validateBody = require("../../middlewares/validateBody");
const { schemas } = require("../../models/users");
const authenticate = require("../../middlewares/authenticate");

router.post(
  "/user/register",
  validateBody(schemas.registerSchema),
  ctrl.register
);

router.get('/users', ctrl.getAllUsers);

router.post("/user/login", validateBody(schemas.loginSchema), ctrl.login);

router.post("/user/logout", authenticate, ctrl.logout);

router.get("/user/user-info", authenticate, ctrl.getUserInfo);


module.exports = router;
