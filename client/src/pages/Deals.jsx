import { useEffect, useState } from "react";

import {
  getDeals,
  createDeal,
  updateDeal,
  deleteDeal,
} from "../api/deal";

import { getCustomers } from "../api/customer";
import { getDealRisk } from "../api/ai";

function Deals() {
  const [deals, setDeals] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [form, setForm] = useState({
    title: "",
    value: "",
    status: "prospecting",
    customer: "",
    notes: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // AI Deal Risk
  const [aiLoadingId, setAiLoadingId] = useState(null);
  const [aiDeal, setAiDeal] = useState(null);
  const [aiError, setAiError] = useState("");

  // ======================================================
  // LOAD DEALS
  // ======================================================

  const loadDeals = async () => {
    try {
      const data = await getDeals();
      setDeals(data);
    } catch (error) {
      console.error("LOAD DEALS ERROR:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to load deals"
      );
    }
  };

  // ======================================================
  // LOAD CUSTOMERS
  // ======================================================

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
    loadDeals();
    loadCustomers();
  }, []);

  // ======================================================
  // FORM CHANGE
  // ======================================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ======================================================
  // RESET FORM
  // ======================================================

  const resetForm = () => {
    setForm({
      title: "",
      value: "",
      status: "prospecting",
      customer: "",
      notes: "",
    });

    setEditingId(null);
  };

  // ======================================================
  // CREATE / UPDATE DEAL
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dealData = {
        ...form,
        value: Number(form.value),
      };

      if (editingId) {
        await updateDeal(editingId, dealData);

        setMessage("Deal updated successfully!");
      } else {
        await createDeal(dealData);

        setMessage("Deal created successfully!");
      }

      resetForm();

      await loadDeals();
    } catch (error) {
      console.error("SAVE DEAL ERROR:", error);

      setMessage(
        error.response?.data?.message ||
          (editingId
            ? "Failed to update deal"
            : "Failed to create deal")
      );
    }
  };

  // ======================================================
  // EDIT DEAL
  // ======================================================

  const handleEdit = (deal) => {
    setEditingId(deal._id);

    setForm({
      title: deal.title || "",
      value: deal.value ?? "",
      status: deal.status || "prospecting",
      customer:
        deal.customer?._id ||
        deal.customer ||
        "",
      notes: deal.notes || "",
    });

    setMessage("");
  };

  // ======================================================
  // CANCEL EDIT
  // ======================================================

  const handleCancelEdit = () => {
    resetForm();
    setMessage("");
  };

  // ======================================================
  // DELETE DEAL
  // ======================================================

  const handleDelete = async (id) => {
    try {
      await deleteDeal(id);

      setMessage("Deal deleted successfully!");

      // Close AI panel if deleted deal was selected
      if (aiDeal?.deal?.id === id) {
        setAiDeal(null);
        setAiError("");
      }

      await loadDeals();
    } catch (error) {
      console.error("DELETE DEAL ERROR:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to delete deal"
      );
    }
  };

  // ======================================================
  // AI DEAL RISK
  // ======================================================

  const handleAIRisk = async (dealId) => {
    try {
      setAiLoadingId(dealId);
      setAiError("");
      setAiDeal(null);

      const data = await getDealRisk(dealId);

      setAiDeal(data);
    } catch (error) {
      console.error("AI DEAL RISK ERROR:", error);

      setAiError(
        error.response?.data?.message ||
          "Failed to analyze deal"
      );
    } finally {
      setAiLoadingId(null);
    }
  };

  // ======================================================
  // CLOSE AI PANEL
  // ======================================================

  const closeAIRisk = () => {
    setAiDeal(null);
    setAiError("");
  };

  // ======================================================
  // FILTER DEALS
  // ======================================================

  const filteredDeals = deals.filter((deal) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      deal.title
        ?.toLowerCase()
        .includes(searchText) ||
      deal.customer?.name
        ?.toLowerCase()
        .includes(searchText) ||
      deal.customer?.company
        ?.toLowerCase()
        .includes(searchText);

    const matchesStatus =
      statusFilter === "all" ||
      deal.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ======================================================
  // STATUS COLORS
  // ======================================================

  const getStatusClass = (status) => {
    if (status === "prospecting") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "negotiation") {
      return "bg-yellow-100 text-yellow-700";
    }

    if (status === "won") {
      return "bg-green-100 text-green-700";
    }

    if (status === "lost") {
      return "bg-red-100 text-red-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  // ======================================================
  // AI RISK COLORS
  // ======================================================

  const getRiskClass = (risk) => {
    if (risk === "High") {
      return "bg-red-100 text-red-700";
    }

    if (risk === "Medium") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-green-100 text-green-700";
  };

  // ======================================================
  // CURRENCY
  // ======================================================

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="p-6">

      {/* ==================================================
          HEADER
      ==================================================*/}

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Deals
        </h1>

        <p className="text-gray-500 mt-1">
          Manage your sales pipeline and deals.
        </p>
      </div>

      {/* ==================================================
          ADD / EDIT DEAL
      ==================================================*/}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow mb-8"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Deal" : "Add Deal"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Title */}
          <input
            name="title"
            placeholder="Deal title"
            value={form.title}
            onChange={handleChange}
            required
            className="border rounded-lg px-4 py-2"
          />

          {/* Value */}
          <input
            name="value"
            type="number"
            min="0"
            placeholder="Deal value"
            value={form.value}
            onChange={handleChange}
            required
            className="border rounded-lg px-4 py-2"
          />

          {/* Customer */}
          <select
            name="customer"
            value={form.customer}
            onChange={handleChange}
            required
            className="border rounded-lg px-4 py-2"
          >
            <option value="">
              Select Customer
            </option>

            {customers.map((customer) => (
              <option
                key={customer._id}
                value={customer._id}
              >
                {customer.name}
                {customer.company
                  ? ` - ${customer.company}`
                  : ""}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2"
          >
            <option value="prospecting">
              Prospecting
            </option>

            <option value="negotiation">
              Negotiation
            </option>

            <option value="won">
              Won
            </option>

            <option value="lost">
              Lost
            </option>
          </select>

          {/* Notes */}
          <input
            name="notes"
            placeholder="Notes"
            value={form.notes}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 md:col-span-2"
          />

        </div>

        <div className="flex gap-3 mt-4">

          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {editingId
              ? "Update Deal"
              : "Add Deal"}
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

      {/* ==================================================
          MESSAGE
      ==================================================*/}

      {message && (
        <div className="mb-4 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg">
          {message}
        </div>
      )}

      {/* ==================================================
          AI DEAL RISK PANEL
      ==================================================*/}

      {(aiDeal || aiError) && (
        <div className="mb-6 bg-white rounded-xl shadow p-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-5">

            <h2 className="text-xl font-bold text-gray-900">
              🤖 AI Deal Risk Analysis
            </h2>

            <button
              type="button"
              onClick={closeAIRisk}
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

          {/* AI Result */}
          {aiDeal && (
            <>
              {/* Deal Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

                {/* Deal */}
                <div className="bg-purple-50 p-5 rounded-lg">

                  <p className="text-sm text-gray-500">
                    Deal
                  </p>

                  <p className="font-semibold text-lg mt-1">
                    {aiDeal.deal.title}
                  </p>

                  <p className="text-gray-600 mt-1">
                    {formatCurrency(
                      aiDeal.deal.value
                    )}
                  </p>

                </div>

                {/* Risk */}
                <div className="bg-gray-50 p-5 rounded-lg">

                  <p className="text-sm text-gray-500">
                    Risk
                  </p>

                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${getRiskClass(
                      aiDeal.analysis.risk
                    )}`}
                  >
                    {aiDeal.analysis.risk}
                  </span>

                </div>

                {/* Win Probability */}
                <div className="bg-gray-50 p-5 rounded-lg">

                  <p className="text-sm text-gray-500">
                    Win Probability
                  </p>

                  <p className="text-3xl font-bold mt-1">
                    {aiDeal.analysis.winProbability}%
                  </p>

                </div>

              </div>

              {/* Probability Bar */}
              <div className="mb-6">

                <div className="flex justify-between mb-2">

                  <span className="text-sm font-medium text-gray-700">
                    Probability of Winning
                  </span>

                  <span className="text-sm font-semibold">
                    {aiDeal.analysis.winProbability}%
                  </span>

                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">

                  <div
                    className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${aiDeal.analysis.winProbability}%`,
                    }}
                  />

                </div>

              </div>

              {/* Reason */}
              <div className="bg-yellow-50 p-5 rounded-lg mb-5">

                <h3 className="font-semibold text-yellow-900 mb-2">
                  Why?
                </h3>

                <p className="text-yellow-800 leading-relaxed">
                  {aiDeal.analysis.reason}
                </p>

              </div>

              {/* Recommendation */}
              <div className="bg-blue-50 p-5 rounded-lg">

                <h3 className="font-semibold text-blue-900 mb-2">
                  Recommended Action
                </h3>

                <p className="text-blue-800 leading-relaxed">
                  {aiDeal.analysis.recommendation}
                </p>

              </div>
            </>
          )}

        </div>
      )}

      {/* ==================================================
          DEAL LIST
      ==================================================*/}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        {/* List Header */}
        <div className="p-5 border-b">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <h2 className="text-xl font-semibold">
              Deal List
            </h2>

            {/* Search */}
            <input
              type="text"
              placeholder="Search deals..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="border rounded-lg px-4 py-2 w-full md:w-64"
            />

            {/* Filter */}
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="border rounded-lg px-4 py-2"
            >
              <option value="all">
                All Status
              </option>

              <option value="prospecting">
                Prospecting
              </option>

              <option value="negotiation">
                Negotiation
              </option>

              <option value="won">
                Won
              </option>

              <option value="lost">
                Lost
              </option>
            </select>

          </div>
        </div>

        {/* Deals */}
        {filteredDeals.length === 0 ? (
          <p className="p-6 text-gray-500">
            No deals found.
          </p>
        ) : (
          <div className="divide-y">

            {filteredDeals.map((deal) => (
              <div
                key={deal._id}
                className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-gray-50"
              >

                {/* Deal Info */}
                <div>

                  <h3 className="font-semibold text-gray-900 text-lg">
                    {deal.title}
                  </h3>

                  <p className="text-gray-600 font-medium">
                    {formatCurrency(deal.value)}
                  </p>

                  <p className="text-gray-500">
                    Customer:{" "}
                    {deal.customer?.name ||
                      "Unknown customer"}
                  </p>

                  {deal.customer?.company && (
                    <p className="text-gray-500">
                      Company:{" "}
                      {deal.customer.company}
                    </p>
                  )}

                  {deal.notes && (
                    <p className="text-gray-500 text-sm mt-1">
                      Notes: {deal.notes}
                    </p>
                  )}

                </div>

                {/* Status + Actions */}
                <div className="flex flex-wrap items-center gap-3">

                  {/* Status */}
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusClass(
                      deal.status
                    )}`}
                  >
                    {deal.status}
                  </span>

                  {/* AI Risk */}
                  <button
                    type="button"
                    onClick={() =>
                      handleAIRisk(deal._id)
                    }
                    disabled={aiLoadingId === deal._id}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {aiLoadingId === deal._id
                      ? "Analyzing..."
                      : "🤖 AI Risk"}
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() =>
                      handleEdit(deal)
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Edit
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(deal._id)
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

export default Deals;