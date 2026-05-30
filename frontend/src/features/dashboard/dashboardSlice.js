import { createSlice } from "@reduxjs/toolkit";
import {
  fetchDashboardCharts,
  fetchDashboardSummary
} from "./dashboardThunks.js";

const initialState = {
  summary: null,
  charts: null,
  loadingSummary: false,
  loadingCharts: false,
  error: null
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
    clearDashboard: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.loadingSummary = true;
        state.error = null;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.loadingSummary = false;
        state.summary = action.payload;
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.loadingSummary = false;
        state.error =
          action.payload?.message || "No se pudo cargar el resumen";
      })

      .addCase(fetchDashboardCharts.pending, (state) => {
        state.loadingCharts = true;
        state.error = null;
      })
      .addCase(fetchDashboardCharts.fulfilled, (state, action) => {
        state.loadingCharts = false;
        state.charts = action.payload;
      })
      .addCase(fetchDashboardCharts.rejected, (state, action) => {
        state.loadingCharts = false;
        state.error =
          action.payload?.message || "No se pudieron cargar los gráficos";
      });
  }
});

export const { clearDashboardError, clearDashboard } = dashboardSlice.actions;

export default dashboardSlice.reducer;