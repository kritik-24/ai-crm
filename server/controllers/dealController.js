const Deal = require("../models/Deal");
const Customer = require("../models/Customer");

// ======================================================
// HELPER FUNCTIONS
// ======================================================

const getTotalValue = (dealList) => {
  return dealList.reduce(
    (total, deal) => total + Number(deal.value || 0),
    0
  );
};

const getDaysSince = (date) => {
  const today = new Date();
  const targetDate = new Date(date);

  const difference =
    today.getTime() - targetDate.getTime();

  return Math.floor(
    difference / (1000 * 60 * 60 * 24)
  );
};

// ======================================================
// CREATE DEAL
// ======================================================

const createDeal = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    const {
      title,
      value,
      status,
      customer,
      notes,
    } = req.body;

    if (!title || value === undefined || !customer) {
      return res.status(400).json({
        message:
          "Title, value and customer are required",
      });
    }

    // Check customer belongs to logged-in user
    const existingCustomer = await Customer.findOne({
      _id: customer,
      createdBy: userId,
    });

    if (!existingCustomer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    const deal = await Deal.create({
      title,
      value: Number(value),
      status: status || "prospecting",
      customer,
      notes: notes || "",
      createdBy: userId,
    });

    const populatedDeal =
      await Deal.findById(deal._id).populate(
        "customer",
        "name email company status"
      );

    res.status(201).json({
      message: "Deal created successfully",
      deal: populatedDeal,
    });
  } catch (error) {
    console.error("CREATE DEAL ERROR:", error);

    res.status(500).json({
      message: "Failed to create deal",
      error: error.message,
    });
  }
};

// ======================================================
// GET ALL DEALS
// ======================================================

const getDeals = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    const deals = await Deal.find({
      createdBy: userId,
    })
      .populate(
        "customer",
        "name email company status"
      )
      .sort({ createdAt: -1 });

    res.status(200).json(deals);
  } catch (error) {
    console.error("GET DEALS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch deals",
      error: error.message,
    });
  }
};

// ======================================================
// UPDATE DEAL
// ======================================================

const updateDeal = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    const {
      title,
      value,
      status,
      customer,
      notes,
    } = req.body;

    // Check deal exists and belongs to user
    const existingDeal = await Deal.findOne({
      _id: req.params.id,
      createdBy: userId,
    });

    if (!existingDeal) {
      return res.status(404).json({
        message: "Deal not found",
      });
    }

    // If customer is being changed, verify ownership
    if (customer) {
      const existingCustomer =
        await Customer.findOne({
          _id: customer,
          createdBy: userId,
        });

      if (!existingCustomer) {
        return res.status(404).json({
          message: "Customer not found",
        });
      }
    }

    const updateData = {};

    if (title !== undefined) {
      updateData.title = title;
    }

    if (value !== undefined) {
      updateData.value = Number(value);
    }

    if (status !== undefined) {
      updateData.status = status;
    }

    if (customer !== undefined) {
      updateData.customer = customer;
    }

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const deal = await Deal.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: userId,
      },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate(
      "customer",
      "name email company status"
    );

    res.status(200).json({
      message: "Deal updated successfully",
      deal,
    });
  } catch (error) {
    console.error("UPDATE DEAL ERROR:", error);

    res.status(500).json({
      message: "Failed to update deal",
      error: error.message,
    });
  }
};

// ======================================================
// DELETE DEAL
// ======================================================

const deleteDeal = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    const deal = await Deal.findOneAndDelete({
      _id: req.params.id,
      createdBy: userId,
    });

    if (!deal) {
      return res.status(404).json({
        message: "Deal not found",
      });
    }

    res.status(200).json({
      message: "Deal deleted successfully",
    });
  } catch (error) {
    console.error("DELETE DEAL ERROR:", error);

    res.status(500).json({
      message: "Failed to delete deal",
      error: error.message,
    });
  }
};

// ======================================================
// DEAL STATISTICS + SALES FORECAST
// ======================================================

const getDealStats = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    const deals = await Deal.find({
      createdBy: userId,
    });

    const wonDeals = deals.filter(
      (deal) => deal.status === "won"
    );

    const lostDeals = deals.filter(
      (deal) => deal.status === "lost"
    );

    const prospectingDeals = deals.filter(
      (deal) => deal.status === "prospecting"
    );

    const negotiationDeals = deals.filter(
      (deal) => deal.status === "negotiation"
    );

    const pipelineDeals = deals.filter(
      (deal) =>
        deal.status === "prospecting" ||
        deal.status === "negotiation"
    );

    // --------------------------------------------------
    // VALUES
    // --------------------------------------------------

    const totalPipelineValue =
      getTotalValue(pipelineDeals);

    const wonValue =
      getTotalValue(wonDeals);

    const lostValue =
      getTotalValue(lostDeals);

    const prospectingValue =
      getTotalValue(prospectingDeals);

    const negotiationValue =
      getTotalValue(negotiationDeals);

    // --------------------------------------------------
    // FORECAST PROBABILITIES
    // --------------------------------------------------

    const stageProbabilities = {
      prospecting: 0.4,
      negotiation: 0.7,
      won: 1,
      lost: 0,
    };

    const expectedRevenue = deals.reduce(
      (total, deal) => {
        const probability =
          stageProbabilities[deal.status] || 0;

        return (
          total +
          Number(deal.value || 0) *
            probability
        );
      },
      0
    );

    const weightedPipeline =
      pipelineDeals.reduce(
        (total, deal) => {
          const probability =
            stageProbabilities[deal.status] || 0;

          return (
            total +
            Number(deal.value || 0) *
              probability
          );
        },
        0
      );

    // --------------------------------------------------
    // HIGH RISK DEALS
    // --------------------------------------------------

    const highRiskDeals =
      pipelineDeals.filter((deal) => {
        const noNotes =
          !deal.notes ||
          deal.notes.trim().length === 0;

        const oldDeal =
          getDaysSince(deal.updatedAt) > 30;

        return noNotes || oldDeal;
      });

    // --------------------------------------------------
    // WIN RATE
    // --------------------------------------------------

    const closedDeals =
      wonDeals.length + lostDeals.length;

    const winRate =
      closedDeals > 0
        ? Math.round(
            (wonDeals.length /
              closedDeals) *
              100
          )
        : 0;

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    res.status(200).json({
      totalDeals: deals.length,

      wonDeals: wonDeals.length,

      lostDeals: lostDeals.length,

      pipelineDeals: pipelineDeals.length,

      totalPipelineValue,

      expectedRevenue:
        Math.round(expectedRevenue),

      weightedPipeline:
        Math.round(weightedPipeline),

      highRiskDeals:
        highRiskDeals.length,

      winRate,

      wonValue,

      lostValue,

      pipeline: {
        prospecting: {
          count: prospectingDeals.length,
          value: prospectingValue,
          probability: 40,
        },

        negotiation: {
          count: negotiationDeals.length,
          value: negotiationValue,
          probability: 70,
        },

        won: {
          count: wonDeals.length,
          value: wonValue,
          probability: 100,
        },

        lost: {
          count: lostDeals.length,
          value: lostValue,
          probability: 0,
        },
      },
    });
  } catch (error) {
    console.error("DEAL STATS ERROR:", error);

    res.status(500).json({
      message:
        "Failed to fetch sales forecast",
      error: error.message,
    });
  }
};

// ======================================================
// SALES INTELLIGENCE
// FREE RULE-BASED AI-LIKE ANALYSIS
// ======================================================

const getSalesIntelligence = async (
  req,
  res
) => {
  try {
    const userId =
      req.user.userId || req.user.id;

    const deals = await Deal.find({
      createdBy: userId,
    })
      .populate(
        "customer",
        "name email company status"
      )
      .sort({ updatedAt: 1 });

    const intelligence = deals.map(
      (deal) => {
        let riskScore = 0;
        const reasons = [];
        const recommendations = [];

        // ----------------------------------------------
        // STATUS RISK
        // ----------------------------------------------

        if (
          deal.status === "prospecting"
        ) {
          riskScore += 25;

          reasons.push(
            "Deal is still in the prospecting stage"
          );

          recommendations.push(
            "Contact the prospect and qualify their requirements"
          );
        }

        if (
          deal.status === "negotiation"
        ) {
          riskScore += 10;

          recommendations.push(
            "Follow up and identify any remaining objections"
          );
        }

        // ----------------------------------------------
        // NOTES
        // ----------------------------------------------

        if (
          !deal.notes ||
          deal.notes.trim().length === 0
        ) {
          riskScore += 30;

          reasons.push(
            "No deal notes or recent context available"
          );

          recommendations.push(
            "Add interaction notes and define the next step"
          );
        }

        // ----------------------------------------------
        // INACTIVITY
        // ----------------------------------------------

        const daysInactive =
          getDaysSince(deal.updatedAt);

        if (daysInactive > 30) {
          riskScore += 35;

          reasons.push(
            `No update for ${daysInactive} days`
          );

          recommendations.push(
            "Reconnect with the customer immediately"
          );
        } else if (daysInactive > 14) {
          riskScore += 20;

          reasons.push(
            `No update for ${daysInactive} days`
          );

          recommendations.push(
            "Schedule a follow-up"
          );
        }

        // ----------------------------------------------
        // FINAL RISK
        // ----------------------------------------------

        let risk = "Low";

        if (riskScore >= 60) {
          risk = "High";
        } else if (riskScore >= 30) {
          risk = "Medium";
        }

        // ----------------------------------------------
        // WIN PROBABILITY
        // ----------------------------------------------

        let winProbability = 50;

        if (deal.status === "prospecting") {
          winProbability = 40;
        }

        if (deal.status === "negotiation") {
          winProbability = 70;
        }

        if (deal.status === "won") {
          winProbability = 100;
        }

        if (deal.status === "lost") {
          winProbability = 0;
        }

        // Reduce probability based on risk
        if (
          risk === "High" &&
          winProbability > 0
        ) {
          winProbability -= 20;
        }

        if (
          risk === "Medium" &&
          winProbability > 0
        ) {
          winProbability -= 10;
        }

        winProbability = Math.max(
          0,
          Math.min(100, winProbability)
        );

        return {
          dealId: deal._id,

          title: deal.title,

          value: deal.value,

          status: deal.status,

          customer: deal.customer
            ? {
                name:
                  deal.customer.name,
                company:
                  deal.customer.company,
              }
            : null,

          risk,

          riskScore,

          winProbability,

          daysInactive,

          reasons,

          recommendation:
            recommendations.length > 0
              ? recommendations[0]
              : "Continue monitoring the deal progress",
        };
      }
    );

    // ----------------------------------------------
    // SUMMARY
    // ----------------------------------------------

    const highRisk =
      intelligence.filter(
        (deal) => deal.risk === "High"
      );

    const mediumRisk =
      intelligence.filter(
        (deal) => deal.risk === "Medium"
      );

    const lowRisk =
      intelligence.filter(
        (deal) => deal.risk === "Low"
      );

    const bestOpportunities =
      [...intelligence]
        .filter(
          (deal) =>
            deal.status !== "won" &&
            deal.status !== "lost"
        )
        .sort(
          (a, b) =>
            b.winProbability -
            a.winProbability
        )
        .slice(0, 5);

    res.status(200).json({
      summary: {
        totalDeals:
          intelligence.length,

        highRiskDeals:
          highRisk.length,

        mediumRiskDeals:
          mediumRisk.length,

        lowRiskDeals:
          lowRisk.length,
      },

      highRiskDeals: highRisk,

      bestOpportunities,

      intelligence,
    });
  } catch (error) {
    console.error(
      "SALES INTELLIGENCE ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to generate sales intelligence",
      error: error.message,
    });
  }
};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  createDeal,
  getDeals,
  updateDeal,
  deleteDeal,
  getDealStats,
  getSalesIntelligence,
};