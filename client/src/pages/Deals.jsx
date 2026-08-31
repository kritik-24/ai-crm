import { useEffect, useMemo, useState } from "react";

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
  const [messageType, setMessageType] = useState("success");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showForm, setShowForm] = useState(false);

  // AI Risk
  const [aiLoadingId, setAiLoadingId] = useState(null);
  const [aiDeal, setAiDeal] = useState(null);
  const [aiError, setAiError] = useState("");

  // =====================================================
  // LOAD DEALS
  // =====================================================

  const loadDeals = async () => {
    try {
      const data = await getDeals();
      setDeals(data);
    } catch (error) {
      console.error("LOAD DEALS ERROR:", error);

      setMessageType("error");
      setMessage(
        error.response?.data?.message ||
          "Failed to load deals"
      );
    }
  };

  // =====================================================
  // LOAD CUSTOMERS
  // =====================================================

  const loadCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("LOAD CUSTOMERS ERROR:", error);

      setMessageType("error");
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

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // RESET FORM
  // =====================================================

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

  // =====================================================
  // OPEN CREATE FORM
  // =====================================================

  const handleAddDeal = () => {
    resetForm();
    setMessage("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // CREATE / UPDATE DEAL
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dealData = {
        ...form,
        value: Number(form.value),
      };

      if (editingId) {
        await updateDeal(editingId, dealData);

        setMessageType("success");
        setMessage("Deal updated successfully!");
      } else {
        await createDeal(dealData);

        setMessageType("success");
        setMessage("Deal created successfully!");
      }

      resetForm();
      setShowForm(false);

      await loadDeals();
    } catch (error) {
      console.error("SAVE DEAL ERROR:", error);

      setMessageType("error");

      setMessage(
        error.response?.data?.message ||
          (editingId
            ? "Failed to update deal"
            : "Failed to create deal")
      );
    }
  };

  // =====================================================
  // EDIT DEAL
  // =====================================================

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
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const handleCancelEdit = () => {
    resetForm();
    setShowForm(false);
  };

  // =====================================================
  // DELETE DEAL
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this deal?"
    );

    if (!confirmed) return;

    try {
      await deleteDeal(id);

      setMessageType("success");
      setMessage("Deal deleted successfully!");
      
      if (aiDeal?.deal?.id === id ||
          aiDeal?.deal?.id === id
      ) {
        setAiDeal(null);
        setAiError("");
      }

      await loadDeals();
    } catch (error) {
      console.error("DELETE DEAL ERROR:", error);

      setMessageType("error");

      setMessage(
        error.response?.data?.message ||
          "Failed to delete deal"
      );
    }
  };

  // =====================================================
  // AI DEAL RISK
  // =====================================================

  const handleAIRisk = async (dealId) => {
    try {
      setAiLoadingId(dealId);
      setAiError("");
      setAiDeal(null);

      const data = await getDealRisk(dealId);

      setAiDeal(data);

      setTimeout(() => {
        document
          .getElementById("ai-risk-panel")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 100);
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

  // =====================================================
  // CLOSE AI PANEL
  // =====================================================

  const closeAIRisk = () => {
    setAiDeal(null);
    setAiError("");
  };

  // =====================================================
  // FILTER DEALS
  // =====================================================

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
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
  }, [deals, search, statusFilter]);

  // =====================================================
  // DEAL STATISTICS
  // =====================================================

  const statistics = useMemo(() => {
    const totalValue = deals.reduce(
      (sum, deal) =>
        sum + Number(deal.value || 0),
      0
    );

    const prospecting = deals.filter(
      (deal) =>
        deal.status === "prospecting"
    ).length;

    const negotiation = deals.filter(
      (deal) =>
        deal.status === "negotiation"
    ).length;

    const wonValue = deals
      .filter(
        (deal) =>
          deal.status === "won"
      )
      .reduce(
        (sum, deal) =>
          sum + Number(deal.value || 0),
        0
      );

    return {
      total: deals.length,
      totalValue,
      prospecting,
      negotiation,
      wonValue,
    };
  }, [deals]);

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusClass = (status) => {
    if (status === "prospecting") {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }

    if (status === "negotiation") {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }

    if (status === "won") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (status === "lost") {
      return "bg-red-50 text-red-700 border-red-200";
    }

    return "bg-slate-50 text-slate-700 border-slate-200";
  };

  // =====================================================
  // AI RISK STYLE
  // =====================================================

  const getRiskClass = (risk) => {
    if (risk === "High") {
      return "bg-red-100 text-red-700";
    }

    if (risk === "Medium") {
      return "bg-amber-100 text-amber-700";
    }

    return "bg-emerald-100 text-emerald-700";
  };

  // =====================================================
  // CURRENCY
  // =====================================================

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-full bg-slate-50 p-4 md:p-6 lg:p-8">

      {/* HEADER */}

      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-2xl shadow-lg shadow-blue-200">
              💼
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Deals Pipeline
              </h1>

              <p className="mt-1 text-sm text-slate-500 md:text-base">
                Track opportunities and manage your sales pipeline.
              </p>
            </div>

          </div>
        </div>

        <button
          type="button"
          onClick={handleAddDeal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 hover:shadow-xl"
        >
          <span className="text-lg">+</span>
          Create Deal
        </button>

      </div>

      {/* STATISTICS */}

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Deals
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {statistics.total}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl">
              💼
            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Pipeline Value
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {formatCurrency(
                  statistics.totalValue
                )}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-xl">
              💰
            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                In Negotiation
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {statistics.negotiation}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-xl">
              🤝
            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Won Value
              </p>

              <p className="mt-2 text-2xl font-bold text-emerald-600">
                {formatCurrency(
                  statistics.wonValue
                )}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-xl">
              🏆
            </div>

          </div>

        </div>

      </div>

      {/* CREATE / EDIT FORM */}

      {showForm && (

        <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {editingId
                  ? "Edit Deal"
                  : "Create New Deal"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {editingId
                  ? "Update the information for this opportunity."
                  : "Add a new opportunity to your sales pipeline."}
              </p>
            </div>

            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-sm font-medium text-slate-500 hover:text-slate-900"
            >
              ✕ Close
            </button>

          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6"
          >

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* TITLE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Deal Title
                </label>

                <input
                  name="title"
                  placeholder="Example: Website Development Project"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* VALUE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Deal Value (₹)
                </label>

                <input
                  name="value"
                  type="number"
                  min="0"
                  placeholder="50000"
                  value={form.value}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* CUSTOMER */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Customer
                </label>

                <select
                  name="customer"
                  value={form.customer}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="">
                    Select a customer
                  </option>

                  {customers.map((customer) => (
                    <option
                      key={customer._id}
                      value={customer._id}
                    >
                      {customer.name}
                      {customer.company
                        ? ` — ${customer.company}`
                        : ""}
                    </option>
                  ))}

                </select>
              </div>

              {/* STATUS */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Deal Stage
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
              </div>

              {/* NOTES */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Notes
                </label>

                <textarea
                  name="notes"
                  placeholder="Add important details about this deal..."
                  value={form.notes}
                  onChange={handleChange}
                  rows="4"
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />

              </div>

            </div>

            <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-5">

              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                {editingId
                  ? "Save Changes"
                  : "Create Deal"}
              </button>

              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      )}

      {/* MESSAGE */}

      {message && (

        <div
          className={`mb-6 flex items-center justify-between rounded-xl border px-5 py-4 ${
            messageType === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >

          <span className="font-medium">
            {messageType === "error"
              ? "⚠️ "
              : "✓ "}
            {message}
          </span>

          <button
            type="button"
            onClick={() => setMessage("")}
            className="ml-4 text-lg"
          >
            ✕
          </button>

        </div>

      )}

      {/* AI RISK PANEL */}

      {(aiDeal || aiError) && (

        <div
          id="ai-risk-panel"
          className="mb-8 overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-sm"
        >

          <div className="flex items-center justify-between border-b border-purple-100 bg-purple-50 px-6 py-5">

            <div>

              <h2 className="text-xl font-bold text-purple-950">
                🤖 AI Deal Intelligence
              </h2>

              <p className="mt-1 text-sm text-purple-700">
                AI-powered risk and conversion analysis.
              </p>

            </div>

            <button
              type="button"
              onClick={closeAIRisk}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-purple-700 transition hover:bg-purple-100"
            >
              ✕
            </button>

          </div>

          <div className="p-6">

            {aiError && (

              <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
                ⚠️ {aiError}
              </div>

            )}

            {aiDeal && (

              <>

                {/* OVERVIEW */}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                  <div className="rounded-xl border border-slate-200 bg-white p-5">

                    <p className="text-sm font-medium text-slate-500">
                      Deal
                    </p>

                    <p className="mt-2 text-lg font-bold text-slate-900">
                      {aiDeal.deal.title}
                    </p>

                    <p className="mt-1 font-semibold text-blue-600">
                      {formatCurrency(
                        aiDeal.deal.value
                      )}
                    </p>

                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-5">

                    <p className="text-sm font-medium text-slate-500">
                      Risk Level
                    </p>

                    <span
                      className={`mt-3 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getRiskClass(
                        aiDeal.analysis.risk
                      )}`}
                    >
                      {aiDeal.analysis.risk} Risk
                    </span>

                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-5">

                    <p className="text-sm font-medium text-slate-500">
                      Win Probability
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {aiDeal.analysis.winProbability}%
                    </p>

                  </div>

                </div>

                {/* PROBABILITY */}

                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">

                  <div className="mb-3 flex items-center justify-between">

                    <p className="font-semibold text-slate-800">
                      Probability of Winning
                    </p>

                    <p className="font-bold text-purple-600">
                      {aiDeal.analysis.winProbability}%
                    </p>

                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-200">

                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-600 transition-all duration-700"
                      style={{
                        width: `${Math.min(
                          Math.max(
                            aiDeal.analysis.winProbability,
                            0
                          ),
                          100
                        )}%`,
                      }}
                    />

                  </div>

                </div>

                {/* REASON */}

                <div className="mt-5 rounded-xl border border-amber-100 bg-amber-50 p-5">

                  <h3 className="font-bold text-amber-900">
                    🔎 Analysis
                  </h3>

                  <p className="mt-2 leading-relaxed text-amber-800">
                    {aiDeal.analysis.reason}
                  </p>

                </div>

                {/* RECOMMENDATION */}

                <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-5">

                  <h3 className="font-bold text-blue-900">
                    💡 Recommended Action
                  </h3>

                  <p className="mt-2 leading-relaxed text-blue-800">
                    {aiDeal.analysis.recommendation}
                  </p>

                </div>

              </>

            )}

          </div>

        </div>

      )}

      {/* DEAL LIST */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* LIST HEADER */}

        <div className="border-b border-slate-100 p-5 md:p-6">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                All Deals
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredDeals.length} of {deals.length} deals shown
              </p>

            </div>

            <div className="flex flex-col gap-3 sm:flex-row">

              {/* SEARCH */}

              <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2">
                  🔍
                </span>

                <input
                  type="text"
                  placeholder="Search deals..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 sm:w-64"
                />

              </div>

              {/* FILTER */}

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="all">
                  All Stages
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

        </div>

        {/* EMPTY STATE */}

        {filteredDeals.length === 0 ? (

          <div className="px-6 py-16 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
              💼
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-800">
              No deals found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Try changing your search or filters, or create a new deal to start building your pipeline.
            </p>

            <button
              type="button"
              onClick={handleAddDeal}
              className="mt-5 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              + Create Deal
            </button>

          </div>

        ) : (

          <div className="divide-y divide-slate-100">

            {filteredDeals.map((deal) => (

              <div
                key={deal._id}
                className="p-5 transition hover:bg-slate-50 md:p-6"
              >

                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                  {/* DEAL INFO */}

                  <div className="min-w-0">

                    <div className="flex flex-wrap items-center gap-3">

                      <h3 className="text-lg font-bold text-slate-900">
                        {deal.title}
                      </h3>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(
                          deal.status
                        )}`}
                      >
                        {deal.status}
                      </span>

                    </div>

                    <div className="mt-3 flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:flex-wrap sm:gap-x-6">

                      <span>
                        👤{" "}
                        {deal.customer?.name ||
                          "Unknown customer"}
                      </span>

                      {deal.customer?.company && (
                        <span>
                          🏢 {deal.customer.company}
                        </span>
                      )}

                    </div>

                    {deal.notes && (

                      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
                        {deal.notes}
                      </p>

                    )}

                  </div>

                  {/* VALUE + ACTIONS */}

                  <div className="flex flex-col gap-4 xl:items-end">

                    <p className="text-2xl font-bold text-slate-900">
                      {formatCurrency(deal.value)}
                    </p>

                    <div className="flex flex-wrap gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          handleAIRisk(deal._id)
                        }
                        disabled={
                          aiLoadingId === deal._id
                        }
                        className="rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {aiLoadingId === deal._id
                          ? "Analyzing..."
                          : "🤖 AI Risk"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(deal)
                        }
                        className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(deal._id)
                        }
                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                      >
                        🗑 Delete
                      </button>

                    </div>

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

export default Deals;