// src/services/userService.js
import axios from "axios";

const API_URL = "http://localhost:7000/api/admin/users";

// ✅ Fetch All Users
export const getAllUsers = async (token) => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
};
