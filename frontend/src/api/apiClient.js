import { getStoredToken } from "../utils/storage.js";

const API_URL = import.meta.env.VITE_API_URL;

export const apiRequest = async (endpoint, options = {}) => {
  if (!API_URL) {
    throw new Error("Falta configurar VITE_API_URL en el archivo .env");
  }

  const token = getStoredToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Error en la solicitud");
    error.status = response.status;
    error.errors = data.errors || [];
    throw error;
  }

  return data;
};