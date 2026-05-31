import { createSlice } from "@reduxjs/toolkit";
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory
} from "./categoriesThunks.js";

const initialState = {
  items: [],
  loading: false,
  saving: false,
  deleting: false,
  error: null,
  validationErrors: []
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearCategoriesError: (state) => {
      state.error = null;
      state.validationErrors = [];
    },
    clearCategories: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "No se pudieron cargar las categorías";
      })

      .addCase(createCategory.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.validationErrors = [];
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.saving = false;
        state.items.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.saving = false;
        state.error =
          action.payload?.message || "No se pudo crear la categoría";
        state.validationErrors = action.payload?.errors || [];
      })

      .addCase(updateCategory.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.validationErrors = [];
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.saving = false;

        const updatedCategory = action.payload;
        const index = state.items.findIndex((item) => {
          return item._id === updatedCategory._id;
        });

        if (index !== -1) {
          state.items[index] = updatedCategory;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.saving = false;
        state.error =
          action.payload?.message || "No se pudo actualizar la categoría";
        state.validationErrors = action.payload?.errors || [];
      })

      .addCase(deleteCategory.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.deleting = false;

        state.items = state.items.filter((item) => {
          return item._id !== action.payload;
        });
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.deleting = false;
        state.error =
          action.payload?.message || "No se pudo eliminar la categoría";
      });
  }
});

export const { clearCategoriesError, clearCategories } = categoriesSlice.actions;

export default categoriesSlice.reducer;