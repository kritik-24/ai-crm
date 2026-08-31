import { useEffect, useState } from "react";

import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../api/customer";

import { getCustomerInsight } from "../api/ai";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "lead",
    notes: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // AI state
  const [aiLoadingId, setAiLoadingId] = useState(null);
  const [aiCustomer, setAiCustomer] = useState(null);
  const [aiError, setAiError] = useState("");
  const [copyMessage, setCopyMessage] = useState("");

  const emptyForm = {
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "lead",
    notes: "",
  };

  // Load customers
  const loadCustomers = async () => {
    try {
      setLoading(true);

      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("LOAD CUSTOMERS ERROR:", error);

      setMessageType("error");

      setMessage(
        error.response?.data?.message ||
          "Failed to load customers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  // Form change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Create / Update customer
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setMessage("");

      if (editingId) {
        await updateCustomer(editingId, form);

        setMessageType("success");
        setMessage("Customer updated successfully!");
      } else {
        await createCustomer(form);

        setMessageType("success");
        setMessage("Customer created successfully!");
      }

      setForm(emptyForm);
      setEditingId(null);

      await loadCustomers();
    } catch (error) {
      console.error("CUSTOMER SAVE ERROR:", error);

      setMessageType("error");

      setMessage(
        error.response?.data?.message ||
          (editingId
            ? "Failed to update customer"
            : "Failed to create customer")
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Start editing
  const handleEdit = (customer) => {
    setEditingId(customer._id);

    setForm({
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      company: customer.company || "",
      status: customer.status || "lead",
      notes: customer.notes || "",
    });

    setMessage("");
    setAiCustomer(null);
    setAiError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
  };

  // Delete customer
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmed) return;

    try {
      await deleteCustomer(id);

      setMessageType("success");
      setMessage("Customer deleted successfully!");

      setAiCustomer(null);
      setAiError("");

      await loadCustomers();
    } catch (error) {
      console.error("DELETE CUSTOMER ERROR:", error);

      setMessageType("error");

      setMessage(
        error.response?.data?.message ||
          "Failed to delete customer"
      );
    }
  };

  // Generate AI insight
  const handleAIInsight = async (customerId) => {
    try {
      setAiLoadingId(customerId);
      setAiError("");
      setAiCustomer(null);
      setCopyMessage("");

      const data = await getCustomerInsight(customerId);

      setAiCustomer(data);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error("AI INSIGHT ERROR:", error);

      setAiError(
        error.response?.data?.message ||
          "Failed to generate AI insight"
      );
    } finally {
      setAiLoadingId(null);
    }
  };

  // Close AI insight
  const closeAIInsight = () => {
    setAiCustomer(null);
    setAiError("");
    setCopyMessage("");
  };

  // Copy AI follow-up message
  const handleCopyMessage = async () => {
    if (!aiCustomer?.insight?.followUpMessage) return;

    try {
      await navigator.clipboard.writeText(
        aiCustomer.insight.followUpMessage
      );

      setCopyMessage("Message copied successfully!");

      setTimeout(() => {
        setCopyMessage("");
      }, 2000);
    } catch (error) {
      console.error("COPY MESSAGE ERROR:", error);

      setCopyMessage("Failed to copy message");
    }
  };

  // Search + filter
  const filteredCustomers = customers.filter((customer) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      customer.name?.toLowerCase().includes(searchText) ||
      customer.email?.toLowerCase().includes(searchText) ||
      customer.company?.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "all" ||
      customer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Status badge
  const getStatusClass = (status) => {
    if (status === "lead") {
      return "bg-amber-100 text-amber-700";
    }

    if (status === "active") {
      return "bg-green-100 text-green-700";
    }

    return "bg-gray-200 text-gray-700";
  };

  // AI quality badge
  const getQualityClass = (quality) => {
    if (quality === "High") {
      return "bg-green-100 text-green-700";
    }

    if (quality === "Low") {
      return "bg-red-100 text-red-700";
    }

    return "bg-amber-100 text-amber-700";
  };

  // AI risk badge
  const getRiskClass = (risk) => {
    if (risk === "High") {
      return "bg-red-100 text-red-700";
    }

    if (risk === "Medium") {
      return "bg-amber-100 text-amber-700";
    }

    return "bg-green-100 text-green-700";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">

      {/* ================= HEADER ================= */}

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

        <div>
          <p className="text-sm font-semibold text-blue-600 mb-2">
            CRM MANAGEMENT
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Customers
          </h1>

          <p className="text-gray-500 mt-2">
            Manage customers, leads, relationships, and AI insights.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Total Customers
          </p>

          <p className="text-2xl font-bold text-gray-900 mt-1">
            {customers.length}
          </p>
        </div>

      </div>

      {/* ================= MESSAGE ================= */}

      {message && (
        <div
          className={`mb-6 rounded-xl border px-5 py-4 ${
            messageType === "error"
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-green-50 border-green-200 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* ================= ADD / EDIT FORM ================= */}

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm mb-8 overflow-hidden">

        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {editingId ? "Edit Customer" : "Add New Customer"}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {editingId
                ? "Update customer information below."
                : "Add a customer or lead to your CRM."}
            </p>
          </div>

          {editingId && (
            <span className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
              Editing
            </span>
          )}

        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6"
        >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>

              <input
                name="name"
                placeholder="Enter customer name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>

              <input
                name="email"
                type="email"
                placeholder="customer@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>

              <input
                name="phone"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company
              </label>

              <input
                name="company"
                placeholder="Company name"
                value={form.company}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="lead">Lead</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>

              <textarea
                name="notes"
                placeholder="Add important notes about this customer..."
                value={form.notes}
                onChange={handleChange}
                rows="1"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

          </div>

          <div className="flex flex-wrap gap-3 mt-6">

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {submitting
                ? editingId
                  ? "Updating..."
                  : "Adding..."
                : editingId
                ? "Update Customer"
                : "Add Customer"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            )}

          </div>

        </form>
      </div>

      {/* ================= AI INSIGHT ================= */}

      {(aiCustomer || aiError) && (
        <div className="mb-8 bg-white border border-purple-100 rounded-2xl shadow-sm overflow-hidden">

          <div className="px-6 py-5 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-white flex items-center justify-between">

            <div>
              <p className="text-sm font-semibold text-purple-600">
                AI INTELLIGENCE
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-1">
                🤖 Customer Insight
              </h2>
            </div>

            <button
              type="button"
              onClick={closeAIInsight}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition"
            >
              ✕
            </button>

          </div>

          <div className="p-6">

            {aiError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl">
                {aiError}
              </div>
            )}

            {aiCustomer && (
              <>

                {/* AI Overview */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

                  <div className="bg-purple-50 border border-purple-100 rounded-xl p-5">

                    <p className="text-sm text-gray-500">
                      Customer
                    </p>

                    <p className="font-bold text-lg text-gray-900 mt-2">
                      {aiCustomer.customer.name}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {aiCustomer.customer.company ||
                        "No company provided"}
                    </p>

                  </div>

                  <div className="border border-gray-200 rounded-xl p-5">

                    <p className="text-sm text-gray-500">
                      Lead Quality
                    </p>

                    <span
                      className={`inline-block mt-3 px-3 py-1 rounded-full text-sm font-semibold ${getQualityClass(
                        aiCustomer.insight.leadQuality
                      )}`}
                    >
                      {aiCustomer.insight.leadQuality}
                    </span>

                  </div>

                  <div className="border border-gray-200 rounded-xl p-5">

                    <p className="text-sm text-gray-500">
                      Risk Level
                    </p>

                    <span
                      className={`inline-block mt-3 px-3 py-1 rounded-full text-sm font-semibold ${getRiskClass(
                        aiCustomer.insight.risk
                      )}`}
                    >
                      {aiCustomer.insight.risk}
                    </span>

                  </div>

                </div>

                {/* Summary */}

                <div className="mb-6">

                  <h3 className="font-bold text-gray-900 mb-2">
                    AI Summary
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {aiCustomer.insight.summary}
                  </p>

                </div>

                {/* Recommended Action */}

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-6">

                  <h3 className="font-bold text-blue-900 mb-2">
                    Recommended Action
                  </h3>

                  <p className="text-blue-800 leading-relaxed">
                    {aiCustomer.insight.recommendedAction}
                  </p>

                </div>

                {/* Follow-up */}

                {aiCustomer.insight.followUpMessage && (
                  <div className="bg-purple-50 border border-purple-100 rounded-xl p-5 mb-8">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">

                      <h3 className="font-bold text-purple-900">
                        ✉️ AI Follow-up Message
                      </h3>

                      <button
                        type="button"
                        onClick={handleCopyMessage}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
                      >
                        Copy Message
                      </button>

                    </div>

                    <p className="text-purple-900 whitespace-pre-line leading-relaxed">
                      {aiCustomer.insight.followUpMessage}
                    </p>

                    {copyMessage && (
                      <p className="text-sm text-green-700 font-medium mt-4">
                        ✓ {copyMessage}
                      </p>
                    )}

                  </div>
                )}

                {/* Statistics */}

                <h3 className="font-bold text-gray-900 mb-4">
                  Customer Statistics
                </h3>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

                  <div className="border border-gray-200 rounded-xl p-5">
                    <p className="text-sm text-gray-500">
                      Total Deals
                    </p>

                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {aiCustomer.statistics.totalDeals}
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-5">
                    <p className="text-sm text-gray-500">
                      Open Deals
                    </p>

                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {aiCustomer.statistics.openDeals}
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-5">
                    <p className="text-sm text-gray-500">
                      Pending Tasks
                    </p>

                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {aiCustomer.statistics.pendingTasks}
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-5">
                    <p className="text-sm text-gray-500">
                      Completed Tasks
                    </p>

                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {aiCustomer.statistics.completedTasks}
                    </p>
                  </div>

                </div>

                <div className="mt-4 border border-gray-200 rounded-xl p-5">

                  <p className="text-sm text-gray-500">
                    Total Deal Value
                  </p>

                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    ₹
                    {Number(
                      aiCustomer.statistics.totalDealValue || 0
                    ).toLocaleString("en-IN")}
                  </p>

                </div>

              </>
            )}

          </div>
        </div>
      )}

      {/* ================= CUSTOMER LIST ================= */}

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

        {/* List Header */}

        <div className="p-6 border-b border-gray-100">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Customer Directory
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Showing {filteredCustomers.length} of {customers.length} customers
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">

              <input
                type="text"
                placeholder="Search customers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-2.5 w-full sm:w-64 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="lead">Lead</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

            </div>

          </div>
        </div>

        {/* Loading */}

        {loading ? (
          <div className="py-20 text-center">

            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

            <p className="text-gray-500 mt-4">
              Loading customers...
            </p>

          </div>
        ) : filteredCustomers.length === 0 ? (

          /* Empty State */

          <div className="py-20 text-center px-6">

            <div className="text-5xl mb-4">
              👥
            </div>

            <h3 className="text-lg font-bold text-gray-900">
              No customers found
            </h3>

            <p className="text-gray-500 mt-2">
              Try changing your search or add a new customer.
            </p>

          </div>

        ) : (

          <div className="divide-y divide-gray-100">

            {filteredCustomers.map((customer) => (
              <div
                key={customer._id}
                className="p-6 hover:bg-gray-50 transition"
              >

                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

                  {/* Customer Information */}

                  <div className="flex items-start gap-4">

                    <div className="w-12 h-12 shrink-0 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-bold">

                      {customer.name?.charAt(0)?.toUpperCase() || "C"}

                    </div>

                    <div>

                      <div className="flex flex-wrap items-center gap-3">

                        <h3 className="font-bold text-gray-900 text-lg">
                          {customer.name}
                        </h3>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusClass(
                            customer.status
                          )}`}
                        >
                          {customer.status}
                        </span>

                      </div>

                      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-1 mt-2 text-sm text-gray-500">

                        <p>
                          {customer.email}
                        </p>

                        <p>
                          {customer.phone || "No phone"}
                        </p>

                        <p>
                          {customer.company || "No company"}
                        </p>

                      </div>

                      {customer.notes && (
                        <p className="text-sm text-gray-500 mt-2 max-w-2xl">
                          <span className="font-medium text-gray-600">
                            Notes:
                          </span>{" "}
                          {customer.notes}
                        </p>
                      )}

                    </div>

                  </div>

                  {/* Actions */}

                  <div className="flex flex-wrap items-center gap-2">

                    <button
                      type="button"
                      onClick={() => handleEdit(customer)}
                      className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleAIInsight(customer._id)
                      }
                      disabled={aiLoadingId === customer._id}
                      className="px-4 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {aiLoadingId === customer._id
                        ? "Analyzing..."
                        : "🤖 AI Insight"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(customer._id)
                      }
                      className="px-4 py-2.5 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-medium hover:bg-red-100 transition"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default Customers;