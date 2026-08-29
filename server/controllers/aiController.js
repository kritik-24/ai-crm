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

// ======================================================
// AI CUSTOMER INSIGHT
// FREE LOCAL INTELLIGENCE ENGINE
// ======================================================

const getCustomerInsight = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { customerId } = req.body;

    if (!customerId) {
      return res.status(400).json({
        message: "Customer ID is required",
      });
    }

    // --------------------------------------------------
    // FIND CUSTOMER
    // --------------------------------------------------

    const customer = await Customer.findOne({
      _id: customerId,
      createdBy: userId,
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    // --------------------------------------------------
    // FIND DEALS
    // --------------------------------------------------

    const deals = await Deal.find({
      customer: customerId,
      createdBy: userId,
    });

    // --------------------------------------------------
    // FIND TASKS
    // --------------------------------------------------

    const tasks = await Task.find({
      customer: customerId,
      createdBy: userId,
    });

    // --------------------------------------------------
    // BASIC STATISTICS
    // --------------------------------------------------

    const totalDealValue = deals.reduce(
      (total, deal) =>
        total + Number(deal.value || 0),
      0
    );

    const openDeals = deals.filter((deal) => {
      const status = normalize(deal.status);

      return (
        status === "prospecting" ||
        status === "negotiation" ||
        status === "open" ||
        status === "qualified"
      );
    });

    const completedTasks = tasks.filter(
      (task) =>
        normalize(task.status) === "completed"
    );

    const pendingTasks = tasks.filter((task) => {
      const status = normalize(task.status);

      return (
        status === "pending" ||
        status === "in-progress" ||
        status === "in progress"
      );
    });

    // ==================================================
    // CUSTOMER INTELLIGENCE SCORE
    // ==================================================

    let score = 50;

    const customerStatus =
      normalize(customer.status);

    // Active customer
    if (customerStatus === "active") {
      score += 20;
    }

    // Lead customer
    if (customerStatus === "lead") {
      score += 10;
    }

    // Inactive customer
    if (customerStatus === "inactive") {
      score -= 35;
    }

    // Open deals
    if (openDeals.length > 0) {
      score += 15;
    }

    // More than one open deal
    if (openDeals.length >= 2) {
      score += 10;
    }

    // Deal value
    if (totalDealValue >= 100000) {
      score += 15;
    } else if (totalDealValue >= 50000) {
      score += 10;
    } else if (totalDealValue > 0) {
      score += 5;
    }

    // Completed tasks indicate engagement
    if (completedTasks.length > 0) {
      score += 5;
    }

    // Too many pending tasks increase risk
    if (pendingTasks.length >= 3) {
      score -= 15;
    } else if (pendingTasks.length >= 1) {
      score -= 5;
    }

    score = Math.max(
      0,
      Math.min(100, score)
    );

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

    if (
      deals.length > 0 &&
      openDeals.length === 0
    ) {
      riskScore += 20;
    }

    if (
      customerStatus === "lead" &&
      deals.length === 0
    ) {
      riskScore += 10;
    }

    riskScore = Math.min(
      100,
      riskScore
    );

    const risk =
      getRiskFromScore(riskScore);

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
    } else if (completedTasks.length > 0) {
      recommendedAction =
        "Continue engagement and look for the next sales opportunity.";
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
    console.error(
      "CUSTOMER INSIGHT ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to generate customer insight",
      error: error.message,
    });
  }
};

// ======================================================
// AI DEAL RISK ANALYSIS
// FREE LOCAL INTELLIGENCE ENGINE
// ======================================================

const getDealRisk = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { dealId } = req.body;

    if (!dealId) {
      return res.status(400).json({
        message: "Deal ID is required",
      });
    }

    // --------------------------------------------------
    // FIND DEAL
    // --------------------------------------------------

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

    // --------------------------------------------------
    // DEAL DATA
    // --------------------------------------------------

    const dealStatus =
      normalize(deal.status);

    const dealValue =
      Number(deal.value || 0);

    const customerStatus =
      normalize(
        deal.customer?.status
      );

    // ==================================================
    // WIN PROBABILITY
    // ==================================================

    let winProbability = 50;

    // Deal stage
    switch (dealStatus) {
      case "closed-won":
      case "won":
        winProbability = 100;
        break;

      case "closed-lost":
      case "lost":
        winProbability = 0;
        break;

      case "negotiation":
        winProbability = 70;
        break;

      case "proposal":
        winProbability = 65;
        break;

      case "qualified":
        winProbability = 55;
        break;

      case "prospecting":
        winProbability = 40;
        break;

      default:
        winProbability = 50;
    }

    // Customer status
    if (customerStatus === "active") {
      winProbability += 10;
    }

    if (customerStatus === "inactive") {
      winProbability -= 25;
    }

    // Deal value
    if (dealValue >= 100000) {
      winProbability += 5;
    }

    // Notes indicate additional engagement
    if (
      deal.notes &&
      String(deal.notes).trim().length > 0
    ) {
      winProbability += 5;
    }

    winProbability = Math.max(
      0,
      Math.min(
        100,
        Math.round(winProbability)
      )
    );

    // ==================================================
    // RISK
    // ==================================================

    let riskScore = 50;

    if (dealStatus === "negotiation") {
      riskScore -= 10;
    }

    if (dealStatus === "proposal") {
      riskScore -= 5;
    }

    if (dealStatus === "qualified") {
      riskScore -= 5;
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

    const risk =
      getRiskFromScore(riskScore);

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
    } else if (dealStatus === "proposal") {
      reason =
        "A proposal has been reached, but the customer still needs to progress toward a final decision.";
    } else if (dealStatus === "qualified") {
      reason =
        "The opportunity is qualified and has reasonable potential, but continued engagement is required.";
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

    if (risk === "High") {
      recommendation =
        "Contact the customer as soon as possible, identify blockers, and establish a clear next step.";
    } else if (dealStatus === "negotiation") {
      recommendation =
        "Focus on resolving remaining objections and move the negotiation toward a final decision.";
    } else if (dealStatus === "prospecting") {
      recommendation =
        "Qualify the opportunity further and identify the customer's specific business requirement.";
    } else if (dealStatus === "proposal") {
      recommendation =
        "Follow up on the proposal, address objections, and work toward a clear decision date.";
    } else if (risk === "Low") {
      recommendation =
        "Maintain regular follow-up and continue progressing the deal toward closure.";
    }

    // ==================================================
    // RESPONSE
    // ==================================================

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
    console.error(
      "DEAL RISK ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to analyze deal",
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
};