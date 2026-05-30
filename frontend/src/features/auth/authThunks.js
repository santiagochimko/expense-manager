//Los thunks hacen las llamadas asincrónicas y devuelven datos al slice.

import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getMeRequest,
  loginRequest,
  registerRequest
} from "../../api/auth.api.js";
import {
  removeStoredToken,
  setStoredToken
} from "../../utils/storage.js";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerRequest(userData);
      const { user, token } = response.data;

      setStoredToken(token);

      return { user, token };
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        errors: error.errors || []
      });
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginRequest(credentials);
      const { user, token } = response.data;

      setStoredToken(token);

      return { user, token };
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        errors: error.errors || []
      });
    }
  }
);

export const loadCurrentUser = createAsyncThunk(
  "auth/loadCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMeRequest();

      return response.data;
    } catch (error) {
      removeStoredToken();

      return rejectWithValue({
        message: error.message,
        errors: error.errors || []
      });
    }
  }
);