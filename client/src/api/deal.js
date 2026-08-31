import axios from "axios";

const API_URL =
  "https://ai-crm-z8k9.onrender.com/api/deals";

// ============================================
// GET AUTH HEADERS
// ============================================

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ============================================
// GET ALL DEALS
// ============================================

export const getDeals = async () => {
  const response = await axios.get(
    API_URL,
    getAuthHeaders()
  );

  return response.data;
};

// ============================================
// CREATE DEAL
// ============================================

export const createDeal = async (dealData) => {
  const response = await axios.post(
    API_URL,
    dealData,
    getAuthHeaders()
  );

  return response.data;
};

// ============================================
// UPDATE DEAL
// ============================================

export const updateDeal = async (
  id,
  dealData
) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    dealData,
    getAuthHeaders()
  );

  return response.data;
};

// ============================================
// DELETE DEAL
// ============================================

export const deleteDeal = async (id) => {
  const response = await axios.delete(
    `${API_URL}/${id}`,
    getAuthHeaders()
  );

  return response.data;
};

// ============================================
// GET DEAL STATISTICS
// ============================================

export const getDealStats = async () => {
  const response = await axios.get(
    `${API_URL}/stats`,
    getAuthHeaders()
  );

  return response.data;
};
