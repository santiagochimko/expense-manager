import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import dashboardReducer from "../features/dashboard/dashboardSlice.js";
import categoriesReducer from "../features/categories/categoriesSlice.js";
import expensesReducer from "../features/expenses/expensesSlice.js";
import aiReducer from "../features/ai/aiSlice.js";
import exchangeReducer from "../features/exchange/exchangeSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    categories: categoriesReducer,
    expenses: expensesReducer,
    ai: aiReducer,
    exchange: exchangeReducer,
  }
});