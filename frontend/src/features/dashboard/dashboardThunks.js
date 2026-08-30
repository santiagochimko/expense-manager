import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getDashboardCategoryReportRequest,
  getDashboardChartsRequest,
  getDashboardSummaryRequest
} from "../../api/dashboard.api.js";

export const fetchDashboardSummary = createAsyncThunk(
  "dashboard/fetchDashboardSummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getDashboardSummaryRequest();

      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        errors: error.errors || []
      });
    }
  }
);

export const fetchDashboardCharts = createAsyncThunk(
  "dashboard/fetchDashboardCharts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getDashboardChartsRequest();

      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        errors: error.errors || []
      });
    }
  }
);

export const fetchDashboardCategoryReport = createAsyncThunk(
  "dashboard/fetchDashboardCategoryReport",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await getDashboardCategoryReportRequest(filters);

      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        errors: error.errors || []
      });
    }
  }
);