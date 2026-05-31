import { createAsyncThunk } from "@reduxjs/toolkit";
import { suggestCategoryRequest } from "../../api/ai.api.js";

export const suggestCategory = createAsyncThunk(
  "ai/suggestCategory",
  async (expenseData, { rejectWithValue }) => {
    try {
      const response = await suggestCategoryRequest(expenseData);

      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        errors: error.errors || []
      });
    }
  }
);