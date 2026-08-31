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

  const [aiLoadingId, setAiLoadingId] = useState(null);
  const [aiDeal, setAiDeal] = useState(null);
  const [aiError, setAiError] = useState("");

  // Load deals
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
    loadDeals();
    loadCustomers();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

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

  // Create / Update
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

  // Edit
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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleCancelEdit = () => {
    resetForm();
    setMessage("");
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      await deleteDeal(id);

      setMessage("Deal deleted successfully!");

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

  // AI Risk
  const handleAIRisk = async (dealId) => {
    try {
      setAiLoadingId(dealId);
      setAiError("");
      setAiDeal(null);

      const data = await getDealRisk(dealId);

      setAiDeal(data);

      setTimeout(() => {
        window.scrollTo({
          top: 300,
          behavior: "smooth",
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

  const closeAIRisk = () => {
    setAiDeal(null);
    setAiError("");
  };

  // Filter
  const filteredDeals = deals.filter((deal) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      deal.title?.toLowerCase().includes(searchText) ||
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

  const getStatusClass = (status) => {
    if (status === "prospecting") {
      return "bg-blue-50 text-blue-700 border-blue-100";
    }

    if (status === "negotiation") {
      return "bg-yellow-50 text-yellow-700 border-yellow-100";
    }

    if (status === "won") {
      return "bg-green-50 text-green-700 border-green-100";
    }

    if (status === "lost") {
      return "bg-red-50 text-red-700 border-red-100";
    }

    return "bg-gray-50 text-gray-700 border-gray-200";
  };

  const getRiskClass = (risk) => {
    if (risk === "High") {
      return "bg-red-100 text-red-700";
    }

    if (risk === "Medium") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-green-100 text-green-700";
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  // Dashboard statistics
  const totalPipelineValue = deals.reduce(
    (sum, deal) => sum + Number(deal.value || 0),
    0
  );

  const wonDeals = deals.filter(
    (deal) => deal.status === "won"
  );

  const wonValue = wonDeals.reduce(
    (sum, deal) => sum + Number(deal.value || 0),
    0
  );

  const activeDeals = deals.filter(
    (deal) =>
      deal.status === "prospecting" ||
      deal.status === "negotiation"
  );

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">

        <div>
          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center text-2xl shadow">
              💼
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Deals
              </h1>

              <p className="text-gray-500 mt-1">
                Track your sales pipeline and manage opportunities.
              </p>
            </div>

          </div>
        </div>

        <div className="text-left lg:text-right">

          <p className="text-sm text-gray-500">
            Total Pipeline
          </p>

          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(totalPipelineValue)}
          </p>

        </div>

      </div>


      {/* SUMMARY CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Total Deals
          </p>

          <p className="text-3xl font-bold text-gray-900 mt-2">
            {deals.length}
          </p>

          <p className="text-sm text-gray-400 mt-2">
            All opportunities
          </p>

        </div>


        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Active Pipeline
          </p>

          <p className="text-3xl font-bold text-blue-600 mt-2">
            {activeDeals.length}
          </p>

          <p className="text-sm text-gray-400 mt-2">
            Prospecting + negotiation
          </p>

        </div>


        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Won Deals
          </p>

          <p className="text-3xl font-bold text-green-600 mt-2">
            {wonDeals.length}
          </p>

          <p className="text-sm text-gray-400 mt-2">
            Successfully closed
          </p>

        </div>


        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">

          <p className="text-sm text-gray-500">
            Won Value
          </p>

          <p className="text-2xl font-bold text-purple-600 mt-2">
            {formatCurrency(wonValue)}
          </p>

          <p className="text-sm text-gray-400 mt-2">
            Revenue closed
          </p>

        </div>

      </div>


      {/* ADD / EDIT FORM */}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">

        <div className="px-6 py-5 border-b bg-gray-50 flex items-center justify-between">

          <div>

            <h2 className="text-xl font-bold text-gray-900">
              {editingId
                ? "Edit Deal"
                : "Create New Deal"}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {editingId
                ? "Update the details of this opportunity."
                : "Add a new opportunity to your sales pipeline."}
            </p>

          </div>

          {editingId && (
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
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
                Deal Title
              </label>

              <input
                name="title"
                placeholder="e.g. Website Development Project"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
              />

            </div>


            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deal Value
              </label>

              <input
                name="value"
                type="number"
                min="0"
                placeholder="Enter amount"
                value={form.value}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
              />

            </div>


            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer
              </label>

              <select
                name="customer"
                value={form.customer}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
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

            </div>


            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deal Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
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


            <div className="md:col-span-2">

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>

              <textarea
                name="notes"
                placeholder="Add additional details about this deal..."
                value={form.notes}
                onChange={handleChange}
                rows="3"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
              />

            </div>

          </div>


          <div className="flex flex-wrap gap-3 mt-6">

            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition shadow-sm"
            >
              {editingId
                ? "Update Deal"
                : "+ Create Deal"}
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


      {/* MESSAGE */}

      {message && (

        <div className="mb-6 px-5 py-4 bg-blue-50 border border-blue-100 text-blue-700 rounded-xl">
          {message}
        </div>

      )}


      {/* AI DEAL RISK */}

      {(aiDeal || aiError) && (

        <div className="mb-8 bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">

          <div className="px-6 py-5 bg-gradient-to-r from-purple-50 to-white flex items-center justify-between">

            <div>

              <h2 className="text-xl font-bold text-gray-900">
                🤖 AI Deal Risk Analysis
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                AI-powered opportunity assessment
              </p>

            </div>

            <button
              type="button"
              onClick={closeAIRisk}
              className="w-9 h-9 rounded-lg hover:bg-white text-gray-500 hover:text-gray-900 transition"
            >
              ✕
            </button>

          </div>


          <div className="p-6">

            {aiError && (

              <div className="bg-red-50 border border-red-100 text-red-700 px-5 py-4 rounded-xl">
                {aiError}
              </div>

            )}


            {aiDeal && (

              <>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

                  <div className="bg-purple-50 rounded-xl p-5">

                    <p className="text-sm text-gray-500">
                      Deal
                    </p>

                    <p className="font-bold text-lg text-gray-900 mt-2">
                      {aiDeal.deal.title}
                    </p>

                    <p className="text-purple-700 font-semibold mt-2">
                      {formatCurrency(aiDeal.deal.value)}
                    </p>

                  </div>


                  <div className="bg-gray-50 rounded-xl p-5">

                    <p className="text-sm text-gray-500">
                      Risk Level
                    </p>

                    <span
                      className={`inline-block mt-3 px-4 py-1.5 rounded-full text-sm font-semibold ${getRiskClass(
                        aiDeal.analysis.risk
                      )}`}
                    >
                      {aiDeal.analysis.risk} Risk
                    </span>

                  </div>


                  <div className="bg-blue-50 rounded-xl p-5">

                    <p className="text-sm text-gray-500">
                      Win Probability
                    </p>

                    <p className="text-4xl font-bold text-blue-700 mt-2">
                      {aiDeal.analysis.winProbability}%
                    </p>

                  </div>

                </div>


                <div className="mb-6 bg-gray-50 rounded-xl p-5">

                  <div className="flex justify-between mb-3">

                    <span className="text-sm font-semibold text-gray-700">
                      Probability of Winning
                    </span>

                    <span className="font-bold text-purple-700">
                      {aiDeal.analysis.winProbability}%
                    </span>

                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3">

                    <div
                      className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(
                            0,
                            aiDeal.analysis.winProbability
                          )
                        )}%`,
                      }}
                    />

                  </div>

                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <div className="bg-yellow-50 rounded-xl p-5">

                    <h3 className="font-bold text-yellow-900 mb-2">
                      Why this assessment?
                    </h3>

                    <p className="text-yellow-800 leading-relaxed">
                      {aiDeal.analysis.reason}
                    </p>

                  </div>


                  <div className="bg-blue-50 rounded-xl p-5">

                    <h3 className="font-bold text-blue-900 mb-2">
                      Recommended Action
                    </h3>

                    <p className="text-blue-800 leading-relaxed">
                      {aiDeal.analysis.recommendation}
                    </p>

                  </div>

                </div>

              </>

            )}

          </div>

        </div>

      )}


      {/* DEAL LIST */}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        <div className="p-6 border-b">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div>

              <h2 className="text-xl font-bold text-gray-900">
                Your Deals
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Showing {filteredDeals.length} of {deals.length} deals
              </p>

            </div>


            <div className="flex flex-col sm:flex-row gap-3">

              <input
                type="text"
                placeholder="Search deals or customers..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="border border-gray-300 rounded-xl px-4 py-2.5 w-full sm:w-64 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
              />


              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="border border-gray-300 rounded-xl px-4 py-2.5 bg-white outline-none focus:ring-2 focus:ring-blue-200"
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

        </div>


        {filteredDeals.length === 0 ? (

          <div className="py-16 text-center">

            <div className="text-5xl mb-4">
              💼
            </div>

            <h3 className="text-lg font-semibold text-gray-900">
              No deals found
            </h3>

            <p className="text-gray-500 mt-2">
              Try changing your search or filters, or create a new deal.
            </p>

          </div>

        ) : (

          <div className="p-4 md:p-6 grid grid-cols-1 xl:grid-cols-2 gap-5">

            {filteredDeals.map((deal) => (

              <div
                key={deal._id}
                className="border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:border-gray-300 transition"
              >

                <div className="flex justify-between items-start gap-4">

                  <div className="min-w-0">

                    <h3 className="text-lg font-bold text-gray-900 truncate">
                      {deal.title}
                    </h3>

                    <p className="text-2xl font-bold text-blue-600 mt-2">
                      {formatCurrency(deal.value)}
                    </p>

                  </div>


                  <span
                    className={`shrink-0 px-3 py-1.5 border rounded-full text-sm font-semibold capitalize ${getStatusClass(
                      deal.status
                    )}`}
                  >
                    {deal.status}
                  </span>

                </div>


                <div className="mt-5 pt-4 border-t">

                  <p className="text-sm text-gray-500">
                    Customer
                  </p>

                  <p className="font-semibold text-gray-800 mt-1">
                    {deal.customer?.name ||
                      "Unknown customer"}
                  </p>

                  {deal.customer?.company && (

                    <p className="text-sm text-gray-500 mt-1">
                      {deal.customer.company}
                    </p>

                  )}

                </div>


                {deal.notes && (

                  <div className="mt-4 bg-gray-50 rounded-xl p-4">

                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                      Notes
                    </p>

                    <p className="text-sm text-gray-600">
                      {deal.notes}
                    </p>

                  </div>

                )}


                <div className="flex flex-wrap gap-2 mt-5">

                  <button
                    type="button"
                    onClick={() =>
                      handleAIRisk(deal._id)
                    }
                    disabled={
                      aiLoadingId === deal._id
                    }
                    className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition disabled:opacity-50"
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
                    className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-100 transition"
                  >
                    Edit
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(deal._id)
                    }
                    className="px-4 py-2 bg-red-50 text-red-700 rounded-xl text-sm font-medium hover:bg-red-100 transition"
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