import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Target,
  BriefcaseBusiness,
  CheckSquare,
  BarChart3,
  Bot,
} from "lucide-react";

function Sidebar() {
  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Customers",
      path: "/customers",
      icon: Users,
    },
    {
      name: "Leads",
      path: "/leads",
      icon: Target,
    },
    {
      name: "Deals",
      path: "/deals",
      icon: BriefcaseBusiness,
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: CheckSquare,
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: BarChart3,
    },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col bg-slate-950 text-white lg:flex">

      {/* Logo */}
      <div className="border-b border-slate-800 px-6 py-6">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-900/30">
            <Bot size={23} />
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight">
              AI CRM
            </h2>

            <p className="mt-0.5 text-xs text-slate-400">
              Smart Customer Management
            </p>
          </div>

        </div>

      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Workspace
        </p>

        <div className="space-y-1.5">

          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`
                }
              >
                <Icon
                  size={19}
                  className="transition-transform duration-200 group-hover:scale-110"
                />

                <span>{item.name}</span>
              </NavLink>
            );
          })}

        </div>

      </nav>

      {/* AI Insight Card */}
      <div className="border-t border-slate-800 p-4">

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">

          <div className="flex items-center gap-2">

            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
              <Bot size={17} />
            </div>

            <p className="text-sm font-semibold">
              AI Insights
            </p>

          </div>

          <p className="mt-3 text-xs leading-5 text-slate-400">
            Manage customers smarter with AI-powered business insights.
          </p>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;