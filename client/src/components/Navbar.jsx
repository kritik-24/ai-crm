import { useLocation, useNavigate } from "react-router-dom";

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
    <header className="min-h-[76px] bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-8">

      {/* Page Information */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">
          {currentPage.title}
        </h1>

        <p className="hidden sm:block text-sm text-slate-500 mt-1">
          {currentPage.subtitle}
        </p>
      </div>

      {/* User Section */}
      <div className="flex items-center gap-3">

        {/* User Avatar */}
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold shadow-sm">
          K
        </div>

        <div className="hidden sm:block">
          <p className="text-sm font-semibold text-slate-800">
            User
          </p>

          <p className="text-xs text-slate-500">
            CRM Account
          </p>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="ml-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
        >
          Logout
        </button>

      </div>

    </header>
  );
}

export default Navbar;