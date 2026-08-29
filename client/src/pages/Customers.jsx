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

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "lead",
    notes: "",
  });

  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Edit state
  const [editingId, setEditingId] = useState(null);

  // AI state
  const [aiLoadingId, setAiLoadingId] = useState(null);
  const [aiCustomer, setAiCustomer] = useState(null);
  const [aiError, setAiError] = useState("");
  const [copyMessage, setCopyMessage] = useState("");

  // Load customers
  const loadCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("LOAD CUSTOMERS ERROR:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to load customers"
      );
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
      if (editingId) {
        await updateCustomer(editingId, form);

        setMessage("Customer updated successfully!");
      } else {
        await createCustomer(form);

        setMessage("Customer created successfully!");
      }

      setForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        status: "lead",
        notes: "",
      });

      setEditingId(null);

      await loadCustomers();
    } catch (error) {
      console.error("CUSTOMER SAVE ERROR:", error);

      setMessage(
        error.response?.data?.message ||
          (editingId
            ? "Failed to update customer"
            : "Failed to create customer")
      );
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
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);

    setForm({
      name: "",
      email: "",
      phone: "",
      company: "",
      status: "lead",
      notes: "",
    });

    setMessage("");
  };

  // Delete customer
  const handleDelete = async (id) => {
    try {
      await deleteCustomer(id);

      setMessage("Customer deleted successfully!");

      setAiCustomer(null);
      setAiError("");

      await loadCustomers();
    } catch (error) {
      console.error("DELETE CUSTOMER ERROR:", error);

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
    if (!aiCustomer?.insight?.followUpMessage) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        aiCustomer.insight.followUpMessage
      );

      setCopyMessage("Message copied!");

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
      return "bg-yellow-100 text-yellow-700";
    }

    if (status === "active") {
      return "bg-green-100 text-green-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  // AI quality badge
  const getQualityClass = (quality) => {
    if (quality === "High") {
      return "bg-green-100 text-green-700";
    }

    if (quality === "Low") {
      return "bg-red-100 text-red-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  // AI risk badge
  const getRiskClass = (risk) => {
    if (risk === "High") {
      return "bg-red-100 text-red-700";
    }

    if (risk === "Medium") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-green-100 text-green-700";
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Customers
        </h1>

        <p className="text-gray-500 mt-1">
          Manage your customers and leads.
        </p>
      </div>

      {/* Add / Edit Customer */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow mb-8"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Customer" : "Add Customer"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            className="border rounded-lg px-4 py-2"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="border rounded-lg px-4 py-2"
          />

          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2"
          />

          <input
            name="company"
            placeholder="Company"
            value={form.company}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2"
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2"
          >
            <option value="lead">Lead</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <input
            name="notes"
            placeholder="Notes"
            value={form.notes}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2"
          />

        </div>

        <div className="flex gap-3 mt-4">

          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {editingId ? "Update Customer" : "Add Customer"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          )}

        </div>
      </form>

      {/* Message */}
      {message && (
        <div className="mb-4 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg">
          {message}
        </div>
      )}

      {/* AI Insight */}
      {(aiCustomer || aiError) && (
        <div className="mb-6 bg-white rounded-xl shadow p-6">

          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900">
              🤖 AI Customer Insight
            </h2>

            <button
              type="button"
              onClick={closeAIInsight}
              className="text-gray-500 hover:text-gray-900 text-xl"
            >
              ✕
            </button>
          </div>

          {/* Error */}
          {aiError && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg">
              {aiError}
            </div>
          )}

          {/* Result */}
          {aiCustomer && (
            <>
              {/* Customer / Lead Quality / Risk */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

                <div className="bg-purple-50 p-5 rounded-lg">
                  <p className="text-sm text-gray-500">
                    Customer
                  </p>

                  <p className="font-semibold text-lg mt-1">
                    {aiCustomer.customer.name}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    {aiCustomer.customer.company ||
                      "No company"}
                  </p>
                </div>

                <div className="bg-gray-50 p-5 rounded-lg">
                  <p className="text-sm text-gray-500">
                    Lead Quality
                  </p>

                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${getQualityClass(
                      aiCustomer.insight.leadQuality
                    )}`}
                  >
                    {aiCustomer.insight.leadQuality}
                  </span>
                </div>

                <div className="bg-gray-50 p-5 rounded-lg">
                  <p className="text-sm text-gray-500">
                    Risk
                  </p>

                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${getRiskClass(
                      aiCustomer.insight.risk
                    )}`}
                  >
                    {aiCustomer.insight.risk}
                  </span>
                </div>

              </div>

              {/* Summary */}
              <div className="mb-5">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Summary
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {aiCustomer.insight.summary}
                </p>
              </div>

              {/* Recommended Action */}
              <div className="bg-blue-50 p-5 rounded-lg mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Recommended Action
                </h3>

                <p className="text-blue-800">
                  {aiCustomer.insight.recommendedAction}
                </p>
              </div>

              {/* Follow-up Message */}
              {aiCustomer.insight.followUpMessage && (
                <div className="bg-purple-50 p-5 rounded-lg mb-6">

                  <div className="flex items-center justify-between gap-3 mb-3">
                    <h3 className="font-semibold text-purple-900">
                      ✉️ AI Follow-up Message
                    </h3>

                    <button
                      type="button"
                      onClick={handleCopyMessage}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      Copy Message
                    </button>
                  </div>

                  <p className="text-purple-800 leading-relaxed whitespace-pre-line">
                    {aiCustomer.insight.followUpMessage}
                  </p>

                  {copyMessage && (
                    <p className="text-sm text-green-700 mt-3 font-medium">
                      {copyMessage}
                    </p>
                  )}

                </div>
              )}

              {/* Statistics */}
              <h3 className="font-semibold text-gray-900 mb-3">
                Customer Statistics
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                <div className="border rounded-lg p-4">
                  <p className="text-sm text-gray-500">
                    Deals
                  </p>

                  <p className="font-bold text-2xl mt-1">
                    {aiCustomer.statistics.totalDeals}
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <p className="text-sm text-gray-500">
                    Open Deals
                  </p>

                  <p className="font-bold text-2xl mt-1">
                    {aiCustomer.statistics.openDeals}
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <p className="text-sm text-gray-500">
                    Pending Tasks
                  </p>

                  <p className="font-bold text-2xl mt-1">
                    {aiCustomer.statistics.pendingTasks}
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <p className="text-sm text-gray-500">
                    Completed Tasks
                  </p>

                  <p className="font-bold text-2xl mt-1">
                    {aiCustomer.statistics.completedTasks}
                  </p>
                </div>

              </div>

              {/* Total Deal Value */}
              <div className="mt-4 border rounded-lg p-4">
                <p className="text-sm text-gray-500">
                  Total Deal Value
                </p>

                <p className="font-bold text-2xl mt-1">
                  ₹
                  {Number(
                    aiCustomer.statistics.totalDealValue || 0
                  ).toLocaleString("en-IN")}
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Customer List */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        {/* List Header */}
        <div className="p-5 border-b">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <h2 className="text-xl font-semibold">
              Customer List
            </h2>

            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg px-4 py-2 w-full md:w-64"
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="border rounded-lg px-4 py-2"
            >
              <option value="all">All Status</option>
              <option value="lead">Lead</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

          </div>
        </div>

        {/* Customers */}
        {filteredCustomers.length === 0 ? (
          <p className="p-6 text-gray-500">
            No customers found.
          </p>
        ) : (
          <div className="divide-y">

            {filteredCustomers.map((customer) => (
              <div
                key={customer._id}
                className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-gray-50"
              >

                {/* Customer Info */}
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {customer.name}
                  </h3>

                  <p className="text-gray-500">
                    {customer.email}
                  </p>

                  <p className="text-gray-500">
                    {customer.phone || "No phone"}
                  </p>

                  <p className="text-gray-500">
                    {customer.company || "No company"}
                  </p>

                  {customer.notes && (
                    <p className="text-gray-500 text-sm mt-1">
                      Notes: {customer.notes}
                    </p>
                  )}
                </div>

                {/* Status + Actions */}
                <div className="flex flex-wrap items-center gap-3">

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusClass(
                      customer.status
                    )}`}
                  >
                    {customer.status}
                  </span>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => handleEdit(customer)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Edit
                  </button>

                  {/* AI Insight */}
                  <button
                    type="button"
                    onClick={() =>
                      handleAIInsight(customer._id)
                    }
                    disabled={aiLoadingId === customer._id}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {aiLoadingId === customer._id
                      ? "Analyzing..."
                      : "🤖 AI Insight"}
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(customer._id)
                    }
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>

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