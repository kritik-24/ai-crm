import React, { useEffect, useState } from "react";
import { getCustomerStats } from "../api/customer";
import { getDealStats } from "../api/deal";
import { getTaskStats } from "../api/task";

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
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const [customers, deals, tasks] = await Promise.all([
          getCustomerStats(),
          getDealStats(),
          getTaskStats(),
        ]);

        console.log("ANALYTICS CUSTOMER STATS:", customers);
        console.log("ANALYTICS DEAL STATS:", deals);
        console.log("ANALYTICS TASK STATS:", tasks);

        setCustomerStats(customers || {});

        setDealStats((prev) => ({
          ...prev,
          ...deals,

          pipeline: {
            ...prev.pipeline,
            ...(deals?.pipeline || {}),
          },
        }));

        setTaskStats(tasks || {});
      } catch (error) {
        console.error("Failed to load analytics:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load analytics"
        );
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const currency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

  const totalTaskCompletedPercentage =
    taskStats.totalTasks > 0
      ? Math.round(
          (taskStats.completedTasks / taskStats.totalTasks) * 100
        )
      : 0;

  const dealStages = [
    {
      name: "Prospecting",
      data: dealStats.pipeline?.prospecting || {},
      probability: 40,
    },
    {
      name: "Negotiation",
      data: dealStats.pipeline?.negotiation || {},
      probability: 70,
    },
    {
      name: "Won",
      data: dealStats.pipeline?.won || {},
      probability: 100,
    },
    {
      name: "Lost",
      data: dealStats.pipeline?.lost || {},
      probability: 0,
    },
  ];

  // =========================
  // CHART DATA
  // =========================

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

  const DEAL_COLORS = [
    "#8b5cf6",
    "#3b82f6",
    "#22c55e",
    "#ef4444",
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

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Analytics
        </h1>

        <p className="text-gray-500 mt-2">
          Loading analytics...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* HEADER */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Analytics & Sales Intelligence
        </h1>

        <p className="text-gray-500 mt-2">
          Track your customers, sales pipeline, revenue forecast and task performance.
        </p>
      </div>

      {/* ERROR */}

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* SALES OVERVIEW */}

      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Sales Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-sm text-gray-500">
            Total Pipeline
          </p>

          <p className="text-2xl font-bold mt-2">
            {currency(dealStats.totalPipelineValue)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-sm text-gray-500">
            Expected Revenue
          </p>

          <p className="text-2xl font-bold mt-2">
            {currency(dealStats.expectedRevenue)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-sm text-gray-500">
            Weighted Pipeline
          </p>

          <p className="text-2xl font-bold mt-2">
            {currency(dealStats.weightedPipeline)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-sm text-gray-500">
            Win Rate
          </p>

          <p className="text-2xl font-bold mt-2">
            {dealStats.winRate || 0}%
          </p>
        </div>

      </div>

      {/* DEAL PERFORMANCE */}

      <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-4">
        Deal Performance
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-gray-500">
            Total Deals
          </p>

          <p className="text-3xl font-bold mt-2">
            {dealStats.totalDeals || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-gray-500">
            Pipeline Deals
          </p>

          <p className="text-3xl font-bold mt-2">
            {dealStats.pipelineDeals || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-gray-500">
            Won Deals
          </p>

          <p className="text-3xl font-bold mt-2">
            {dealStats.wonDeals || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-gray-500">
            High Risk Deals
          </p>

          <p className="text-3xl font-bold mt-2">
            {dealStats.highRiskDeals || 0}
          </p>
        </div>

      </div>

      {/* PIPELINE BY STAGE */}

      <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-4">
        Pipeline by Stage
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

        {dealStages.map((stage) => {
          const count = stage.data?.count || 0;

          const value = stage.data?.value || 0;

          const probability =
            stage.data?.probability ??
            stage.probability;

          return (
            <div
              key={stage.name}
              className="bg-white p-6 rounded-xl shadow border"
            >
              <p className="font-semibold text-gray-900">
                {stage.name}
              </p>

              <p className="text-sm text-gray-500 mt-2">
                Deals
              </p>

              <p className="text-2xl font-bold">
                {count}
              </p>

              <p className="text-sm text-gray-500 mt-4">
                Value
              </p>

              <p className="text-lg font-semibold">
                {currency(value)}
              </p>

              <p className="text-sm text-gray-500 mt-4">
                Probability
              </p>

              <p className="font-semibold">
                {probability}%
              </p>
            </div>
          );
        })}

      </div>

      {/* ===================== */}
      {/* ANALYTICS CHARTS */}
      {/* ===================== */}

      <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-4">
        Visual Analytics
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* DEAL PIPELINE CHART */}

        <div className="bg-white p-6 rounded-xl shadow border">
          <h3 className="text-lg font-semibold mb-6">
            Deals by Pipeline Stage
          </h3>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={dealStageChartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis allowDecimals={false} />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="deals"
                name="Deals"
                fill="#8b5cf6"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* TASK DONUT CHART */}

        <div className="bg-white p-6 rounded-xl shadow border">
          <h3 className="text-lg font-semibold mb-6">
            Task Status Distribution
          </h3>

          {taskStats.totalTasks > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={taskChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={110}
                  paddingAngle={4}
                  dataKey="value"
                  label
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
            <div className="h-[320px] flex items-center justify-center text-gray-500">
              No task data available
            </div>
          )}
        </div>

        {/* CUSTOMER PIE CHART */}

        <div className="bg-white p-6 rounded-xl shadow border">
          <h3 className="text-lg font-semibold mb-6">
            Customer Distribution
          </h3>

          {customerStats.totalCustomers > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={customerChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  dataKey="value"
                  label
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
            <div className="h-[320px] flex items-center justify-center text-gray-500">
              No customer data available
            </div>
          )}
        </div>

        {/* PIPELINE VALUE CHART */}

        <div className="bg-white p-6 rounded-xl shadow border">
          <h3 className="text-lg font-semibold mb-6">
            Pipeline Value by Stage
          </h3>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={dealStageChartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip
                formatter={(value) => currency(value)}
              />

              <Legend />

              <Bar
                dataKey="value"
                name="Pipeline Value"
                fill="#22c55e"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* CUSTOMER ANALYTICS */}

      <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-4">
        Customer Analytics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-gray-500">
            Total Customers
          </p>

          <p className="text-3xl font-bold mt-2">
            {customerStats.totalCustomers || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-gray-500">
            Leads
          </p>

          <p className="text-3xl font-bold mt-2">
            {customerStats.totalLeads || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-gray-500">
            Active Customers
          </p>

          <p className="text-3xl font-bold mt-2">
            {customerStats.activeCustomers || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-gray-500">
            Inactive Customers
          </p>

          <p className="text-3xl font-bold mt-2">
            {customerStats.inactiveCustomers || 0}
          </p>
        </div>

      </div>

      {/* TASK PERFORMANCE */}

      <h2 className="text-xl font-semibold text-gray-900 mt-10 mb-4">
        Task Performance
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-gray-500">
            Total Tasks
          </p>

          <p className="text-3xl font-bold mt-2">
            {taskStats.totalTasks || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-gray-500">
            Pending Tasks
          </p>

          <p className="text-3xl font-bold mt-2">
            {taskStats.pendingTasks || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-gray-500">
            In Progress
          </p>

          <p className="text-3xl font-bold mt-2">
            {taskStats.inProgressTasks || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-gray-500">
            Completed
          </p>

          <p className="text-3xl font-bold mt-2">
            {taskStats.completedTasks || 0}
          </p>
        </div>

      </div>

      {/* TASK COMPLETION */}

      <div className="mt-8 bg-white p-6 rounded-xl shadow border">

        <div className="flex justify-between mb-3">
          <p className="font-semibold">
            Task Completion Rate
          </p>

          <p className="font-bold">
            {totalTaskCompletedPercentage}%
          </p>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full"
            style={{
              width: `${totalTaskCompletedPercentage}%`,
            }}
          />
        </div>

      </div>

      {/* SALES SUMMARY */}

      <div className="mt-8 bg-white p-6 rounded-xl shadow border">

        <h2 className="text-xl font-semibold mb-4">
          Sales Intelligence Summary
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div>
            <p className="text-sm text-gray-500">
              Won Revenue
            </p>

            <p className="text-2xl font-bold mt-1">
              {currency(dealStats.wonValue)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Lost Revenue
            </p>

            <p className="text-2xl font-bold mt-1">
              {currency(dealStats.lostValue)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Deal Conversion
            </p>

            <p className="text-2xl font-bold mt-1">
              {dealStats.winRate || 0}%
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Analytics;