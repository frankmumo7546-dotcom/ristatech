const express = require("express");
const router = express.Router();
const User = require("../models/user");
const authController = require("../controllers/authControllers");

// REGISTER ROUTE (NEW)
router.post("/register", authController.register);

// LOGIN ROUTE
router.post(
  "/login",
  (req, res, next) => {
    console.log("🟢 ROUTE HIT: /auth/login");
    next();
  },
  authController.login
);

module.exports = router;