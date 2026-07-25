import { apiRequest } from "./apiClient.js";

const buildExpensesQuery = (filters = {}) => {
  const params = new URLSearchParams();

  params.set("page", filters.page || 1);
  params.set("limit", filters.limit || 10);
  params.set("sortBy", filters.sortBy || "date");
  params.set("sortOrder", filters.sortOrder || "desc");

  if (filters.search) {
    params.set("search", filters.search);
  }

  if (filters.category) {
    params.set("category", filters.category);
  }

  return params.toString();
};

export const getExpensesRequest = (filters) => {
  const query = buildExpensesQuery(filters);

  return apiRequest(`/expenses?${query}`);
};

export const createExpenseRequest = (expenseData) => {
  return apiRequest("/expenses", {
    method: "POST",
    body: JSON.stringify(expenseData)
  });
};

export const updateExpenseRequest = (expenseId, expenseData) => {
  return apiRequest(`/expenses/${expenseId}`, {
    method: "PATCH",
    body: JSON.stringify(expenseData)
  });
};

export const deleteExpenseRequest = (expenseId) => {
  return apiRequest(`/expenses/${expenseId}`, {
    method: "DELETE"
  });
};