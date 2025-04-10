const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models/users");
const httpError = require("../services/httpError");
const ctrlWrapper = require("../services/ctrlWrapper");

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { name, email, phone, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw httpError(409, "Email in use");
  }

  const hashPassword = await bcryptjs.hash(password, 10);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
  });

  res.status(201).json({
    user: {
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw httpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcryptjs.compare(password, user.password);

  if (!passwordCompare) {
    throw httpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });

  await User.findByIdAndUpdate(user._id, { token }, { new: true });

  res.json({
    token,
    user: {
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json({
    message: "Logout success",
  });
};

const getUserInfo = async (req, res) => {
  const { email } = req.user;

  const user = await User.findOne({ email });

  res.json({
    user: {
      name: user.name,
      email,
    },
  });
};

const getAllUsers = async (req, res) => {
  console.log("getAllUsers");
  const users = await User.find({}, "-password");

  res.json({
    users
  });
}

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getUserInfo: ctrlWrapper(getUserInfo),
  getAllUsers: ctrlWrapper(getAllUsers),
};
