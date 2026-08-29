import React, { useEffect, useState } from "react";
import { getCustomers, updateCustomer } from "../api/customer";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadLeads = async () => {
    try {
      setLoading(true);

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

  const convertToCustomer = async (lead) => {
    try {
      setError("");
      setMessage("");

      await updateCustomer(lead._id, {
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        status: "active",
        notes: lead.notes,
      });

      setMessage(
        `${lead.name} converted to an active customer.`
      );

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

  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Leads
        </h1>

        <p className="text-gray-500 mt-1">
          Manage and convert your potential customers.
        </p>
      </div>

      {/* Messages */}
      {message && (
        <div className="mb-4 px-4 py-3 bg-green-50 text-green-700 rounded-lg">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Lead Count */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <p className="text-gray-500 font-medium">
          Total Leads
        </p>

        <p className="text-3xl font-bold mt-2">
          {loading ? "..." : leads.length}
        </p>
      </div>

      {/* Lead List */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="p-5 border-b">
          <h2 className="text-xl font-semibold">
            Lead List
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading leads...
          </div>
        ) : leads.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No leads found.
          </div>
        ) : (
          <div className="divide-y">

            {leads.map((lead) => (
              <div
                key={lead._id}
                className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-gray-50"
              >

                {/* Lead Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {lead.name}
                  </h3>

                  <p className="text-gray-600">
                    {lead.email}
                  </p>

                  {lead.phone && (
                    <p className="text-gray-500">
                      {lead.phone}
                    </p>
                  )}

                  {lead.company && (
                    <p className="text-gray-500">
                      Company: {lead.company}
                    </p>
                  )}

                  {lead.notes && (
                    <p className="text-gray-500 text-sm mt-1">
                      {lead.notes}
                    </p>
                  )}
                </div>

                {/* Action */}
                <button
                  onClick={() =>
                    convertToCustomer(lead)
                  }
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Convert to Customer
                </button>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default Leads;