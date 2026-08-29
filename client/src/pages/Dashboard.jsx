import { useEffect, useState } from "react";
import { getCustomerStats } from "../api/customer";
import { getDealStats } from "../api/deal";

function Dashboard() {
  const [customerStats, setCustomerStats] = useState({
    totalCustomers: 0,
    totalLeads: 0,
    activeCustomers: 0,
    inactiveCustomers: 0,
  });

  const [dealStats, setDealStats] = useState({
    totalDeals: 0,
    wonDeals: 0,
    lostDeals: 0,
    pipelineDeals: 0,
    totalPipelineValue: 0,
    expectedRevenue: 0,
    weightedPipeline: 0,
    highRiskDeals: 0,
    winRate: 0,
    wonValue: 0,
    lostValue: 0,

    pipeline: {
      prospecting: {
        count: 0,
        value: 0,
        probability: 40,
      },
      negotiation: {
        count: 0,
        value: 0,
        probability: 70,
      },
      won: {
        count: 0,
        value: 0,
        probability: 100,
      },
      lost: {
        count: 0,
        value: 0,
        probability: 0,
      },
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [customerData, dealData] = await Promise.all([
        getCustomerStats(),
        getDealStats(),
      ]);

      setCustomerStats({
        totalCustomers: customerData.totalCustomers ?? 0,
        totalLeads: customerData.totalLeads ?? 0,
        activeCustomers: customerData.activeCustomers ?? 0,
        inactiveCustomers: customerData.inactiveCustomers ?? 0,
      });

      setDealStats({
        totalDeals: dealData.totalDeals ?? 0,
        wonDeals: dealData.wonDeals ?? 0,
        lostDeals: dealData.lostDeals ?? 0,
        pipelineDeals: dealData.pipelineDeals ?? 0,
        totalPipelineValue: dealData.totalPipelineValue ?? 0,
        expectedRevenue: dealData.expectedRevenue ?? 0,
        weightedPipeline: dealData.weightedPipeline ?? 0,
        highRiskDeals: dealData.highRiskDeals ?? 0,
        winRate: dealData.winRate ?? 0,
        wonValue: dealData.wonValue ?? 0,
        lostValue: dealData.lostValue ?? 0,

        pipeline: {
          prospecting: {
            count: dealData.pipeline?.prospecting?.count ?? 0,
            value: dealData.pipeline?.prospecting?.value ?? 0,
            probability:
              dealData.pipeline?.prospecting?.probability ?? 40,
          },

          negotiation: {
            count: dealData.pipeline?.negotiation?.count ?? 0,
            value: dealData.pipeline?.negotiation?.value ?? 0,
            probability:
              dealData.pipeline?.negotiation?.probability ?? 70,
          },

          won: {
            count: dealData.pipeline?.won?.count ?? 0,
            value: dealData.pipeline?.won?.value ?? 0,
            probability:
              dealData.pipeline?.won?.probability ?? 100,
          },

          lost: {
            count: dealData.pipeline?.lost?.count ?? 0,
            value: dealData.pipeline?.lost?.value ?? 0,
            probability:
              dealData.pipeline?.lost?.probability ?? 0,
          },
        },
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load dashboard statistics"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const pipelineStages = [
    {
      name: "Prospecting",
      data: dealStats.pipeline.prospecting,
      description: "Early stage opportunities",
    },
    {
      name: "Negotiation",
      data: dealStats.pipeline.negotiation,
      description: "Deals being actively discussed",
    },
    {
      name: "Won",
      data: dealStats.pipeline.won,
      description: "Successfully closed deals",
    },
    {
      name: "Lost",
      data: dealStats.pipeline.lost,
      description: "Unsuccessful opportunities",
    },
  ];

  const statCards = [
    {
      title: "Total Leads",
      value: customerStats.totalLeads,
      subtitle: "Potential opportunities",
    },
    {
      title: "Customers",
      value: customerStats.totalCustomers,
      subtitle: "Total customer base",
    },
    {
      title: "Active Customers",
      value: customerStats.activeCustomers,
      subtitle: "Currently active",
    },
    {
      title: "Inactive Customers",
      value: customerStats.inactiveCustomers,
      subtitle: "Need re-engagement",
    },
  ];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            AI CRM Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Monitor customers, sales pipeline, and business performance.
          </p>
        </div>

        <button
          onClick={loadDashboardData}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
        >
          Refresh Data
        </button>

      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-6 flex items-center justify-between gap-4 px-5 py-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">

          <p>{error}</p>

          <button
            onClick={loadDashboardData}
            className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm"
          >
            Retry
          </button>

        </div>
      )}

      {/* CUSTOMER OVERVIEW */}

      <div className="mb-10">

        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Customer Overview
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Overview of your customer and lead database.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {statCards.map((card) => (
            <div
              key={card.title}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="text-sm font-medium text-gray-500">
                {card.title}
              </p>

              <p className="text-3xl font-bold text-gray-900 mt-3">
                {loading ? "..." : card.value}
              </p>

              <p className="text-sm text-gray-400 mt-3">
                {card.subtitle}
              </p>
            </div>
          ))}

        </div>

      </div>

      {/* SALES FORECAST */}

      <div className="mb-10">

        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Sales Forecast & Pipeline Intelligence
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Track your pipeline and estimate potential revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">

            <p className="text-sm font-medium text-gray-500">
              Total Pipeline
            </p>

            <p className="text-2xl font-bold text-gray-900 mt-3">
              {loading
                ? "..."
                : formatCurrency(dealStats.totalPipelineValue)}
            </p>

            <p className="text-sm text-gray-400 mt-3">
              {dealStats.pipelineDeals} open deals
            </p>

          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">

            <p className="text-sm font-medium text-gray-500">
              Expected Revenue
            </p>

            <p className="text-2xl font-bold text-gray-900 mt-3">
              {loading
                ? "..."
                : formatCurrency(dealStats.expectedRevenue)}
            </p>

            <p className="text-sm text-gray-400 mt-3">
              Probability-based forecast
            </p>

          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">

            <p className="text-sm font-medium text-gray-500">
              Weighted Pipeline
            </p>

            <p className="text-2xl font-bold text-gray-900 mt-3">
              {loading
                ? "..."
                : formatCurrency(dealStats.weightedPipeline)}
            </p>

            <p className="text-sm text-gray-400 mt-3">
              Forecasted open pipeline
            </p>

          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">

            <p className="text-sm font-medium text-gray-500">
              Win Rate
            </p>

            <p className="text-3xl font-bold text-gray-900 mt-3">
              {loading ? "..." : `${dealStats.winRate}%`}
            </p>

            <p className="text-sm text-gray-400 mt-3">
              Won compared with closed deals
            </p>

          </div>

        </div>

      </div>

      {/* DEAL HEALTH */}

      <div className="mb-10">

        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Deal Health
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">

            <p className="text-gray-500">
              Total Deals
            </p>

            <p className="text-3xl font-bold text-gray-900 mt-3">
              {loading ? "..." : dealStats.totalDeals}
            </p>

            <p className="text-sm text-gray-400 mt-3">
              All opportunities
            </p>

          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">

            <p className="text-gray-500">
              Won Revenue
            </p>

            <p className="text-3xl font-bold text-gray-900 mt-3">
              {loading
                ? "..."
                : formatCurrency(dealStats.wonValue)}
            </p>

            <p className="text-sm text-gray-400 mt-3">
              {dealStats.wonDeals} successfully closed deals
            </p>

          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">

            <p className="text-gray-500">
              High Risk Deals
            </p>

            <p className="text-3xl font-bold text-gray-900 mt-3">
              {loading ? "..." : dealStats.highRiskDeals}
            </p>

            <p className="text-sm text-gray-400 mt-3">
              Deals requiring attention
            </p>

          </div>

        </div>

      </div>

      {/* PIPELINE STAGES */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

        <div className="mb-6">

          <h2 className="text-xl font-semibold text-gray-900">
            Pipeline by Stage
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Distribution of opportunities across your sales pipeline.
          </p>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {pipelineStages.map((stage) => (
            <div
              key={stage.name}
              className="border border-gray-200 rounded-xl p-5 hover:shadow-sm transition"
            >

              <h3 className="font-semibold text-gray-900">
                {stage.name}
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                {stage.description}
              </p>

              <div className="mt-5">

                <p className="text-sm text-gray-500">
                  Deals
                </p>

                <p className="text-2xl font-bold text-gray-900">
                  {loading ? "..." : stage.data.count}
                </p>

              </div>

              <div className="mt-4">

                <p className="text-sm text-gray-500">
                  Total Value
                </p>

                <p className="font-semibold text-gray-900">
                  {loading
                    ? "..."
                    : formatCurrency(stage.data.value)}
                </p>

              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">

                <p className="text-sm text-gray-500">
                  Conversion Probability
                </p>

                <p className="font-semibold text-gray-900 mt-1">
                  {stage.data.probability}%
                </p>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;