import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createCategoryRequest,
  deleteCategoryRequest,
  getCategoriesRequest,
  updateCategoryRequest
} from "../../api/categories.api.js";

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCategoriesRequest();

      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        errors: error.errors || []
      });
    }
  }
);

export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await createCategoryRequest(categoryData);

      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        errors: error.errors || []
      });
    }
  }
);

export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ categoryId, categoryData }, { rejectWithValue }) => {
    try {
      const response = await updateCategoryRequest(categoryId, categoryData);

      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        errors: error.errors || []
      });
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      await deleteCategoryRequest(categoryId);

      return categoryId;
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        errors: error.errors || []
      });
    }
  }
);