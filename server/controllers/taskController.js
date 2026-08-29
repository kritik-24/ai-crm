const Task = require("../models/Task");
const Customer = require("../models/Customer");
const Deal = require("../models/Deal");

// Create task
const createTask = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    const {
      title,
      description,
      customer,
      deal,
      dueDate,
      priority,
      status,
    } = req.body;

    // Validate customer if provided
    if (customer) {
      const existingCustomer = await Customer.findOne({
        _id: customer,
        createdBy: userId,
      });

      if (!existingCustomer) {
        return res.status(404).json({
          message: "Customer not found",
        });
      }
    }

    // Validate deal if provided
    if (deal) {
      const existingDeal = await Deal.findOne({
        _id: deal,
        createdBy: userId,
      });

      if (!existingDeal) {
        return res.status(404).json({
          message: "Deal not found",
        });
      }
    }

    const task = await Task.create({
      title,
      description,
      customer: customer || null,
      deal: deal || null,
      dueDate,
      priority,
      status,
      createdBy: userId,
    });

    const populatedTask = await Task.findById(task._id)
      .populate("customer", "name email company")
      .populate("deal", "title value status");

    res.status(201).json({
      message: "Task created successfully",
      task: populatedTask,
    });
  } catch (error) {
    console.error("CREATE TASK ERROR:", error);

    res.status(500).json({
      message: "Failed to create task",
      error: error.message,
    });
  }
};

// Get logged-in user's tasks
const getTasks = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    const tasks = await Task.find({
      createdBy: userId,
    })
      .populate("customer", "name email company")
      .populate("deal", "title value status")
      .sort({ dueDate: 1 });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("GET TASKS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    const {
      title,
      description,
      customer,
      deal,
      dueDate,
      priority,
      status,
    } = req.body;

    // Validate customer if provided
    if (customer) {
      const existingCustomer = await Customer.findOne({
        _id: customer,
        createdBy: userId,
      });

      if (!existingCustomer) {
        return res.status(404).json({
          message: "Customer not found",
        });
      }
    }

    // Validate deal if provided
    if (deal) {
      const existingDeal = await Deal.findOne({
        _id: deal,
        createdBy: userId,
      });

      if (!existingDeal) {
        return res.status(404).json({
          message: "Deal not found",
        });
      }
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: userId,
      },
      {
        title,
        description,
        customer: customer || null,
        deal: deal || null,
        dueDate,
        priority,
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("customer", "name email company")
      .populate("deal", "title value status");

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error("UPDATE TASK ERROR:", error);

    res.status(500).json({
      message: "Failed to update task",
      error: error.message,
    });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      createdBy: userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("DELETE TASK ERROR:", error);

    res.status(500).json({
      message: "Failed to delete task",
      error: error.message,
    });
  }
};

// Task statistics
const getTaskStats = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    const totalTasks = await Task.countDocuments({
      createdBy: userId,
    });

    const pendingTasks = await Task.countDocuments({
      createdBy: userId,
      status: "pending",
    });

    const inProgressTasks = await Task.countDocuments({
      createdBy: userId,
      status: "in-progress",
    });

    const completedTasks = await Task.countDocuments({
      createdBy: userId,
      status: "completed",
    });

    res.status(200).json({
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
    });
  } catch (error) {
    console.error("TASK STATS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch task statistics",
      error: error.message,
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getTaskStats,
};