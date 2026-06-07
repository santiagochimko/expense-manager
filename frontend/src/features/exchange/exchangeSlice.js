import { createSlice } from "@reduxjs/toolkit";
import { fetchExchangeRates } from "./exchangeThunks.js";

const initialState = {
  data: null,
  base: "USD",
  loading: false,
  error: null,
};

const exchangeSlice = createSlice({
  name: "exchange",
  initialState,
  reducers: {
    clearExchangeError: (state) => {
      state.error = null;
    },
    clearExchange: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExchangeRates.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.base = action.meta.arg || "USD";
      })
      .addCase(fetchExchangeRates.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.base = action.payload?.base || state.base;
      })
      .addCase(fetchExchangeRates.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "No se pudo obtener el tipo de cambio";
      });
  },
});

export const { clearExchangeError, clearExchange } = exchangeSlice.actions;

export default exchangeSlice.reducer;