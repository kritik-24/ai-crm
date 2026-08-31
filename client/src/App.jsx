import { BrowserRouter, Routes, Route } from "react-router-dom";

import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/Forgotpassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Deals from "./pages/Deals";
import Tasks from "./pages/Tasks";
import Leads from "./pages/Leads";

import ProtectedRoute from "./components/ProtectedRoute";
import CRMLayout from "./components/CRMLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        {/* Protected CRM Routes */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <CRMLayout>
                <Dashboard />
              </CRMLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <CRMLayout>
                <Customers />
              </CRMLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/deals"
          element={
            <ProtectedRoute>
              <CRMLayout>
                <Deals />
              </CRMLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <CRMLayout>
                <Tasks />
              </CRMLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/leads"
          element={
            <ProtectedRoute>
              <CRMLayout>
                <Leads />
              </CRMLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <CRMLayout>
                <Analytics />
              </CRMLayout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
