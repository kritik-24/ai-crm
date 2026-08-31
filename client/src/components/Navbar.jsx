import { useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  Search,
  LogOut,
} from "lucide-react";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const pageTitles = {
    "/dashboard": {
      title: "Dashboard",
      subtitle: "Overview of your CRM performance",
    },

    "/customers": {
      title: "Customers",
      subtitle: "Manage your customer relationships",
    },

    "/leads": {
      title: "Leads",
      subtitle: "Manage and convert potential customers",
    },

    "/deals": {
      title: "Deals",
      subtitle: "Track your sales pipeline",
    },

    "/tasks": {
      title: "Tasks",
      subtitle: "Manage your work and follow-ups",
    },

    "/analytics": {
      title: "Analytics",
      subtitle: "Understand your business performance",
    },
  };

  const currentPage =
    pageTitles[location.pathname] || {
      title: "AI CRM",
      subtitle: "Smart customer management",
    };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 flex min-h-[76px] items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur sm:px-6 lg:px-8">

      {/* Page Title */}
      <div>

        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          {currentPage.title}
        </h1>

        <p className="mt-1 hidden text-sm text-slate-500 sm:block">
          {currentPage.subtitle}
        </p>

      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-4">

        {/* Search */}
        <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 lg:flex">

          <Search
            size={18}
            className="text-slate-400"
          />

          <input
            type="text"
            placeholder="Search CRM..."
            className="w-40 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />

        </div>

        {/* Notifications */}
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <Bell size={20} />

          <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* User */}
        <div className="hidden items-center gap-3 border-l border-slate-200 pl-4 sm:flex">

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white shadow-md shadow-blue-200">
            K
          </div>

          <div>

            <p className="text-sm font-semibold text-slate-800">
              User
            </p>

            <p className="text-xs text-slate-500">
              CRM Account
            </p>

          </div>

        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          <LogOut size={17} />

          <span className="hidden sm:inline">
            Logout
          </span>
        </button>

      </div>

    </header>
  );
}

export default Navbar;