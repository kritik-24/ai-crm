import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { getCustomerStats } from "../api/customer";
import { getDealStats } from "../api/deal";
import { getTaskStats } from "../api/task";

const Analytics = () => {
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

  const [taskStats, setTaskStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // ============================================
  // LOAD ANALYTICS
  // ============================================

  const loadAnalytics = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const [customers, deals, tasks] = await Promise.all([
        getCustomerStats(),
        getDealStats(),
        getTaskStats(),
      ]);

      setCustomerStats({
        totalCustomers: customers?.totalCustomers || 0,
        totalLeads: customers?.totalLeads || 0,
        activeCustomers: customers?.activeCustomers || 0,
        inactiveCustomers: customers?.inactiveCustomers || 0,
      });

      setDealStats((prev) => ({
        ...prev,
        ...deals,

        pipeline: {
          ...prev.pipeline,
          ...(deals?.pipeline || {}),
        },
      }));

      setTaskStats({
        totalTasks: tasks?.totalTasks || 0,
        pendingTasks: tasks?.pendingTasks || 0,
        inProgressTasks: tasks?.inProgressTasks || 0,
        completedTasks: tasks?.completedTasks || 0,
      });
    } catch (error) {
      console.error("Failed to load analytics:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load analytics data. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  // ============================================
  // HELPERS
  // ============================================

  const currency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

  const taskCompletionRate =
    taskStats.totalTasks > 0
      ? Math.round(
          (taskStats.completedTasks / taskStats.totalTasks) * 100
        )
      : 0;

  const activeCustomerRate =
    customerStats.totalCustomers > 0
      ? Math.round(
          (customerStats.activeCustomers /
            customerStats.totalCustomers) *
            100
        )
      : 0;

  // ============================================
  // CHART DATA
  // ============================================

  const dealStageChartData = [
    {
      name: "Prospecting",
      deals: dealStats.pipeline?.prospecting?.count || 0,
      value: dealStats.pipeline?.prospecting?.value || 0,
    },

    {
      name: "Negotiation",
      deals: dealStats.pipeline?.negotiation?.count || 0,
      value: dealStats.pipeline?.negotiation?.value || 0,
    },

    {
      name: "Won",
      deals: dealStats.pipeline?.won?.count || 0,
      value: dealStats.pipeline?.won?.value || 0,
    },

    {
      name: "Lost",
      deals: dealStats.pipeline?.lost?.count || 0,
      value: dealStats.pipeline?.lost?.value || 0,
    },
  ];

  const taskChartData = [
    {
      name: "Pending",
      value: taskStats.pendingTasks || 0,
    },

    {
      name: "In Progress",
      value: taskStats.inProgressTasks || 0,
    },

    {
      name: "Completed",
      value: taskStats.completedTasks || 0,
    },
  ];

  const customerChartData = [
    {
      name: "Leads",
      value: customerStats.totalLeads || 0,
    },

    {
      name: "Active",
      value: customerStats.activeCustomers || 0,
    },

    {
      name: "Inactive",
      value: customerStats.inactiveCustomers || 0,
    },
  ];

  const dealStages = [
    {
      name: "Prospecting",
      icon: "🔎",
      color: "border-violet-200 bg-violet-50",
      data: dealStats.pipeline?.prospecting || {},
      probability: 40,
    },

    {
      name: "Negotiation",
      icon: "🤝",
      color: "border-blue-200 bg-blue-50",
      data: dealStats.pipeline?.negotiation || {},
      probability: 70,
    },

    {
      name: "Won",
      icon: "🏆",
      color: "border-emerald-200 bg-emerald-50",
      data: dealStats.pipeline?.won || {},
      probability: 100,
    },

    {
      name: "Lost",
      icon: "📉",
      color: "border-red-200 bg-red-50",
      data: dealStats.pipeline?.lost || {},
      probability: 0,
    },
  ];

  const TASK_COLORS = [
    "#f59e0b",
    "#3b82f6",
    "#22c55e",
  ];

  const CUSTOMER_COLORS = [
    "#8b5cf6",
    "#22c55e",
    "#94a3b8",
  ];

  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="animate-pulse">

          <div className="h-8 w-72 bg-slate-200 rounded-xl" />

          <div className="h-4 w-96 max-w-full bg-slate-100 rounded-lg mt-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-10">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-36 rounded-2xl bg-white border border-slate-200"
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <div className="h-96 bg-white border border-slate-200 rounded-2xl" />
            <div className="h-96 bg-white border border-slate-200 rounded-2xl" />
          </div>

        </div>
      </div>
    );
  }

  // ============================================
  // MAIN UI
  // ============================================

  return (
    <div className="min-h-full bg-slate-50 p-4 md:p-6 lg:p-8">

      <div className="max-w-7xl mx-auto">

        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

          <div>
            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-2xl shadow-lg shadow-blue-200">
                📊
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                  Analytics
                </h1>

                <p className="text-sm text-slate-500 mt-1">
                  Business performance and sales intelligence
                </p>
              </div>

            </div>
          </div>

          <button
            onClick={() => loadAnalytics(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition disabled:opacity-60"
          >
            <span className={refreshing ? "animate-spin" : ""}>
              ↻
            </span>

            {refreshing ? "Refreshing..." : "Refresh Analytics"}
          </button>

        </div>

        {/* ========================================= */}
        {/* ERROR */}
        {/* ========================================= */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 flex items-center gap-3">

            <span className="text-xl">
              ⚠️
            </span>

            <div>
              <p className="font-semibold text-red-800">
                Analytics unavailable
              </p>

              <p className="text-sm text-red-600 mt-1">
                {error}
              </p>
            </div>

          </div>
        )}

        {/* ========================================= */}
        {/* PRIMARY KPI CARDS */}
        {/* ========================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-blue-100">
                  Total Pipeline
                </p>

                <h2 className="text-2xl font-bold mt-3">
                  {currency(dealStats.totalPipelineValue)}
                </h2>
              </div>

              <span className="text-2xl">
                💼
              </span>

            </div>

            <p className="text-xs text-blue-100 mt-6">
              Current value across all deals
            </p>

          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Expected Revenue
                </p>

                <h2 className="text-2xl font-bold text-slate-900 mt-3">
                  {currency(dealStats.expectedRevenue)}
                </h2>
              </div>

              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-xl">
                💰
              </div>

            </div>

            <p className="text-xs text-slate-400 mt-6">
              Forecasted revenue
            </p>

          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Weighted Pipeline
                </p>

                <h2 className="text-2xl font-bold text-slate-900 mt-3">
                  {currency(dealStats.weightedPipeline)}
                </h2>
              </div>

              <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center text-xl">
                ⚡
              </div>

            </div>

            <p className="text-xs text-slate-400 mt-6">
              Probability-adjusted pipeline
            </p>

          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">

            <div className="flex items-start justify-between">

              <div>
                <p className="text-sm text-slate-500">
                  Win Rate
                </p>

                <h2 className="text-2xl font-bold text-slate-900 mt-3">
                  {dealStats.winRate || 0}%
                </h2>
              </div>

              <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center text-xl">
                🏆
              </div>

            </div>

            <div className="mt-6 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(
                    Math.max(dealStats.winRate || 0, 0),
                    100
                  )}%`,
                }}
              />
            </div>

          </div>

        </div>

        {/* ========================================= */}
        {/* CHARTS */}
        {/* ========================================= */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

          {/* DEAL PIPELINE */}

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 md:p-6">

            <div className="flex items-center justify-between mb-6">

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Sales Pipeline
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Deal distribution across stages
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                📈
              </div>

            </div>

            <ResponsiveContainer width="100%" height={330}>
              <BarChart data={dealStageChartData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12 }}
                />

                <Tooltip />

                <Bar
                  dataKey="deals"
                  name="Deals"
                  fill="#7c3aed"
                  radius={[8, 8, 0, 0]}
                />

              </BarChart>
            </ResponsiveContainer>

          </div>

          {/* TASK DISTRIBUTION */}

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 md:p-6">

            <div className="flex items-center justify-between mb-6">

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Task Performance
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Current task status distribution
                </p>
              </div>

              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                ✅
              </div>

            </div>

            {taskStats.totalTasks > 0 ? (

              <ResponsiveContainer width="100%" height={330}>
                <PieChart>

                  <Pie
                    data={taskChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={115}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {taskChartData.map((entry, index) => (
                      <Cell
                        key={`task-${index}`}
                        fill={
                          TASK_COLORS[
                            index % TASK_COLORS.length
                          ]
                        }
                      />
                    ))}
                  </Pie>

                  <Tooltip />

                  <Legend />

                </PieChart>
              </ResponsiveContainer>

            ) : (

              <div className="h-[330px] flex flex-col items-center justify-center text-center">

                <div className="text-5xl mb-4">
                  📋
                </div>

                <p className="font-medium text-slate-700">
                  No tasks yet
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  Task analytics will appear here.
                </p>

              </div>

            )}

          </div>

        </div>

        {/* ========================================= */}
        {/* PIPELINE STAGES */}
        {/* ========================================= */}

        <div className="mt-8">

          <div className="mb-5">

            <h2 className="text-xl font-bold text-slate-900">
              Pipeline Performance
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Track deal movement and value at every stage
            </p>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

            {dealStages.map((stage) => {

              const count = stage.data?.count || 0;

              const value = stage.data?.value || 0;

              const probability =
                stage.data?.probability ??
                stage.probability;

              return (

                <div
                  key={stage.name}
                  className={`border rounded-2xl p-5 ${stage.color}`}
                >

                  <div className="flex items-center justify-between">

                    <span className="text-2xl">
                      {stage.icon}
                    </span>

                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/70 text-slate-700">
                      {probability}% probability
                    </span>

                  </div>

                  <h3 className="font-bold text-slate-900 mt-5">
                    {stage.name}
                  </h3>

                  <div className="flex items-end justify-between mt-4">

                    <div>
                      <p className="text-xs text-slate-500">
                        Deals
                      </p>

                      <p className="text-2xl font-bold text-slate-900">
                        {count}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-slate-500">
                        Value
                      </p>

                      <p className="text-sm font-bold text-slate-900">
                        {currency(value)}
                      </p>
                    </div>

                  </div>

                </div>

              );
            })}

          </div>

        </div>

        {/* ========================================= */}
        {/* CUSTOMER + PIPELINE VALUE */}
        {/* ========================================= */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

          {/* CUSTOMER DISTRIBUTION */}

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 md:p-6">

            <div className="mb-6">

              <h2 className="text-lg font-bold text-slate-900">
                Customer Health
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Overview of customer and lead distribution
              </p>

            </div>

            {customerStats.totalCustomers > 0 ? (

              <ResponsiveContainer width="100%" height={330}>
                <PieChart>

                  <Pie
                    data={customerChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={115}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {customerChartData.map((entry, index) => (
                      <Cell
                        key={`customer-${index}`}
                        fill={
                          CUSTOMER_COLORS[
                            index % CUSTOMER_COLORS.length
                          ]
                        }
                      />
                    ))}
                  </Pie>

                  <Tooltip />

                  <Legend />

                </PieChart>
              </ResponsiveContainer>

            ) : (

              <div className="h-[330px] flex flex-col items-center justify-center">

                <div className="text-5xl mb-4">
                  👥
                </div>

                <p className="font-medium text-slate-700">
                  No customer data
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  Add customers to view insights.
                </p>

              </div>

            )}

          </div>

          {/* PIPELINE VALUE */}

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 md:p-6">

            <div className="mb-6">

              <h2 className="text-lg font-bold text-slate-900">
                Pipeline Value
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Revenue value across sales stages
              </p>

            </div>

            <ResponsiveContainer width="100%" height={330}>
              <BarChart data={dealStageChartData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                />

                <YAxis
                  tick={{ fontSize: 12 }}
                />

                <Tooltip
                  formatter={(value) => currency(value)}
                />

                <Bar
                  dataKey="value"
                  name="Pipeline Value"
                  fill="#10b981"
                  radius={[8, 8, 0, 0]}
                />

              </BarChart>
            </ResponsiveContainer>

          </div>

        </div>

        {/* ========================================= */}
        {/* BUSINESS HEALTH */}
        {/* ========================================= */}

        <div className="mt-8">

          <div className="mb-5">

            <h2 className="text-xl font-bold text-slate-900">
              Business Health
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Quick overview of customers, deals and productivity
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

              <div className="flex justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    Total Customers
                  </p>

                  <p className="text-3xl font-bold text-slate-900 mt-3">
                    {customerStats.totalCustomers || 0}
                  </p>
                </div>

                <span className="text-2xl">
                  👥
                </span>

              </div>

              <p className="text-xs text-slate-400 mt-5">
                {activeCustomerRate}% currently active
              </p>

            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

              <div className="flex justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    Total Deals
                  </p>

                  <p className="text-3xl font-bold text-slate-900 mt-3">
                    {dealStats.totalDeals || 0}
                  </p>
                </div>

                <span className="text-2xl">
                  💼
                </span>

              </div>

              <p className="text-xs text-slate-400 mt-5">
                {dealStats.pipelineDeals || 0} active in pipeline
              </p>

            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

              <div className="flex justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    Total Tasks
                  </p>

                  <p className="text-3xl font-bold text-slate-900 mt-3">
                    {taskStats.totalTasks || 0}
                  </p>
                </div>

                <span className="text-2xl">
                  📋
                </span>

              </div>

              <p className="text-xs text-slate-400 mt-5">
                {taskStats.pendingTasks || 0} tasks pending
              </p>

            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

              <div className="flex justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    Task Completion
                  </p>

                  <p className="text-3xl font-bold text-slate-900 mt-3">
                    {taskCompletionRate}%
                  </p>
                </div>

                <span className="text-2xl">
                  🎯
                </span>

              </div>

              <div className="mt-5 h-2 bg-slate-100 rounded-full overflow-hidden">

                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                  style={{
                    width: `${taskCompletionRate}%`,
                  }}
                />

              </div>

            </div>

          </div>

        </div>

        {/* ========================================= */}
        {/* SALES INTELLIGENCE */}
        {/* ========================================= */}

        <div className="mt-8 bg-slate-900 rounded-3xl p-6 md:p-8 text-white overflow-hidden relative">

          <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

          <div className="relative">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center text-xl">
                🧠
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Sales Intelligence
                </h2>

                <p className="text-sm text-slate-400 mt-1">
                  Key outcomes from your CRM data
                </p>
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">

                <p className="text-sm text-slate-400">
                  Won Revenue
                </p>

                <p className="text-2xl font-bold mt-2">
                  {currency(dealStats.wonValue)}
                </p>

                <p className="text-xs text-emerald-400 mt-3">
                  ✓ Successfully converted
                </p>

              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">

                <p className="text-sm text-slate-400">
                  Lost Revenue
                </p>

                <p className="text-2xl font-bold mt-2">
                  {currency(dealStats.lostValue)}
                </p>

                <p className="text-xs text-red-400 mt-3">
                  ⚠ Opportunities lost
                </p>

              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">

                <p className="text-sm text-slate-400">
                  High Risk Deals
                </p>

                <p className="text-2xl font-bold mt-2">
                  {dealStats.highRiskDeals || 0}
                </p>

                <p className="text-xs text-amber-400 mt-3">
                  ⚡ Needs attention
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Analytics;