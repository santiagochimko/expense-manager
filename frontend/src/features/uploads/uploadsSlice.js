import { createSlice } from "@reduxjs/toolkit";
import { uploadReceiptImage } from "./uploadsThunks.js";

const initialState = {
  image: null,
  loading: false,
  error: null,
};

const uploadsSlice = createSlice({
  name: "uploads",
  initialState,
  reducers: {
    clearUpload: () => initialState,
    clearUploadError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadReceiptImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadReceiptImage.fulfilled, (state, action) => {
        state.loading = false;
        state.image = action.payload;
      })
      .addCase(uploadReceiptImage.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "No se pudo subir la imagen";
      });
  },
});

export const { clearUpload, clearUploadError } = uploadsSlice.actions;

export default uploadsSlice.reducer;