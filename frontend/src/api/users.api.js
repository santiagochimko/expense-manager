import { apiRequest } from "./apiClient.js";

export const updateMyPlanRequest = (plan) => {
  return apiRequest("/users/me/plan", {
    method: "PATCH",
    body: JSON.stringify({ plan }),
  });
};