const Customer = require("../models/Customer");

// Create customer
const createCustomer = async (req, res) => {
  try {
    const { name, email, phone, company, status, notes } = req.body;

    console.log("AUTH USER:", req.user);

    const createdBy = req.user.userId || req.user.id;

    if (!createdBy) {
      return res.status(401).json({
        message: "User ID missing from token",
        user: req.user,
      });
    }

    const customer = await Customer.create({
      name,
      email,
      phone,
      company,
      status,
      notes,
      createdBy,
    });

    res.status(201).json({
      message: "Customer created successfully",
      customer,
    });
  } catch (error) {
    console.error("CREATE CUSTOMER ERROR:", error);

    res.status(500).json({
      message: "Failed to create customer",
      error: error.message,
    });
  }
};

// Get logged-in user's customers
const getCustomers = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    const customers = await Customer.find({
      createdBy: userId,
    }).sort({ createdAt: -1 });

    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch customers",
      error: error.message,
    });
  }
};

// Update customer
const updateCustomer = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    const { name, email, phone, company, status, notes } = req.body;

    const customer = await Customer.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: userId,
      },
      {
        name,
        email,
        phone,
        company,
        status,
        notes,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.status(200).json({
      message: "Customer updated successfully",
      customer,
    });
  } catch (error) {
    console.error("UPDATE CUSTOMER ERROR:", error);

    res.status(500).json({
      message: "Failed to update customer",
      error: error.message,
    });
  }
};

// Dashboard statistics
const getCustomerStats = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    const totalCustomers = await Customer.countDocuments({
      createdBy: userId,
    });

    const totalLeads = await Customer.countDocuments({
      createdBy: userId,
      status: "lead",
    });

    const activeCustomers = await Customer.countDocuments({
      createdBy: userId,
      status: "active",
    });

    const inactiveCustomers = await Customer.countDocuments({
      createdBy: userId,
      status: "inactive",
    });

    res.status(200).json({
      totalCustomers,
      totalLeads,
      activeCustomers,
      inactiveCustomers,
    });
  } catch (error) {
    console.error("DASHBOARD STATS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};

// Delete customer
const deleteCustomer = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    const customer = await Customer.findOneAndDelete({
      _id: req.params.id,
      createdBy: userId,
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.status(200).json({
      message: "Customer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete customer",
      error: error.message,
    });
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
  getCustomerStats,
};