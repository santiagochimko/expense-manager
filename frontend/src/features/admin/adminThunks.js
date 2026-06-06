import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAdminDashboardRequest,
  getAdminExpensesRequest,
  getAdminUsersRequest,
} from "../../api/admin.api.js";

export const fetchAdminDashboard = createAsyncThunk(
  "admin/fetchAdminDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAdminDashboardRequest();

      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        errors: error.errors || [],
      });
    }
  }
);

export const fetchAdminUsers = createAsyncThunk(
  "admin/fetchAdminUsers",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await getAdminUsersRequest(filters);

      return {
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
        data: response.data || [],
      };
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        errors: error.errors || [],
      });
    }
  }
);

export const fetchAdminExpenses = createAsyncThunk(
  "admin/fetchAdminExpenses",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await getAdminExpensesRequest(filters);

      return {
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
        data: response.data || [],
      };
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        errors: error.errors || [],
      });
    }
  }
);