import { NavLink } from "react-router-dom";

function Sidebar() {
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: "🏠" },
    { name: "Customers", path: "/customers", icon: "👥" },
    { name: "Leads", path: "/leads", icon: "🎯" },
    { name: "Deals", path: "/deals", icon: "💼" },
    { name: "Tasks", path: "/tasks", icon: "✅" },
    { name: "Analytics", path: "/analytics", icon: "📊" },
  ];

  return (
    <aside className="w-64 min-h-screen bg-slate-950 text-white flex flex-col border-r border-slate-800">

      {/* Logo */}
      <div className="px-6 py-6 border-b border-slate-800">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-xl shadow-lg">
            🤖
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight">
              AI CRM
            </h2>

            <p className="text-xs text-slate-400">
              Smart Customer Management
            </p>
          </div>

        </div>

      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">

        <p className="px-3 mb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Workspace
        </p>

        <div className="space-y-2">

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `
                flex items-center gap-3 px-4 py-3 rounded-xl
                text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }
                `
              }
            >
              <span className="text-lg">
                {item.icon}
              </span>

              {item.name}
            </NavLink>
          ))}

        </div>

      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-slate-800">

        <div className="rounded-xl bg-slate-900 p-4">

          <p className="text-sm font-medium">
            AI Powered CRM
          </p>

          <p className="text-xs text-slate-400 mt-1">
            Manage customers smarter with AI insights.
          </p>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;