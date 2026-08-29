const express = require("express");

const {
  createDeal,
  getDeals,
  updateDeal,
  deleteDeal,
  getDealStats,
  getSalesIntelligence,
} = require("../controllers/dealController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ======================================================
// CREATE DEAL
// POST /api/deals
// ======================================================

router.post("/", authMiddleware, createDeal);

// ======================================================
// GET ALL DEALS
// GET /api/deals
// ======================================================

router.get("/", authMiddleware, getDeals);

// ======================================================
// DEAL STATISTICS + FORECAST
// GET /api/deals/stats
// ======================================================

router.get("/stats", authMiddleware, getDealStats);

// ======================================================
// SALES INTELLIGENCE
// GET /api/deals/intelligence
// ======================================================

router.get(
  "/intelligence",
  authMiddleware,
  getSalesIntelligence
);

// ======================================================
// UPDATE DEAL
// PUT /api/deals/:id
// ======================================================

router.put("/:id", authMiddleware, updateDeal);

// ======================================================
// DELETE DEAL
// DELETE /api/deals/:id
// ======================================================

router.delete("/:id", authMiddleware, deleteDeal);

module.exports = router;