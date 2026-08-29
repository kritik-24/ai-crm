const express = require("express");

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getTaskStats,
} = require("../controllers/taskController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create task
router.post("/", authMiddleware, createTask);

// Get all tasks
router.get("/", authMiddleware, getTasks);

// Get task statistics
router.get("/stats", authMiddleware, getTaskStats);

// Update task
router.put("/:id", authMiddleware, updateTask);

// Delete task
router.delete("/:id", authMiddleware, deleteTask);

module.exports = router;