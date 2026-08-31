const express = require("express");

const {
  register,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const router = express.Router();

// Registration
router.post("/register", register);

// Login
router.post("/login", login);

// Forgot Password - Send OTP
router.post("/forgot-password", forgotPassword);

// Reset Password - Verify OTP and set new password
router.post("/reset-password", resetPassword);

module.exports = router;