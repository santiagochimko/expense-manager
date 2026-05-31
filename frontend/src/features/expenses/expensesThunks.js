import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createExpenseRequest,
  deleteExpenseRequest,
  getExpensesRequest,
  updateExpenseRequest
} from "../../api/expenses.api.js";

export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await getExpensesRequest(filters);

      return {
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
        data: response.data || []
      };
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        errors: error.errors || []
      });
    }
  }
);

export const createExpense = createAsyncThunk(
  "expenses/createExpense",
  async (expenseData, { rejectWithValue }) => {
    try {
      const response = await createExpenseRequest(expenseData);

      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        errors: error.errors || []
      });
    }
  }
);

export const updateExpense = createAsyncThunk(
  "expenses/updateExpense",
  async ({ expenseId, expenseData }, { rejectWithValue }) => {
    try {
      const response = await updateExpenseRequest(expenseId, expenseData);

      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        errors: error.errors || []
      });
    }
  }
);

export const deleteExpense = createAsyncThunk(
  "expenses/deleteExpense",
  async (expenseId, { rejectWithValue }) => {
    try {
      await deleteExpenseRequest(expenseId);

      return expenseId;
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        errors: error.errors || []
      });
    }
  }
);