//los componentes toman una porción del store y se re-renderizan cuando cambia
export const selectAuth = (state) => state.auth;

export const selectUser = (state) => state.auth.user;

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export const selectAuthLoading = (state) => state.auth.loading;

export const selectAuthInitialized = (state) => state.auth.initialized;

export const selectAuthError = (state) => state.auth.error;

export const selectAuthValidationErrors = (state) => state.auth.validationErrors;

export const selectIsAdmin = (state) => {
  return state.auth.user?.role === "admin";
};