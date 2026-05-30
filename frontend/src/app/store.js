import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import dashboardReducer from "../features/dashboard/dashboardSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer
  }
});