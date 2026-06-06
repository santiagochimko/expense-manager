export const selectAdminDashboard = (state) => state.admin.dashboard;

export const selectAdminUsers = (state) => state.admin.users || [];

export const selectAdminExpenses = (state) => state.admin.expenses || [];

export const selectAdminUsersFilters = (state) => {
  return state.admin.usersFilters || {
    search: "",
    role: "",
    plan: "",
    page: 1,
    limit: 10,
  };
};

export const selectAdminExpensesFilters = (state) => {
  return state.admin.expensesFilters || {
    search: "",
    userId: "",
    category: "",
    isActive: "",
    page: 1,
    limit: 10,
  };
};

export const selectAdminLoadingDashboard = (state) => {
  return state.admin.loadingDashboard;
};

export const selectAdminLoadingUsers = (state) => state.admin.loadingUsers;

export const selectAdminLoadingExpenses = (state) => {
  return state.admin.loadingExpenses;
};

export const selectAdminError = (state) => state.admin.error;

export const selectAdminUsersPagination = (state) => {
  return {
    page: state.admin.usersPage,
    total: state.admin.usersTotal,
    totalPages: state.admin.usersTotalPages,
  };
};

export const selectAdminExpensesPagination = (state) => {
  return {
    page: state.admin.expensesPage,
    total: state.admin.expensesTotal,
    totalPages: state.admin.expensesTotalPages,
  };
};