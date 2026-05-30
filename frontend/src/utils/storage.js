const TOKEN_KEY = "expense_manager_token";

export const getStoredToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeStoredToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};