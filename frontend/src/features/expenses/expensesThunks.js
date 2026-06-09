import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createExpenseRequest,
  deleteExpenseRequest,
  getExpensesRequest,
  updateExpenseRequest,
} from "../../api/expenses.api.js";

const hydrateExpenseCategory = (expense, categories = []) => {
  if (!expense) {
    return expense;
  }

  const categoryId =
    typeof expense.category === "object"
      ? expense.category?._id
      : expense.category;

  const category = categories.find((item) => {
    return item?._id === categoryId;
  });

  return {
    ...expense,
    category: category || expense.category,
  };
};

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

export const createExpense = createAsyncThunk(
  "expenses/createExpense",
  async (expenseData, { rejectWithValue, getState }) => {
    try {
      const response = await createExpenseRequest(expenseData);

      const categories = getState().categories.items || [];

      return hydrateExpenseCategory(response.data, categories);
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        errors: error.errors || [],
      });
    }
  }
);

export const updateExpense = createAsyncThunk(
  "expenses/updateExpense",
  async ({ expenseId, expenseData }, { rejectWithValue, getState }) => {
    try {
      const response = await updateExpenseRequest(expenseId, expenseData);

      const categories = getState().categories.items || [];

      return hydrateExpenseCategory(response.data, categories);
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        errors: error.errors || [],
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
        errors: error.errors || [],
      });
    }
  }
);