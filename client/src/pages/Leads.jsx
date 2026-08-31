import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCustomers, updateCustomer } from "../api/customer";

const AI_API_URL =
  "https://ai-crm-z8k9.onrender.com/api/ai";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const [selectedLead, setSelectedLead] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  // =====================================================
  // LOAD LEADS
  // =====================================================

  const loadLeads = async () => {
    try {
      setLoading(true);
      setError("");

      const customers = await getCustomers();

      const leadCustomers = customers.filter(
        (customer) => customer.status === "lead"
      );

      setLeads(leadCustomers);
    } catch (error) {
      console.error("Failed to load leads:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load leads"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  // =====================================================
  // CONVERT LEAD TO CUSTOMER
  // =====================================================

  const convertToCustomer = async (lead) => {
    try {
      setError("");
      setMessage("");

      const confirmed = window.confirm(
        `Convert ${lead.name} into an active customer?`
      );

      if (!confirmed) return;

      await updateCustomer(lead._id, {
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        status: "active",
        notes: lead.notes,
      });

      setMessage(
        `${lead.name} has been successfully converted to an active customer.`
      );

      setSelectedLead(null);
      setAiAnalysis(null);

      await loadLeads();
    } catch (error) {
      console.error(
        "Failed to convert lead:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to convert lead"
      );
    }
  };

  // =====================================================
  // AI LEAD ANALYSIS
  // =====================================================

  const analyzeLead = async (lead) => {
    try {
      setSelectedLead(lead);
      setAiAnalysis(null);
      setAiLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${AI_API_URL}/lead-analysis`,
        {
          customerId: lead._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAiAnalysis(response.data);
    } catch (error) {
      console.error(
        "AI lead analysis error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to analyze lead with AI"
      );
    } finally {
      setAiLoading(false);
    }
  };

  // =====================================================
  // GET PRIORITY STYLE
  // =====================================================

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "HOT":
        return "bg-red-100 text-red-700 border-red-200";

      case "WARM":
        return "bg-amber-100 text-amber-700 border-amber-200";

      case "COLD":
        return "bg-blue-100 text-blue-700 border-blue-200";

      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  // =====================================================
  // GET SCORE COLOR
  // =====================================================

  const getScoreStyle = (score) => {
    if (score >= 70) {
      return "text-green-600";
    }

    if (score >= 40) {
      return "text-amber-600";
    }

    return "text-blue-600";
  };

  // =====================================================
  // FILTER LEADS
  // =====================================================

  const filteredLeads = leads.filter((lead) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      lead.name?.toLowerCase().includes(search) ||
      lead.email?.toLowerCase().includes(search) ||
      lead.company?.toLowerCase().includes(search);

    if (priorityFilter === "all") {
      return matchesSearch;
    }

    return matchesSearch;
  });

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalLeads = leads.length;

  const leadsWithCompany = leads.filter(
    (lead) => lead.company
  ).length;

  const leadsWithPhone = leads.filter(
    (lead) => lead.phone
  ).length;

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">

      {/* ================================================= */}
      {/* PAGE HEADER */}
      {/* ================================================= */}

      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-2xl shadow-lg shadow-blue-200">
              🎯
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Lead Management
              </h1>

              <p className="mt-1 text-sm text-slate-500 sm:text-base">
                Track, qualify, analyze and convert your potential customers.
              </p>
            </div>

          </div>
        </div>

        <button
          onClick={loadLeads}
          className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          ↻ Refresh Leads
        </button>

      </div>

      {/* ================================================= */}
      {/* SUCCESS MESSAGE */}
      {/* ================================================= */}

      {message && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-green-700">
          <span className="text-xl">✓</span>

          <p className="font-medium">
            {message}
          </p>
        </div>
      )}

      {/* ================================================= */}
      {/* ERROR MESSAGE */}
      {/* ================================================= */}

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
          <span className="text-xl">⚠</span>

          <p className="font-medium">
            {error}
          </p>
        </div>
      )}

      {/* ================================================= */}
      {/* STATISTICS */}
      {/* ================================================= */}

      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Leads
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {loading ? "..." : totalLeads}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
              🎯
            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                With Company
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {loading ? "..." : leadsWithCompany}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl">
              🏢
            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Contact Ready
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {loading ? "..." : leadsWithPhone}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
              📞
            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-600 to-indigo-600 p-6 text-white shadow-lg">

          <p className="text-sm font-medium text-blue-100">
            AI Intelligence
          </p>

          <p className="mt-2 text-xl font-bold">
            Lead Scoring
          </p>

          <p className="mt-2 text-sm text-blue-100">
            Analyze leads with AI-powered insights.
          </p>

        </div>

      </div>

      {/* ================================================= */}
      {/* SEARCH */}
      {/* ================================================= */}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-4 lg:flex-row">

          <div className="relative flex-1">

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search by name, email or company..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

          </div>

          <select
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(e.target.value)
            }
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500"
          >
            <option value="all">
              All Priorities
            </option>

            <option value="HOT">
              🔥 Hot
            </option>

            <option value="WARM">
              🟡 Warm
            </option>

            <option value="COLD">
              🔵 Cold
            </option>

          </select>

        </div>

      </div>

      {/* ================================================= */}
      {/* LEADS TABLE */}
      {/* ================================================= */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex flex-col gap-3 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Lead Pipeline
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {filteredLeads.length} lead(s) available
            </p>
          </div>

          <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            🤖 AI Powered
          </div>

        </div>

        {loading ? (

          <div className="p-16 text-center">

            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>

            <p className="text-slate-500">
              Loading your leads...
            </p>

          </div>

        ) : filteredLeads.length === 0 ? (

          <div className="p-16 text-center">

            <div className="text-5xl">
              🎯
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-800">
              No leads found
            </h3>

            <p className="mt-2 text-slate-500">
              Create new customers with Lead status to see them here.
            </p>

          </div>

        ) : (

          <div className="divide-y divide-slate-100">

            {filteredLeads.map((lead) => (

              <div
                key={lead._id}
                className="p-5 transition hover:bg-slate-50"
              >

                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                  {/* LEAD INFO */}

                  <div className="flex min-w-0 items-start gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white">

                      {lead.name
                        ?.charAt(0)
                        ?.toUpperCase() || "L"}

                    </div>

                    <div className="min-w-0">

                      <h3 className="truncate text-base font-bold text-slate-900">
                        {lead.name}
                      </h3>

                      <p className="mt-1 truncate text-sm text-slate-500">
                        ✉️ {lead.email}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">

                        {lead.phone && (
                          <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                            📞 {lead.phone}
                          </span>
                        )}

                        {lead.company && (
                          <span className="rounded-lg bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
                            🏢 {lead.company}
                          </span>
                        )}

                      </div>

                    </div>

                  </div>

                  {/* NOTES */}

                  <div className="max-w-md flex-1">

                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Lead Notes
                    </p>

                    <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                      {lead.notes ||
                        "No additional notes available."}
                    </p>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex flex-wrap gap-3">

                    <button
                      onClick={() =>
                        analyzeLead(lead)
                      }
                      className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg"
                    >
                      🤖 Analyze with AI
                    </button>

                    <button
                      onClick={() =>
                        convertToCustomer(lead)
                      }
                      className="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
                    >
                      ✓ Convert
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* ================================================= */}
      {/* AI ANALYSIS MODAL */}
      {/* ================================================= */}

      {selectedLead && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white p-6">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 text-xl">
                  🤖
                </div>

                <div>

                  <h2 className="text-xl font-bold text-slate-900">
                    AI Lead Analysis
                  </h2>

                  <p className="text-sm text-slate-500">
                    {selectedLead.name}
                  </p>

                </div>

              </div>

              <button
                onClick={() => {
                  setSelectedLead(null);
                  setAiAnalysis(null);
                }}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-xl text-slate-500 transition hover:bg-slate-100"
              >
                ×
              </button>

            </div>

            {/* AI LOADING */}

            {aiLoading && (

              <div className="p-16 text-center">

                <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600"></div>

                <h3 className="text-lg font-bold text-slate-800">
                  AI is analyzing this lead...
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Evaluating contact information, company details and CRM activity.
                </p>

              </div>

            )}

            {/* AI RESULT */}

            {!aiLoading && aiAnalysis && (

              <div className="p-6">

                {/* SCORE */}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">

                    <p className="text-sm font-semibold text-slate-500">
                      AI Lead Score
                    </p>

                    <p
                      className={`mt-3 text-5xl font-black ${getScoreStyle(
                        aiAnalysis.analysis.leadScore
                      )}`}
                    >
                      {aiAnalysis.analysis.leadScore}
                    </p>

                    <p className="mt-2 text-sm text-slate-400">
                      out of 100
                    </p>

                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">

                    <p className="text-sm font-semibold text-slate-500">
                      Lead Priority
                    </p>

                    <div
                      className={`mx-auto mt-5 inline-flex rounded-full border px-5 py-2 text-lg font-bold ${getPriorityStyle(
                        aiAnalysis.analysis.priority
                      )}`}
                    >
                      {aiAnalysis.analysis.priority === "HOT"
                        ? "🔥 HOT"
                        : aiAnalysis.analysis.priority === "WARM"
                        ? "🟡 WARM"
                        : "🔵 COLD"}
                    </div>

                  </div>

                </div>

                {/* ANALYSIS */}

                <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-6">

                  <h3 className="font-bold text-blue-900">
                    🤖 AI Analysis
                  </h3>

                  <p className="mt-3 leading-7 text-blue-800">
                    {aiAnalysis.analysis.analysis}
                  </p>

                </div>

                {/* STRENGTHS AND CONCERNS */}

                <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">

                  <div className="rounded-2xl border border-green-100 bg-green-50 p-5">

                    <h3 className="font-bold text-green-800">
                      ✓ Strengths
                    </h3>

                    <ul className="mt-4 space-y-3">

                      {aiAnalysis.analysis.strengths.length === 0 ? (

                        <li className="text-sm text-green-700">
                          No major strengths identified yet.
                        </li>

                      ) : (

                        aiAnalysis.analysis.strengths.map(
                          (strength, index) => (

                            <li
                              key={index}
                              className="flex gap-2 text-sm text-green-700"
                            >
                              <span>✓</span>
                              {strength}
                            </li>

                          )
                        )

                      )}

                    </ul>

                  </div>

                  <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">

                    <h3 className="font-bold text-amber-800">
                      ⚠ Concerns
                    </h3>

                    <ul className="mt-4 space-y-3">

                      {aiAnalysis.analysis.concerns.length === 0 ? (

                        <li className="text-sm text-amber-700">
                          No major concerns identified.
                        </li>

                      ) : (

                        aiAnalysis.analysis.concerns.map(
                          (concern, index) => (

                            <li
                              key={index}
                              className="flex gap-2 text-sm text-amber-700"
                            >
                              <span>•</span>
                              {concern}
                            </li>

                          )
                        )

                      )}

                    </ul>

                  </div>

                </div>

                {/* RECOMMENDED ACTION */}

                <div className="mt-6 rounded-2xl bg-slate-900 p-6 text-white">

                  <p className="text-sm font-semibold text-blue-300">
                    🎯 RECOMMENDED NEXT ACTION
                  </p>

                  <p className="mt-3 text-lg font-medium leading-7">
                    {
                      aiAnalysis.analysis
                        .recommendedAction
                    }
                  </p>

                </div>

                {/* STATISTICS */}

                <div className="mt-6 grid grid-cols-3 gap-4">

                  <div className="rounded-xl border border-slate-200 p-4 text-center">

                    <p className="text-xl font-bold text-slate-900">
                      {
                        aiAnalysis.statistics
                          .totalDeals
                      }
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Deals
                    </p>

                  </div>

                  <div className="rounded-xl border border-slate-200 p-4 text-center">

                    <p className="text-xl font-bold text-slate-900">
                      {
                        aiAnalysis.statistics
                          .totalTasks
                      }
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Tasks
                    </p>

                  </div>

                  <div className="rounded-xl border border-slate-200 p-4 text-center">

                    <p className="text-xl font-bold text-slate-900">
                      {
                        aiAnalysis.statistics
                          .pendingTasks
                      }
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Pending
                    </p>

                  </div>

                </div>

              </div>

            )}

          </div>

        </div>

      )}

    </div>
  );
};

export default Leads;