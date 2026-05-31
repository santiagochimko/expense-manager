export const selectCategories = (state) => state.categories.items;

export const selectCategoriesLoading = (state) => state.categories.loading;

export const selectCategoriesSaving = (state) => state.categories.saving;

export const selectCategoriesDeleting = (state) => state.categories.deleting;

export const selectCategoriesError = (state) => state.categories.error;

export const selectCategoriesValidationErrors = (state) => {
  return state.categories.validationErrors;
};