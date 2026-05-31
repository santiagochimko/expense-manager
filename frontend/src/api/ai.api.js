import { apiRequest } from "./apiClient.js";

export const suggestCategoryRequest = (expenseData) => {
  return apiRequest("/ai/suggest-category", {
    method: "POST",
    body: JSON.stringify(expenseData)
  });
};