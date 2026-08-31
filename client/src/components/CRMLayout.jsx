import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function CRMLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Application Area */}
      <div className="lg:pl-64">
        
        {/* Top Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="min-h-[calc(100vh-76px)] p-5 sm:p-6 lg:p-8">
          {children}
        </main>

      </div>
    </div>
  );
}

export default CRMLayout;