import { createSlice } from "@reduxjs/toolkit";
import { getStoredToken, removeStoredToken } from "../../utils/storage.js";
import {
  getUserFromToken,
  isTokenExpired
} from "../../utils/token.js";
import {
  loadCurrentUser,
  loginUser,
  registerUser,
  updateMyPlan,
} from "./authThunks.js";

const storedToken = getStoredToken();
const tokenIsValid = storedToken && !isTokenExpired(storedToken);
const userFromToken = tokenIsValid ? getUserFromToken(storedToken) : null;

if (storedToken && !tokenIsValid) {
  removeStoredToken();
}

const initialState = {
  user: userFromToken,
  token: tokenIsValid ? storedToken : null,
  isAuthenticated: Boolean(tokenIsValid),
  loading: false,
  initialized: !tokenIsValid,
  error: null,
  validationErrors: []
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      removeStoredToken();

      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.initialized = true;
      state.error = null;
      state.validationErrors = [];
    },
    clearAuthError: (state) => {
      state.error = null;
      state.validationErrors = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.validationErrors = [];
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload?.message || "No se pudo registrar el usuario";
        state.validationErrors = action.payload?.errors || [];
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.validationErrors = [];
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload?.message || "No se pudo iniciar sesión";
        state.validationErrors = action.payload?.errors || [];
      })

      .addCase(loadCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loadCurrentUser.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(updateMyPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.validationErrors = [];
      })
    .addCase(updateMyPlan.fulfilled, (state, action) => {
      state.loading = false;

      if (state.user) {
        state.user.plan = action.payload.plan;
      }
    })
    .addCase(updateMyPlan.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "No se pudo actualizar el plan";
      state.validationErrors = action.payload?.errors || [];
    });
}
});

export const { logout, clearAuthError } = authSlice.actions;

export default authSlice.reducer;