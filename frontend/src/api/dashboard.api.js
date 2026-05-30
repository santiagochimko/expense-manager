import { apiRequest } from "./apiClient.js";

export const getDashboardSummaryRequest = () => {
  return apiRequest("/dashboard/summary");
};

export const getDashboardChartsRequest = () => {
  return apiRequest("/dashboard/charts");
};