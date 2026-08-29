import axios from "axios";

const API_URL = "https://ai-crm-z8k9.onrender.com/api/ai";

export const getCustomerInsight = async (customerId) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API_URL}/customer-insight`,
    {
      customerId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getDealRisk = async (dealId) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API_URL}/deal-risk`,
    {
      dealId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};