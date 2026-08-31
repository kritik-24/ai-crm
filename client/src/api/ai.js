import axios from "axios";

const API_URL = "https://ai-crm-z8k9.onrender.com/api/ai";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ======================================================
// CUSTOMER INSIGHT
// ======================================================

export const getCustomerInsight = async (customerId) => {
  const response = await axios.post(
    `${API_URL}/customer-insight`,
    {
      customerId,
    },
    getAuthHeaders()
  );

  return response.data;
};

// ======================================================
// DEAL RISK ANALYSIS
// ======================================================

export const getDealRisk = async (dealId) => {
  const response = await axios.post(
    `${API_URL}/deal-risk`,
    {
      dealId,
    },
    getAuthHeaders()
  );

  return response.data;
};

// ======================================================
// LEAD ANALYSIS
// ======================================================

export const getLeadAnalysis = async (leadId) => {
  const response = await axios.post(
    `${API_URL}/lead-analysis`,
    {
      leadId,
    },
    getAuthHeaders()
  );

  return response.data;
};

// ======================================================
// AI TASK GENERATION
// ======================================================

export const generateAITasks = async ({
  customerId,
  dealId,
}) => {
  const response = await axios.post(
    `${API_URL}/generate-tasks`,
    {
      customerId,
      dealId,
    },
    getAuthHeaders()
  );

  return response.data;
};