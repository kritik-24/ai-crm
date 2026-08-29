import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-gray-950 text-white p-6">
      <h2 className="text-2xl font-bold mb-8">
        AI CRM
      </h2>

      <nav className="space-y-4">

        {/* Dashboard */}
        <Link
          to="/dashboard"
          className="block px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          Dashboard
        </Link>

        {/* Customers */}
        <Link
          to="/customers"
          className="block px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          Customers
        </Link>

        {/* Deals */}
        <Link
          to="/deals"
          className="block px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          Deals
        </Link>

        {/* Tasks */}
        <Link
          to="/tasks"
          className="block px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          Tasks
        </Link>

        {/* Leads */}
        <Link
          to="/leads"
          className="block px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          Leads
        </Link>

        {/* Analytics */}
        <Link
          to="/analytics"
          className="block px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          Analytics
        </Link>

      </nav>
    </aside>
  );
}

export default Sidebar;