import axios from "axios";

const API_URL = "http://localhost:5000/api/customers";

export const getCustomers = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const createCustomer = async (customerData) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(API_URL, customerData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateCustomer = async (id, customerData) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `${API_URL}/${id}`,
    customerData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const deleteCustomer = async (id) => {
  const token = localStorage.getItem("token");

  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getCustomerStats = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
