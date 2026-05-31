import { apiRequest } from "./apiClient.js";

export const getCategoriesRequest = () => {
  return apiRequest("/categories");
};

export const createCategoryRequest = (categoryData) => {
  return apiRequest("/categories", {
    method: "POST",
    body: JSON.stringify(categoryData)
  });
};

export const updateCategoryRequest = (categoryId, categoryData) => {
  return apiRequest(`/categories/${categoryId}`, {
    method: "PATCH",
    body: JSON.stringify(categoryData)
  });
};

export const deleteCategoryRequest = (categoryId) => {
  return apiRequest(`/categories/${categoryId}`, {
    method: "DELETE"
  });
};