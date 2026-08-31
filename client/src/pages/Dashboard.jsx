import {
  Users,
  UserPlus,
  BriefcaseBusiness,
  TrendingUp,
  ArrowUpRight,
  Target,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Sparkles,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from "recharts";

function Dashboard() {
  // Temporary chart data
  // Later we can connect this to your backend API
  const revenueData = [
    { month: "Jan", revenue: 40000 },
    { month: "Feb", revenue: 65000 },
    { month: "Mar", revenue: 50000 },
    { month: "Apr", revenue: 90000 },
    { month: "May", revenue: 75000 },
    { month: "Jun", revenue: 120000 },
  ];

  const stats = [
    {
      title: "Total Customers",
      value: "4",
      description: "Registered customers",
      icon: Users,
    },
    {
      title: "Total Leads",
      value: "0",
      description: "Potential opportunities",
      icon: UserPlus,
    },
    {
      title: "Active Deals",
      value: "1",
      description: "Currently in pipeline",
      icon: BriefcaseBusiness,
    },
    {
      title: "Expected Revenue",
      value: "₹555",
      description: "Forecasted pipeline value",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="mx-auto max-w-[1600px] space-y-8">

      {/* Welcome Section */}
      <section className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

        <div>
          <div className="flex items-center gap-2">

            <Sparkles
              size={20}
              className="text-blue-600"
            />

            <span className="text-sm font-semibold text-blue-600">
              AI POWERED WORKSPACE
            </span>

          </div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Welcome back 👋
          </h1>

          <p className="mt-2 text-slate-500">
            Here's what's happening with your CRM today.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">

          <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">

            <Plus size={18} />

            Add Customer

          </button>

          <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700">

            <BriefcaseBusiness size={18} />

            Create Deal

          </button>

        </div>

      </section>

      {/* KPI Cards */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
            >

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>

                  <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                    {stat.value}
                  </h2>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:scale-110">
                  <Icon size={21} />
                </div>

              </div>

              <div className="mt-5 flex items-center gap-2">

                <ArrowUpRight
                  size={16}
                  className="text-emerald-600"
                />

                <span className="text-xs text-slate-500">
                  {stat.description}
                </span>

              </div>

            </div>
          );
        })}

      </section>

      {/* Analytics Section */}
      <section className="grid gap-6 xl:grid-cols-3">

        {/* Revenue Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">

          <div className="mb-8 flex items-center justify-between">

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                Revenue Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Revenue performance over the last 6 months
              </p>

            </div>

            <select className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 outline-none">

              <option>
                Last 6 months
              </option>

            </select>

          </div>

          <div className="h-[280px]">

            <ResponsiveContainer width="100%" height="100%">

              <AreaChart data={revenueData}>

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563EB"
                  strokeWidth={3}
                  fill="#DBEAFE"
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* AI Insights */}
        <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-lg">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">

              <Sparkles size={21} />

            </div>

            <div>

              <h2 className="font-bold">
                AI Insights
              </h2>

              <p className="text-xs text-slate-400">
                Smart CRM intelligence
              </p>

            </div>

          </div>

          <div className="mt-8 space-y-4">

            <div className="rounded-xl bg-white/10 p-4">

              <p className="text-sm font-medium">
                📈 Pipeline Opportunity
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Your active pipeline currently contains ₹555 in potential revenue.
              </p>

            </div>

            <div className="rounded-xl bg-white/10 p-4">

              <p className="text-sm font-medium">
                🎯 Lead Activity
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                You currently have no active leads. Add leads to improve your sales pipeline.
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* Bottom Section */}
      <section className="grid gap-6 xl:grid-cols-2">

        {/* Deal Health */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-bold text-slate-900">
            Deal Health
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Overview of your sales opportunities
          </p>

          <div className="mt-6 grid grid-cols-3 gap-4">

            <div className="rounded-xl bg-slate-50 p-4">

              <BriefcaseBusiness
                size={20}
                className="text-blue-600"
              />

              <p className="mt-3 text-2xl font-bold text-slate-900">
                3
              </p>

              <p className="text-xs text-slate-500">
                Total Deals
              </p>

            </div>

            <div className="rounded-xl bg-emerald-50 p-4">

              <CheckCircle2
                size={20}
                className="text-emerald-600"
              />

              <p className="mt-3 text-2xl font-bold text-slate-900">
                2
              </p>

              <p className="text-xs text-slate-500">
                Won Deals
              </p>

            </div>

            <div className="rounded-xl bg-red-50 p-4">

              <AlertTriangle
                size={20}
                className="text-red-600"
              />

              <p className="mt-3 text-2xl font-bold text-slate-900">
                1
              </p>

              <p className="text-xs text-slate-500">
                High Risk
              </p>

            </div>

          </div>

        </div>

        {/* Pipeline */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-bold text-slate-900">
            Pipeline Overview
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Deals grouped by sales stage
          </p>

          <div className="mt-6 space-y-5">

            <PipelineRow
              title="Prospecting"
              deals={0}
              value="₹0"
              progress="10%"
            />

            <PipelineRow
              title="Negotiation"
              deals={1}
              value="₹555"
              progress="40%"
            />

            <PipelineRow
              title="Won"
              deals={2}
              value="₹4.15 Cr"
              progress="100%"
            />

          </div>

        </div>

      </section>

    </div>
  );
}

function PipelineRow({
  title,
  deals,
  value,
  progress,
}) {
  return (
    <div>

      <div className="flex items-center justify-between">

        <div>

          <p className="font-semibold text-slate-800">
            {title}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {deals} deals
          </p>

        </div>

        <p className="font-bold text-slate-900">
          {value}
        </p>

      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">

        <div
          className="h-full rounded-full bg-blue-600"
          style={{
            width: progress,
          }}
        />

      </div>

    </div>
  );
}

export default Dashboard;