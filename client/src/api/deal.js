import axios from "axios";

const API_URL = "http://localhost:5000/api/deals";

// Get all deals
export const getDeals = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Create deal
export const createDeal = async (dealData) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(API_URL, dealData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Update deal
export const updateDeal = async (id, dealData) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `${API_URL}/${id}`,
    dealData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Delete deal
export const deleteDeal = async (id) => {
  const token = localStorage.getItem("token");

  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Get deal statistics
export const getDealStats = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
