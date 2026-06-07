import { createAsyncThunk } from "@reduxjs/toolkit";
import { uploadReceiptImageRequest } from "../../api/uploads.api.js";

export const uploadReceiptImage = createAsyncThunk(
  "uploads/uploadReceiptImage",
  async (file, { rejectWithValue }) => {
    try {
      const response = await uploadReceiptImageRequest(file);

      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        errors: error.errors || [],
      });
    }
  }
);