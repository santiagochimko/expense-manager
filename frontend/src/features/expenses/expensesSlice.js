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
    sortBy: "date",
    sortOrder: "desc",
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

    setExpenseSort: (state, action) => {
      const sortBy = action.payload;

      if (!["date", "amount"].includes(sortBy)) {
        return;
      }

      const isSameColumn = state.filters.sortBy === sortBy;

      state.filters.sortBy = sortBy;
      state.filters.sortOrder = isSameColumn && state.filters.sortOrder === "desc" ? "asc" : "desc";
      state.filters.page = 1;
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

      .addCase(createExpense.fulfilled, (state, action) => {
        state.saving = false;

        const newExpense = action.payload;

        if (newExpense && state.page === 1) {
          state.items.unshift(newExpense);

          if (state.items.length > state.limit) {
            state.items.pop();
          }
        }

        state.total += 1;
        state.totalPages = Math.max(1, Math.ceil(state.total / state.limit));
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

      .addCase(updateExpense.fulfilled, (state, action) => {
        state.saving = false;

        const updatedExpense = action.payload;

        const index = state.items.findIndex((item) => {
          return item?._id === updatedExpense?._id;
        });

        if (index !== -1) {
          state.items[index] = updatedExpense;
        }
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
          return item?._id !== action.payload;
        });

        if (state.total > 0) {
          state.total -= 1;
        }

        state.totalPages = Math.max(1, Math.ceil(state.total / state.limit));

        if (state.page > state.totalPages) {
          state.page = state.totalPages;
          state.filters.page = state.totalPages;
        }
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
  setExpenseSort,
  clearExpensesError,
  clearExpenses,
} = expensesSlice.actions;

export default expensesSlice.reducer;