import { apiRequest } from "./apiClient.js";

const buildCategoryReportQuery = ({ month, categoryIds = [] } = {}) => {
  const params = new URLSearchParams();

  if (month) {
    params.set("month", month);
  }

  if (categoryIds.length > 0) {
    params.set("categories", categoryIds.join(","));
  }

  return params.toString();
};

export const getDashboardSummaryRequest = () => {
  return apiRequest("/dashboard/summary");
};

export const getDashboardChartsRequest = () => {
  return apiRequest("/dashboard/charts");
};

export const getDashboardCategoryReportRequest = (filters) => {
  const query = buildCategoryReportQuery(filters);
  const suffix = query ? `?${query}` : "";

  return apiRequest(`/dashboard/category-report${suffix}`);
};