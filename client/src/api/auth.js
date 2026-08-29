import axios from "axios";

const API = axios.create({
  baseURL:"https://ai-crm-z8k9.onrender.com/api/auth",
});

export const registerUser = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await API.post("/auth/login", userData);
  return response.data;
};