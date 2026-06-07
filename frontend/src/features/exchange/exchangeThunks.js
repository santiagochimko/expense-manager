import { createAsyncThunk } from "@reduxjs/toolkit";
import { getExchangeRatesRequest } from "../../api/exchange.api.js";

export const fetchExchangeRates = createAsyncThunk(
  "exchange/fetchExchangeRates",
  async (base, { rejectWithValue }) => {
    try {
      const response = await getExchangeRatesRequest(base);

      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        errors: error.errors || [],
      });
    }
  }
);