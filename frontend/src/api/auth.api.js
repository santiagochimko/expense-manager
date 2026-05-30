import { apiRequest } from "./apiClient.js";

export const registerRequest = (userData) => {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData)
  });
};

export const loginRequest = (credentials) => {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials)
  });
};

export const getMeRequest = () => {
  return apiRequest("/users/me");
};