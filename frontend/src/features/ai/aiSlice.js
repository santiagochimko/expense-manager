import { createSlice } from "@reduxjs/toolkit";
import { suggestCategory } from "./aiThunks.js";

const initialState = {
  suggestion: null,
  loading: false,
  error: null
};

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    clearAiSuggestion: (state) => {
      state.suggestion = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(suggestCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.suggestion = null;
      })
      .addCase(suggestCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.suggestion = action.payload;
      })
      .addCase(suggestCategory.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "No se pudo sugerir una categoría";
      });
  }
});

export const { clearAiSuggestion } = aiSlice.actions;

export default aiSlice.reducer;