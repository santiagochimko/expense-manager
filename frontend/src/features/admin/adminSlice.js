import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAdminDashboard,
  fetchAdminExpenses,
  fetchAdminUsers,
} from "./adminThunks.js";

const initialState = {
  dashboard: null,

  users: [],
  usersPage: 1,
  usersLimit: 10,
  usersTotal: 0,
  usersTotalPages: 1,
  usersFilters: {
    search: "",
    role: "",
    plan: "",
    page: 1,
    limit: 10,
  },

  expenses: [],
  expensesPage: 1,
  expensesLimit: 10,
  expensesTotal: 0,
  expensesTotalPages: 1,
  expensesFilters: {
    search: "",
    userId: "",
    category: "",
    isActive: "",
    page: 1,
    limit: 10,
  },

  loadingDashboard: false,
  loadingUsers: false,
  loadingExpenses: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdminUsersFilters: (state, action) => {
      state.usersFilters = {
        ...state.usersFilters,
        ...action.payload,
        page: 1,
      };
    },
    setAdminUsersPage: (state, action) => {
      state.usersFilters.page = action.payload;
    },
    setAdminExpensesFilters: (state, action) => {
      state.expensesFilters = {
        ...state.expensesFilters,
        ...action.payload,
        page: 1,
      };
    },
    setAdminExpensesPage: (state, action) => {
      state.expensesFilters.page = action.payload;
    },
    clearAdminError: (state) => {
      state.error = null;
    },
    clearAdmin: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.loadingDashboard = true;
        state.error = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.loadingDashboard = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.loadingDashboard = false;
        state.error =
          action.payload?.message || "No se pudo cargar el dashboard admin";
      })

      .addCase(fetchAdminUsers.pending, (state) => {
        state.loadingUsers = true;
        state.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        const payload = action.payload || {};

        state.loadingUsers = false;
        state.users = payload.data || [];
        state.usersPage = payload.page || state.usersFilters.page || 1;
        state.usersLimit = payload.limit || state.usersFilters.limit || 10;
        state.usersTotal = payload.total || 0;
        state.usersTotalPages = payload.totalPages || 1;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loadingUsers = false;
        state.error =
          action.payload?.message || "No se pudieron cargar los usuarios";
      })

      .addCase(fetchAdminExpenses.pending, (state) => {
        state.loadingExpenses = true;
        state.error = null;
      })
      .addCase(fetchAdminExpenses.fulfilled, (state, action) => {
        const payload = action.payload || {};

        state.loadingExpenses = false;
        state.expenses = payload.data || [];
        state.expensesPage =
          payload.page || state.expensesFilters.page || 1;
        state.expensesLimit =
          payload.limit || state.expensesFilters.limit || 10;
        state.expensesTotal = payload.total || 0;
        state.expensesTotalPages = payload.totalPages || 1;
      })
      .addCase(fetchAdminExpenses.rejected, (state, action) => {
        state.loadingExpenses = false;
        state.error =
          action.payload?.message || "No se pudieron cargar los gastos";
      });
  },
});

export const {
  setAdminUsersFilters,
  setAdminUsersPage,
  setAdminExpensesFilters,
  setAdminExpensesPage,
  clearAdminError,
  clearAdmin,
} = adminSlice.actions;

export default adminSlice.reducer;