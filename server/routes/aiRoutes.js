const express = require("express");

const {
  getCustomerInsight,
  getDealRisk,
  getLeadAnalysis,
  generateAITasks,
} = require("../controllers/aiController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// AI Customer Insight
router.post(
  "/customer-insight",
  authMiddleware,
  getCustomerInsight
);

// AI Deal Risk Analysis
router.post(
  "/deal-risk",
  authMiddleware,
  getDealRisk
);

// AI Lead Analysis
router.post(
  "/lead-analysis",
  authMiddleware,
  getLeadAnalysis
);

// AI Task Generation
router.post(
  "/generate-tasks",
  authMiddleware,
  generateAITasks
);

module.exports = router;