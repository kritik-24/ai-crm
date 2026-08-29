const express = require("express");

const {
  createCustomer,
  getCustomers,
  updateCustomer,
  getCustomerStats,
  deleteCustomer,
} = require("../controllers/customerController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createCustomer);

router.get("/", authMiddleware, getCustomers);

router.get("/stats", authMiddleware, getCustomerStats);

router.put("/:id", authMiddleware, updateCustomer);

router.delete("/:id", authMiddleware, deleteCustomer);

module.exports = router;