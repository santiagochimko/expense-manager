import { createSlice } from "@reduxjs/toolkit";
import {
  createExpense,
  deleteExpense,
  fetchExpenses,
  updateExpense,
} from "./expensesThunks.js";

const initialState = {
  items: [],
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
  filters: {
    search: "",
    category: "",
    page: 1,
    limit: 10,
  },
  loading: false,
  saving: false,
  deleting: false,
  error: null,
  validationErrors: [],
};

const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    setExpenseFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
        page: 1,
      };
    },
    setExpensePage: (state, action) => {
      state.filters.page = action.payload;
    },
    clearExpensesError: (state) => {
      state.error = null;
      state.validationErrors = [];
    },
    clearExpenses: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;

        const payload = action.payload || {};

        state.items = payload.data || [];
        state.page = payload.page || state.filters.page || 1;
        state.limit = payload.limit || state.filters.limit || 10;
        state.total = payload.total || 0;
        state.totalPages = payload.totalPages || 1;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "No se pudieron cargar los gastos";
      })

      .addCase(createExpense.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.validationErrors = [];
      })
      .addCase(createExpense.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload?.message || "No se pudo crear el gasto";
        state.validationErrors = action.payload?.errors || [];
      })

      .addCase(updateExpense.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.validationErrors = [];
      })
      .addCase(updateExpense.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.saving = false;
        state.error =
          action.payload?.message || "No se pudo actualizar el gasto";
        state.validationErrors = action.payload?.errors || [];
      })

      .addCase(deleteExpense.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.deleting = false;
        state.items = state.items.filter((item) => {
          return item._id !== action.payload;
        });
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.deleting = false;
        state.error =
          action.payload?.message || "No se pudo eliminar el gasto";
      });
  },
});

export const {
  setExpenseFilters,
  setExpensePage,
  clearExpensesError,
  clearExpenses,
} = expensesSlice.actions;

export default expensesSlice.reducer;