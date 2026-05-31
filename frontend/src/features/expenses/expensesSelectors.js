export const selectExpenses = (state) => state.expenses.items || [];

export const selectExpensesFilters = (state) => {
    return state.expenses.filters || {
        search: "",
        category: "",
        page: 1,
        limit: 10
    };
};

export const selectExpensesLoading = (state) => state.expenses.loading;

export const selectExpensesSaving = (state) => state.expenses.saving;

export const selectExpensesDeleting = (state) => state.expenses.deleting;

export const selectExpensesError = (state) => state.expenses.error;

export const selectExpensesValidationErrors = (state) => {
    return state.expenses.validationErrors;
};

export const selectExpensesPage = (state) => state.expenses.page;

export const selectExpensesLimit = (state) => state.expenses.limit;

export const selectExpensesTotal = (state) => state.expenses.total;

export const selectExpensesTotalPages = (state) => state.expenses.totalPages;