import { createSlice } from "@reduxjs/toolkit";
import {
  fetchDashboardCategoryReport,
  fetchDashboardCharts,
  fetchDashboardSummary
} from "./dashboardThunks.js";

const initialState = {
  summary: null,
  charts: null,
  categoryReport: null,
  loadingSummary: false,
  loadingCharts: false,
  loadingCategoryReport: false,
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
      })

      .addCase(fetchDashboardCategoryReport.pending, (state) => {
        state.loadingCategoryReport = true;
        state.error = null;
      })
      .addCase(fetchDashboardCategoryReport.fulfilled, (state, action) => {
        state.loadingCategoryReport = false;
        state.categoryReport = action.payload;
      })
      .addCase(fetchDashboardCategoryReport.rejected, (state, action) => {
        state.loadingCategoryReport = false;
        state.error =
          action.payload?.message || "No se pudo cargar el reporte por categorías";
      });
  }
});

export const { clearDashboardError, clearDashboard } = dashboardSlice.actions;

export default dashboardSlice.reducer;