import axios from "axios";

const API_URL =
  "https://ai-crm-z8k9.onrender.com/api/customers";

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
// GET ALL CUSTOMERS
// ============================================

export const getCustomers = async () => {
  const response = await axios.get(
    API_URL,
    getAuthHeaders()
  );

  return response.data;
};

// ============================================
// CREATE CUSTOMER
// ============================================

export const createCustomer = async (customerData) => {
  const response = await axios.post(
    API_URL,
    customerData,
    getAuthHeaders()
  );

  return response.data;
};

// ============================================
// UPDATE CUSTOMER
// ============================================

export const updateCustomer = async (
  id,
  customerData
) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    customerData,
    getAuthHeaders()
  );

  return response.data;
};

// ============================================
// DELETE CUSTOMER
// ============================================

export const deleteCustomer = async (id) => {
  const response = await axios.delete(
    `${API_URL}/${id}`,
    getAuthHeaders()
  );

  return response.data;
};

// ============================================
// GET CUSTOMER STATISTICS
// ============================================

export const getCustomerStats = async () => {
  const response = await axios.get(
    `${API_URL}/stats`,
    getAuthHeaders()
  );

  return response.data;
};
