export const selectExchangeData = (state) => state.exchange.data;

export const selectExchangeBase = (state) => state.exchange.base;

export const selectExchangeRates = (state) => {
  return state.exchange.data?.rates || {};
};

export const selectExchangeDate = (state) => {
  return state.exchange.data?.date || null;
};

export const selectExchangeLoading = (state) => state.exchange.loading;

export const selectExchangeError = (state) => state.exchange.error;