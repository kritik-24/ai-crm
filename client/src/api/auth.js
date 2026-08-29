import axios from "axios";

const API = axios.create({
  baseURL: "https://ai-crm-9zcx.onrender.com/api/auth",
});

export const registerUser = async (userData) => {
  const response = await API.post("/register", userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await API.post("/login", userData);
  return response.data;
};