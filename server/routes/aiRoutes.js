const express = require("express");

const {
  getCustomerInsight,
  getDealRisk,
} = require("../controllers/aiController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/customer-insight",
  authMiddleware,
  getCustomerInsight
);

router.post(
  "/deal-risk",
  authMiddleware,
  getDealRisk
);

module.exports = router;