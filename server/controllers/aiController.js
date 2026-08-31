const Customer = require("../models/Customer");
const Deal = require("../models/Deal");
const Task = require("../models/Task");

// ======================================================
// HELPER FUNCTIONS
// ======================================================

const normalize = (value) =>
  String(value || "").toLowerCase().trim();

const getRiskFromScore = (score) => {
  if (score >= 70) return "High";
  if (score >= 40) return "Medium";
  return "Low";
};

const getUserId = (req) => {
  return req.user?.userId || req.user?.id;
};

const formatDate = (date) => {
  return new Date(date).toISOString().split("T")[0];
};

const addDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatDate(date);
};

// ======================================================
// AI CUSTOMER INSIGHT
// FREE LOCAL INTELLIGENCE ENGINE
// ======================================================

const getCustomerInsight = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { customerId } = req.body;

    if (!customerId) {
      return res.status(400).json({
        message: "Customer ID is required",
      });
    }

    const customer = await Customer.findOne({
      _id: customerId,
      createdBy: userId,
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    const deals = await Deal.find({
      customer: customerId,
      createdBy: userId,
    });

    const tasks = await Task.find({
      customer: customerId,
      createdBy: userId,
    });

    // --------------------------------------------------
    // BASIC STATISTICS
    // --------------------------------------------------

    const totalDealValue = deals.reduce(
      (total, deal) => total + Number(deal.value || 0),
      0
    );

    const openDeals = deals.filter((deal) => {
      const status = normalize(deal.status);

      return (
        status === "prospecting" ||
        status === "negotiation"
      );
    });

    const completedTasks = tasks.filter(
      (task) => normalize(task.status) === "completed"
    );

    const pendingTasks = tasks.filter((task) => {
      const status = normalize(task.status);

      return (
        status === "pending" ||
        status === "in-progress"
      );
    });

    // ==================================================
    // CUSTOMER INTELLIGENCE SCORE
    // ==================================================

    let score = 50;

    const customerStatus = normalize(customer.status);

    if (customerStatus === "active") {
      score += 20;
    }

    if (customerStatus === "lead") {
      score += 10;
    }

    if (customerStatus === "inactive") {
      score -= 35;
    }

    if (openDeals.length > 0) {
      score += 15;
    }

    if (openDeals.length >= 2) {
      score += 10;
    }

    if (totalDealValue >= 100000) {
      score += 15;
    } else if (totalDealValue >= 50000) {
      score += 10;
    } else if (totalDealValue > 0) {
      score += 5;
    }

    if (completedTasks.length > 0) {
      score += 5;
    }

    if (pendingTasks.length >= 3) {
      score -= 15;
    } else if (pendingTasks.length >= 1) {
      score -= 5;
    }

    score = Math.max(0, Math.min(100, score));

    // ==================================================
    // LEAD QUALITY
    // ==================================================

    let leadQuality = "Medium";

    if (score >= 70) {
      leadQuality = "High";
    } else if (score < 40) {
      leadQuality = "Low";
    }

    // ==================================================
    // CUSTOMER RISK
    // ==================================================

    let riskScore = 0;

    if (customerStatus === "inactive") {
      riskScore += 60;
    }

    if (pendingTasks.length >= 3) {
      riskScore += 25;
    } else if (pendingTasks.length >= 1) {
      riskScore += 10;
    }

    if (deals.length > 0 && openDeals.length === 0) {
      riskScore += 20;
    }

    if (customerStatus === "lead" && deals.length === 0) {
      riskScore += 10;
    }

    riskScore = Math.min(100, riskScore);

    const risk = getRiskFromScore(riskScore);

    // ==================================================
    // RECOMMENDED ACTION
    // ==================================================

    let recommendedAction =
      "Continue regular follow-up with the customer.";

    if (customerStatus === "inactive") {
      recommendedAction =
        "Reconnect with the customer and identify the reason for inactivity.";
    } else if (pendingTasks.length >= 3) {
      recommendedAction =
        "Prioritize and complete the pending customer tasks.";
    } else if (openDeals.length > 0) {
      recommendedAction =
        "Follow up on the active deal and move it toward the next sales stage.";
    } else if (deals.length === 0) {
      recommendedAction =
        "Engage the customer and identify a potential sales opportunity.";
    }

    // ==================================================
    // SUMMARY
    // ==================================================

    let summary =
      `${customer.name} has ${deals.length} deal(s) with a combined value of ₹${totalDealValue}. ` +
      `${pendingTasks.length} task(s) are currently pending and ` +
      `${completedTasks.length} task(s) are completed.`;

    if (openDeals.length > 0) {
      summary +=
        ` ${openDeals.length} deal(s) are currently active.`;
    }

    if (customerStatus === "inactive") {
      summary +=
        " The customer is currently inactive and requires re-engagement.";
    }

    // ==================================================
    // FOLLOW-UP MESSAGE
    // ==================================================

    let followUpMessage =
      `Hi ${customer.name}, I wanted to follow up and see if there are any updates regarding our discussion. Please let me know a convenient time to connect.`;

    if (openDeals.length > 0) {
      followUpMessage =
        `Hi ${customer.name}, I wanted to follow up regarding the active opportunity. Please let me know if you have any updates or if there is anything I can help with.`;
    }

    if (pendingTasks.length >= 3) {
      followUpMessage =
        `Hi ${customer.name}, I wanted to check in regarding the pending items. Please let me know if you need any assistance from our side to move things forward.`;
    }

    if (customerStatus === "inactive") {
      followUpMessage =
        `Hi ${customer.name}, I hope you are doing well. I wanted to reconnect and check whether there are any current requirements where we can assist you.`;
    }

    // ==================================================
    // RESPONSE
    // ==================================================

    res.status(200).json({
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        company: customer.company,
        status: customer.status,
      },

      insight: {
        score,
        leadQuality,
        risk,
        summary,
        recommendedAction,
        followUpMessage,
      },

      statistics: {
        totalDeals: deals.length,
        openDeals: openDeals.length,
        totalDealValue,
        totalTasks: tasks.length,
        pendingTasks: pendingTasks.length,
        completedTasks: completedTasks.length,
      },

      engine: {
        type: "local",
        provider: "AI CRM Intelligence Engine",
      },
    });
  } catch (error) {
    console.error("CUSTOMER INSIGHT ERROR:", error);

    res.status(500).json({
      message: "Failed to generate customer insight",
      error: error.message,
    });
  }
};

// ======================================================
// AI DEAL RISK ANALYSIS
// ======================================================

const getDealRisk = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { dealId } = req.body;

    if (!dealId) {
      return res.status(400).json({
        message: "Deal ID is required",
      });
    }

    const deal = await Deal.findOne({
      _id: dealId,
      createdBy: userId,
    }).populate(
      "customer",
      "name email company status"
    );

    if (!deal) {
      return res.status(404).json({
        message: "Deal not found",
      });
    }

    const dealStatus = normalize(deal.status);
    const dealValue = Number(deal.value || 0);
    const customerStatus = normalize(
      deal.customer?.status
    );

    // ==================================================
    // WIN PROBABILITY
    // ==================================================

    let winProbability = 50;

    switch (dealStatus) {
      case "won":
        winProbability = 100;
        break;

      case "lost":
        winProbability = 0;
        break;

      case "negotiation":
        winProbability = 70;
        break;

      case "prospecting":
        winProbability = 40;
        break;

      default:
        winProbability = 50;
    }

    if (customerStatus === "active") {
      winProbability += 10;
    }

    if (customerStatus === "inactive") {
      winProbability -= 25;
    }

    if (dealValue >= 100000) {
      winProbability += 5;
    }

    if (
      deal.notes &&
      String(deal.notes).trim().length > 0
    ) {
      winProbability += 5;
    }

    winProbability = Math.max(
      0,
      Math.min(100, Math.round(winProbability))
    );

    // ==================================================
    // RISK SCORE
    // ==================================================

    let riskScore = 50;

    if (dealStatus === "negotiation") {
      riskScore -= 10;
    }

    if (dealStatus === "prospecting") {
      riskScore += 15;
    }

    if (customerStatus === "active") {
      riskScore -= 10;
    }

    if (customerStatus === "inactive") {
      riskScore += 35;
    }

    if (dealValue === 0) {
      riskScore += 10;
    }

    if (
      deal.notes &&
      String(deal.notes).trim().length > 0
    ) {
      riskScore -= 5;
    }

    riskScore = Math.max(
      0,
      Math.min(100, riskScore)
    );

    const risk = getRiskFromScore(riskScore);

    // ==================================================
    // REASON
    // ==================================================

    let reason =
      "The deal currently has a moderate level of risk based on its sales stage and available CRM information.";

    if (dealStatus === "prospecting") {
      reason =
        "The deal is still in the prospecting stage, so additional qualification and customer engagement are needed.";
    } else if (dealStatus === "negotiation") {
      reason =
        "The deal is in negotiation, indicating strong progress, but follow-up is important to move it toward closure.";
    } else if (dealStatus === "won") {
      reason =
        "The deal has been successfully closed.";
    } else if (dealStatus === "lost") {
      reason =
        "The deal has been lost and should be reviewed for lessons and future opportunities.";
    }

    if (customerStatus === "inactive") {
      reason +=
        " The associated customer is inactive, which increases the risk.";
    }

    // ==================================================
    // RECOMMENDATION
    // ==================================================

    let recommendation =
      "Follow up with the customer and identify the next concrete step toward closing the deal.";

    if (dealStatus === "won") {
      recommendation =
        "Complete post-sale follow-up and look for expansion or cross-sell opportunities.";
    } else if (dealStatus === "lost") {
      recommendation =
        "Document the reason for loss and consider a future re-engagement strategy.";
    } else if (risk === "High") {
      recommendation =
        "Contact the customer as soon as possible, identify blockers, and establish a clear next step.";
    } else if (dealStatus === "negotiation") {
      recommendation =
        "Focus on resolving remaining objections and move the negotiation toward a final decision.";
    } else if (dealStatus === "prospecting") {
      recommendation =
        "Qualify the opportunity further and identify the customer's specific business requirement.";
    }

    res.status(200).json({
      deal: {
        id: deal._id,
        title: deal.title,
        value: deal.value,
        status: deal.status,

        customer: deal.customer
          ? {
              id: deal.customer._id,
              name: deal.customer.name,
              email: deal.customer.email,
              company: deal.customer.company,
              status: deal.customer.status,
            }
          : null,
      },

      analysis: {
        risk,
        riskScore,
        winProbability,
        reason,
        recommendation,
      },

      engine: {
        type: "local",
        provider: "AI CRM Intelligence Engine",
      },
    });
  } catch (error) {
    console.error("DEAL RISK ERROR:", error);

    res.status(500).json({
      message: "Failed to analyze deal",
      error: error.message,
    });
  }
};

// ======================================================
// AI LEAD ANALYSIS
// ======================================================

const getLeadAnalysis = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { customerId } = req.body;

    if (!customerId) {
      return res.status(400).json({
        message: "Customer ID is required",
      });
    }

    const customer = await Customer.findOne({
      _id: customerId,
      createdBy: userId,
    });

    if (!customer) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    if (normalize(customer.status) !== "lead") {
      return res.status(400).json({
        message: "AI lead analysis is only available for leads",
      });
    }

    const deals = await Deal.find({
      customer: customerId,
      createdBy: userId,
    });

    const tasks = await Task.find({
      customer: customerId,
      createdBy: userId,
    });

    // ==================================================
    // LEAD SCORE
    // ==================================================

    let leadScore = 20;

    const strengths = [];
    const concerns = [];

    if (customer.email) {
      leadScore += 15;
      strengths.push("Email contact information is available");
    } else {
      concerns.push("Email information is missing");
    }

    if (customer.phone) {
      leadScore += 15;
      strengths.push("Phone contact information is available");
    } else {
      concerns.push("Phone information is missing");
    }

    if (customer.company) {
      leadScore += 15;
      strengths.push("Company information is available");
    } else {
      concerns.push("Company information is missing");
    }

    if (
      customer.notes &&
      customer.notes.trim().length >= 10
    ) {
      leadScore += 15;
      strengths.push(
        "Lead contains additional requirement or engagement notes"
      );
    } else {
      concerns.push(
        "Very limited information about the lead's requirements"
      );
    }

    if (deals.length > 0) {
      leadScore += 15;
      strengths.push(
        "A sales opportunity has already been created"
      );
    } else {
      concerns.push(
        "No deal has been created for this lead yet"
      );
    }

    const pendingTasks = tasks.filter((task) => {
      return (
        normalize(task.status) === "pending" ||
        normalize(task.status) === "in-progress"
      );
    });

    if (pendingTasks.length > 0) {
      leadScore += 5;
      strengths.push(
        "The lead has active follow-up activity"
      );
    } else {
      concerns.push(
        "No follow-up task is currently scheduled"
      );
    }

    leadScore = Math.max(
      0,
      Math.min(100, leadScore)
    );

    // ==================================================
    // PRIORITY
    // ==================================================

    let priority = "COLD";

    if (leadScore >= 70) {
      priority = "HOT";
    } else if (leadScore >= 40) {
      priority = "WARM";
    }

    // ==================================================
    // ANALYSIS
    // ==================================================

    let analysis =
      "This lead currently requires more qualification and engagement.";

    if (priority === "HOT") {
      analysis =
        "This lead has strong conversion potential based on the available contact information, business details, and CRM activity.";
    } else if (priority === "WARM") {
      analysis =
        "This lead shows reasonable potential but requires additional engagement and qualification.";
    } else {
      analysis =
        "This lead currently has limited information or engagement signals and should be qualified further before prioritizing heavily.";
    }

    // ==================================================
    // RECOMMENDED ACTION
    // ==================================================

    let recommendedAction =
      "Collect more information about the lead's requirements.";

    if (priority === "HOT") {
      recommendedAction =
        "Contact this lead within 24 hours and schedule a discovery conversation.";
    } else if (priority === "WARM") {
      recommendedAction =
        "Follow up with the lead within the next few days and identify their business requirements.";
    } else {
      recommendedAction =
        "Qualify the lead by collecting missing contact, company, and requirement information.";
    }

    res.status(200).json({
      lead: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        company: customer.company,
        status: customer.status,
      },

      analysis: {
        leadScore,
        priority,
        analysis,
        strengths,
        concerns,
        recommendedAction,
      },

      statistics: {
        totalDeals: deals.length,
        totalTasks: tasks.length,
        pendingTasks: pendingTasks.length,
      },

      engine: {
        type: "local",
        provider: "AI CRM Intelligence Engine",
      },
    });
  } catch (error) {
    console.error("LEAD ANALYSIS ERROR:", error);

    res.status(500).json({
      message: "Failed to analyze lead",
      error: error.message,
    });
  }
};

// ======================================================
// AI TASK GENERATION
// GENERATES SUGGESTIONS — DOES NOT AUTO-SAVE
// ======================================================

const generateAITasks = async (req, res) => {
  try {
    const userId = getUserId(req);

    const { customerId, dealId } = req.body;

    if (!customerId && !dealId) {
      return res.status(400).json({
        message:
          "Customer ID or Deal ID is required",
      });
    }

    let customer = null;
    let deal = null;

    // ==================================================
    // LOAD DEAL
    // ==================================================

    if (dealId) {
      deal = await Deal.findOne({
        _id: dealId,
        createdBy: userId,
      }).populate(
        "customer",
        "name email phone company status notes"
      );

      if (!deal) {
        return res.status(404).json({
          message: "Deal not found",
        });
      }

      customer = deal.customer;
    }

    // ==================================================
    // LOAD CUSTOMER
    // ==================================================

    if (customerId && !deal) {
      customer = await Customer.findOne({
        _id: customerId,
        createdBy: userId,
      });

      if (!customer) {
        return res.status(404).json({
          message: "Customer not found",
        });
      }
    }

    const tasks = [];

    const customerName =
      customer?.name || "customer";

    // ==================================================
    // CUSTOMER TASKS
    // ==================================================

    if (customer) {
      if (normalize(customer.status) === "lead") {
        tasks.push({
          title: `Contact ${customerName}`,
          description:
            "Reach out to the lead and understand their business requirements.",
          dueDate: addDays(1),
          priority: "high",
          status: "pending",
        });

        tasks.push({
          title: `Qualify ${customerName}`,
          description:
            "Collect additional information and evaluate conversion potential.",
          dueDate: addDays(3),
          priority: "medium",
          status: "pending",
        });
      }

      if (normalize(customer.status) === "active") {
        tasks.push({
          title: `Follow up with ${customerName}`,
          description:
            "Check for updates, requirements, or new business opportunities.",
          dueDate: addDays(2),
          priority: "medium",
          status: "pending",
        });
      }

      if (normalize(customer.status) === "inactive") {
        tasks.push({
          title: `Re-engage ${customerName}`,
          description:
            "Reconnect with the customer and identify reasons for inactivity.",
          dueDate: addDays(1),
          priority: "high",
          status: "pending",
        });
      }
    }

    // ==================================================
    // DEAL TASKS
    // ==================================================

    if (deal) {
      const dealStatus = normalize(deal.status);

      if (dealStatus === "prospecting") {
        tasks.push({
          title: `Qualify deal: ${deal.title}`,
          description:
            "Understand the customer's requirements and qualify the sales opportunity.",
          dueDate: addDays(2),
          priority: "high",
          status: "pending",
        });

        tasks.push({
          title: `Schedule discussion for ${deal.title}`,
          description:
            "Arrange a follow-up conversation to discuss requirements and next steps.",
          dueDate: addDays(4),
          priority: "medium",
          status: "pending",
        });
      }

      if (dealStatus === "negotiation") {
        tasks.push({
          title: `Follow up on negotiation: ${deal.title}`,
          description:
            "Discuss remaining objections and identify blockers preventing closure.",
          dueDate: addDays(1),
          priority: "high",
          status: "pending",
        });

        tasks.push({
          title: `Prepare closing plan: ${deal.title}`,
          description:
            "Define clear next steps and work toward a final decision.",
          dueDate: addDays(3),
          priority: "high",
          status: "pending",
        });
      }

      if (dealStatus === "won") {
        tasks.push({
          title: `Post-sale follow-up: ${deal.title}`,
          description:
            "Ensure a smooth customer experience and identify future opportunities.",
          dueDate: addDays(3),
          priority: "medium",
          status: "pending",
        });
      }

      if (dealStatus === "lost") {
        tasks.push({
          title: `Review lost deal: ${deal.title}`,
          description:
            "Document the reason for the loss and identify lessons for future opportunities.",
          dueDate: addDays(3),
          priority: "low",
          status: "pending",
        });
      }
    }

    // ==================================================
    // REMOVE DUPLICATE TASK TITLES
    // ==================================================

    const uniqueTasks = tasks.filter(
      (task, index, self) =>
        index ===
        self.findIndex(
          (item) => item.title === task.title
        )
    );

    res.status(200).json({
      customer: customer
        ? {
            id: customer._id,
            name: customer.name,
          }
        : null,

      deal: deal
        ? {
            id: deal._id,
            title: deal.title,
            status: deal.status,
          }
        : null,

      tasks: uniqueTasks,

      message:
        "AI-generated task suggestions created successfully.",

      engine: {
        type: "local",
        provider: "AI CRM Intelligence Engine",
      },
    });
  } catch (error) {
    console.error(
      "AI TASK GENERATION ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to generate AI task suggestions",
      error: error.message,
    });
  }
};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  getCustomerInsight,
  getDealRisk,
  getLeadAnalysis,
  generateAITasks,
};