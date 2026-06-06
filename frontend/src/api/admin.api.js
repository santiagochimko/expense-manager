import { apiRequest } from "./apiClient.js";

const buildQuery = (filters) => {
  const params = new URLSearchParams();

  params.set("page", filters.page || 1);
  params.set("limit", filters.limit || 10);

  if (filters.search) {
    params.set("search", filters.search);
  }

  if (filters.role) {
    params.set("role", filters.role);
  }

  if (filters.plan) {
    params.set("plan", filters.plan);
  }

  if (filters.userId) {
    params.set("userId", filters.userId);
  }

  if (filters.category) {
    params.set("category", filters.category);
  }

  if (filters.isActive !== "" && filters.isActive !== undefined) {
    params.set("isActive", filters.isActive);
  }

  return params.toString();
};

export const getAdminDashboardRequest = () => {
  return apiRequest("/admin/dashboard");
};

export const getAdminUsersRequest = (filters) => {
  const query = buildQuery(filters);

  return apiRequest(`/admin/users?${query}`);
};

export const getAdminExpensesRequest = (filters) => {
  const query = buildQuery(filters);

  return apiRequest(`/admin/expenses?${query}`);
};