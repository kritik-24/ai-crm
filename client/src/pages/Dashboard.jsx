import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getCustomerStats } from "../api/customer";
import { getDealStats } from "../api/deal";

function Dashboard() {
  const navigate = useNavigate();

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [customerData, dealData] = await Promise.all([
          getCustomerStats(),
          getDealStats(),
        ]);

        console.log(
          "CUSTOMER STATS:",
          JSON.stringify(customerData, null, 2)
        );

        console.log(
          "DEAL STATS:",
          JSON.stringify(dealData, null, 2)
        );

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
    },
    {
      name: "Negotiation",
      data: dealStats.pipeline.negotiation,
    },
    {
      name: "Won",
      data: dealStats.pipeline.won,
    },
    {
      name: "Lost",
      data: dealStats.pipeline.lost,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">

      {/* NAVIGATION BAR */}
      <nav className="bg-gray-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between min-h-16 flex-wrap gap-3">

            <div className="font-bold text-xl">
              AI CRM
            </div>

            <div className="flex flex-wrap gap-2 items-center">

              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `px-3 py-2 rounded ${
                    isActive
                      ? "bg-gray-700"
                      : "hover:bg-gray-700"
                  }`
                }
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/customers"
                className={({ isActive }) =>
                  `px-3 py-2 rounded ${
                    isActive
                      ? "bg-gray-700"
                      : "hover:bg-gray-700"
                  }`
                }
              >
                Customers
              </NavLink>

              <NavLink
                to="/deals"
                className={({ isActive }) =>
                  `px-3 py-2 rounded ${
                    isActive
                      ? "bg-gray-700"
                      : "hover:bg-gray-700"
                  }`
                }
              >
                Deals
              </NavLink>

              <NavLink
                to="/tasks"
                className={({ isActive }) =>
                  `px-3 py-2 rounded ${
                    isActive
                      ? "bg-gray-700"
                      : "hover:bg-gray-700"
                  }`
                }
              >
                Tasks
              </NavLink>

              <NavLink
                to="/leads"
                className={({ isActive }) =>
                  `px-3 py-2 rounded ${
                    isActive
                      ? "bg-gray-700"
                      : "hover:bg-gray-700"
                  }`
                }
              >
                Leads
              </NavLink>

              <NavLink
                to="/analytics"
                className={({ isActive }) =>
                  `px-3 py-2 rounded ${
                    isActive
                      ? "bg-gray-700"
                      : "hover:bg-gray-700"
                  }`
                }
              >
                Analytics
              </NavLink>

              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded bg-red-600 hover:bg-red-700"
              >
                Logout
              </button>

            </div>
          </div>
        </div>
      </nav>

      {/* DASHBOARD CONTENT */}
      <div className="p-6 max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            AI CRM Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Monitor customers, sales pipeline, and forecast performance.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 px-4 py-3 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* CUSTOMER STATISTICS */}
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Customer Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500 font-medium">
              Total Leads
            </p>

            <p className="text-3xl font-bold text-gray-900 mt-2">
              {loading ? "..." : customerStats.totalLeads}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500 font-medium">
              Customers
            </p>

            <p className="text-3xl font-bold text-gray-900 mt-2">
              {loading ? "..." : customerStats.totalCustomers}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500 font-medium">
              Active Customers
            </p>

            <p className="text-3xl font-bold text-gray-900 mt-2">
              {loading ? "..." : customerStats.activeCustomers}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500 font-medium">
              Inactive Customers
            </p>

            <p className="text-3xl font-bold text-gray-900 mt-2">
              {loading ? "..." : customerStats.inactiveCustomers}
            </p>
          </div>
        </div>

        {/* SALES FORECAST */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Sales Forecast & Pipeline Intelligence
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-500 font-medium">
                Total Pipeline
              </p>

              <p className="text-2xl font-bold text-gray-900 mt-2">
                {loading
                  ? "..."
                  : formatCurrency(dealStats.totalPipelineValue)}
              </p>

              <p className="text-sm text-gray-400 mt-2">
                {dealStats.pipelineDeals} open deals
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-500 font-medium">
                Expected Revenue
              </p>

              <p className="text-2xl font-bold text-gray-900 mt-2">
                {loading
                  ? "..."
                  : formatCurrency(dealStats.expectedRevenue)}
              </p>

              <p className="text-sm text-gray-400 mt-2">
                Based on deal probability
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-500 font-medium">
                Weighted Pipeline
              </p>

              <p className="text-2xl font-bold text-gray-900 mt-2">
                {loading
                  ? "..."
                  : formatCurrency(dealStats.weightedPipeline)}
              </p>

              <p className="text-sm text-gray-400 mt-2">
                Forecasted open pipeline
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-500 font-medium">
                Win Rate
              </p>

              <p className="text-3xl font-bold text-gray-900 mt-2">
                {loading ? "..." : `${dealStats.winRate}%`}
              </p>

              <p className="text-sm text-gray-400 mt-2">
                Won vs closed deals
              </p>
            </div>

          </div>
        </div>

        {/* DEAL HEALTH */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Deal Health
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-500">
                Total Deals
              </p>

              <p className="text-3xl font-bold mt-2">
                {loading ? "..." : dealStats.totalDeals}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-500">
                Won Deals
              </p>

              <p className="text-3xl font-bold mt-2">
                {loading ? "..." : dealStats.wonDeals}
              </p>

              <p className="text-sm text-gray-400 mt-2">
                {formatCurrency(dealStats.wonValue)}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-500">
                High Risk Deals
              </p>

              <p className="text-3xl font-bold mt-2">
                {loading ? "..." : dealStats.highRiskDeals}
              </p>

              <p className="text-sm text-gray-400 mt-2">
                Need attention
              </p>
            </div>

          </div>
        </div>

        {/* PIPELINE STAGES */}
        <div className="mt-10 bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Pipeline by Stage
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

            {pipelineStages.map((stage) => (
              <div
                key={stage.name}
                className="border rounded-xl p-5"
              >
                <h3 className="font-semibold text-gray-900">
                  {stage.name}
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  Deals: {stage.data.count}
                </p>

                <p className="text-lg font-bold text-gray-900 mt-2">
                  {formatCurrency(stage.data.value)}
                </p>

                <p className="text-sm text-gray-400 mt-1">
                  Probability: {stage.data.probability}%
                </p>
              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;