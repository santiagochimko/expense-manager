import { apiRequest } from "./apiClient.js";

export const getExchangeRatesRequest = (base = "USD") => {
  const params = new URLSearchParams();

  if (base) {
    params.set("base", base);
  }

  return apiRequest(`/exchange-rates?${params.toString()}`);
};