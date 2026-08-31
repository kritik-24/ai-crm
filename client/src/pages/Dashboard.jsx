import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

  // ================= LOAD DASHBOARD =================

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
      console.error("DASHBOARD ERROR:", error);

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

  // ================= FORMAT CURRENCY =================

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  // ================= PIPELINE =================

  const pipelineStages = [
    {
      name: "Prospecting",
      icon: "🔎",
      data: dealStats.pipeline.prospecting,
      color: "border-blue-200 bg-blue-50",
    },

    {
      name: "Negotiation",
      icon: "🤝",
      data: dealStats.pipeline.negotiation,
      color: "border-yellow-200 bg-yellow-50",
    },

    {
      name: "Won",
      icon: "🏆",
      data: dealStats.pipeline.won,
      color: "border-green-200 bg-green-50",
    },

    {
      name: "Lost",
      icon: "📉",
      data: dealStats.pipeline.lost,
      color: "border-red-200 bg-red-50",
    },
  ];

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="p-6 md:p-8">

        <div className="animate-pulse space-y-6">

          <div>
            <div className="h-8 w-64 bg-slate-200 rounded" />
            <div className="h-4 w-96 max-w-full bg-slate-200 rounded mt-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white rounded-2xl border border-slate-200 p-6"
              >
                <div className="h-4 w-24 bg-slate-200 rounded" />

                <div className="h-8 w-20 bg-slate-200 rounded mt-4" />

                <div className="h-3 w-32 bg-slate-200 rounded mt-4" />
              </div>
            ))}

          </div>

        </div>

      </div>
    );
  }

  // ================= UI =================

  return (
    <div className="p-5 md:p-8 max-w-[1600px] mx-auto">

      {/* HEADER */}

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-8">

        <div>

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl shadow-lg">
              📊
            </div>

            <div>

              <h1 className="text-3xl font-bold text-slate-900">
                CRM Overview
              </h1>

              <p className="text-slate-500 mt-1">
                Monitor your customers, deals and sales performance.
              </p>

            </div>

          </div>

        </div>


        {/* ACTION BUTTONS */}

        <div className="flex flex-col sm:flex-row gap-3">

          <button
            type="button"
            onClick={() =>
              navigate("/customers?action=create")
            }
            className="px-5 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-300 transition shadow-sm"
          >
            👥 Add Customer
          </button>


          <button
            type="button"
            onClick={() =>
              navigate("/deals?action=create")
            }
            className="px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            💼 Create Deal
          </button>


          <button
            type="button"
            onClick={loadDashboardData}
            className="px-5 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
          >
            ↻ Refresh
          </button>

        </div>

      </div>


      {/* ERROR */}

      {error && (

        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <p className="text-red-700">
              ⚠️ {error}
            </p>

            <button
              type="button"
              onClick={loadDashboardData}
              className="text-sm font-semibold text-red-700 hover:text-red-900"
            >
              Try Again
            </button>

          </div>

        </div>

      )}


      {/* CUSTOMER OVERVIEW */}

      <div className="mb-10">

        <div className="flex items-center justify-between mb-5">

          <div>

            <h2 className="text-xl font-bold text-slate-900">
              Customer Overview
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Current customer and lead distribution.
            </p>

          </div>

          <button
            type="button"
            onClick={() => navigate("/customers")}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View Customers →
          </button>

        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">


          {/* LEADS */}

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Total Leads
                </p>

                <p className="text-3xl font-bold text-slate-900 mt-3">
                  {customerStats.totalLeads}
                </p>

              </div>

              <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center text-2xl">
                🎯
              </div>

            </div>

            <p className="text-sm text-slate-400 mt-5">
              Potential opportunities
            </p>

          </div>


          {/* CUSTOMERS */}

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Customers
                </p>

                <p className="text-3xl font-bold text-slate-900 mt-3">
                  {customerStats.totalCustomers}
                </p>

              </div>

              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">
                👥
              </div>

            </div>

            <p className="text-sm text-slate-400 mt-5">
              Total customer records
            </p>

          </div>


          {/* ACTIVE */}

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Active Customers
                </p>

                <p className="text-3xl font-bold text-slate-900 mt-3">
                  {customerStats.activeCustomers}
                </p>

              </div>

              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-2xl">
                ✓
              </div>

            </div>

            <p className="text-sm text-green-600 mt-5 font-medium">
              Currently engaged
            </p>

          </div>


          {/* INACTIVE */}

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Inactive Customers
                </p>

                <p className="text-3xl font-bold text-slate-900 mt-3">
                  {customerStats.inactiveCustomers}
                </p>

              </div>

              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl">
                ⏸
              </div>

            </div>

            <p className="text-sm text-slate-400 mt-5">
              Require follow-up
            </p>

          </div>

        </div>

      </div>


      {/* SALES PERFORMANCE */}

      <div className="mb-10">

        <div className="flex items-center justify-between mb-5">

          <div>

            <h2 className="text-xl font-bold text-slate-900">
              Sales Performance
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Pipeline value and revenue forecast.
            </p>

          </div>

          <button
            type="button"
            onClick={() => navigate("/deals")}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View Deals →
          </button>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">


          {/* TOTAL PIPELINE */}

          <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 shadow-lg">

            <p className="text-sm text-blue-100">
              Total Pipeline
            </p>

            <p className="text-2xl font-bold mt-3">
              {formatCurrency(dealStats.totalPipelineValue)}
            </p>

            <div className="mt-6 pt-4 border-t border-blue-500">

              <p className="text-sm text-blue-100">
                {dealStats.pipelineDeals} open deals
              </p>

            </div>

          </div>


          {/* EXPECTED REVENUE */}

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

            <p className="text-sm font-medium text-slate-500">
              Expected Revenue
            </p>

            <p className="text-2xl font-bold text-slate-900 mt-3">
              {formatCurrency(dealStats.expectedRevenue)}
            </p>

            <p className="text-sm text-slate-400 mt-6">
              Based on deal probability
            </p>

          </div>


          {/* WEIGHTED PIPELINE */}

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

            <p className="text-sm font-medium text-slate-500">
              Weighted Pipeline
            </p>

            <p className="text-2xl font-bold text-slate-900 mt-3">
              {formatCurrency(dealStats.weightedPipeline)}
            </p>

            <p className="text-sm text-slate-400 mt-6">
              Forecasted pipeline value
            </p>

          </div>


          {/* WIN RATE */}

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

            <p className="text-sm font-medium text-slate-500">
              Win Rate
            </p>

            <p className="text-3xl font-bold text-green-600 mt-3">
              {dealStats.winRate}%
            </p>

            <p className="text-sm text-slate-400 mt-6">
              Won vs closed deals
            </p>

          </div>

        </div>

      </div>


      {/* DEAL HEALTH */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-10">


        {/* TOTAL DEALS */}

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Total Deals
              </p>

              <p className="text-4xl font-bold text-slate-900 mt-3">
                {dealStats.totalDeals}
              </p>

            </div>

            <div className="text-4xl">
              💼
            </div>

          </div>

        </div>


        {/* WON DEALS */}

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Won Deals
              </p>

              <p className="text-4xl font-bold text-green-600 mt-3">
                {dealStats.wonDeals}
              </p>

              <p className="text-sm text-slate-400 mt-3">
                {formatCurrency(dealStats.wonValue)}
              </p>

            </div>

            <div className="text-4xl">
              🏆
            </div>

          </div>

        </div>


        {/* HIGH RISK */}

        <div className="bg-white border border-red-100 rounded-2xl p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-slate-500">
                High Risk Deals
              </p>

              <p className="text-4xl font-bold text-red-600 mt-3">
                {dealStats.highRiskDeals}
              </p>

              <p className="text-sm text-red-500 mt-3">
                Require attention
              </p>

            </div>

            <div className="text-4xl">
              ⚠️
            </div>

          </div>

        </div>

      </div>


      {/* PIPELINE */}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-7">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">

          <div>

            <h2 className="text-xl font-bold text-slate-900">
              Pipeline by Stage
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Current distribution of your sales pipeline.
            </p>

          </div>

        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

          {pipelineStages.map((stage) => (

            <div
              key={stage.name}
              className={`border rounded-2xl p-5 ${stage.color}`}
            >

              <div className="flex items-center justify-between">

                <h3 className="font-bold text-slate-800">
                  {stage.name}
                </h3>

                <span className="text-xl">
                  {stage.icon}
                </span>

              </div>


              <p className="text-3xl font-bold text-slate-900 mt-5">
                {stage.data.count}
              </p>


              <p className="text-sm text-slate-500 mt-1">
                Deals
              </p>


              <div className="mt-5 pt-4 border-t border-slate-200">

                <p className="font-semibold text-slate-800">
                  {formatCurrency(stage.data.value)}
                </p>

                <p className="text-xs text-slate-500 mt-2">
                  Probability: {stage.data.probability}%
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>


      {/* QUICK ACTION */}

      <div className="mt-8 rounded-2xl bg-slate-900 p-6 md:p-8 text-white">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>

            <h2 className="text-2xl font-bold">
              Ready to grow your pipeline?
            </h2>

            <p className="text-slate-400 mt-2">
              Add a customer or create a new deal to continue building your CRM.
            </p>

          </div>


          <div className="flex flex-wrap gap-3">

            <button
              type="button"
              onClick={() =>
                navigate("/customers?action=create")
              }
              className="px-5 py-3 bg-white text-slate-900 rounded-xl font-semibold hover:bg-slate-100 transition"
            >
              + Add Customer
            </button>


            <button
              type="button"
              onClick={() =>
                navigate("/deals?action=create")
              }
              className="px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-500 transition"
            >
              + Create Deal
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;