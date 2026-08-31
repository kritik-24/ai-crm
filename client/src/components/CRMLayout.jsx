import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function CRMLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100 flex">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Section */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>

      </div>

    </div>
  );
}

export default CRMLayout;