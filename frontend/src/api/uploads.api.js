import { apiRequest } from "./apiClient.js";

export const uploadReceiptImageRequest = (file) => {
  const formData = new FormData();

  formData.append("image", file);

  return apiRequest("/uploads/receipt", {
    method: "POST",
    body: formData,
  });
};