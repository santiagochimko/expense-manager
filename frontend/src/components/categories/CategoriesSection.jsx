import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import ConfirmDialog from "../common/ConfirmDialog.jsx";
import CategoryForm from "./CategoryForm.jsx";
import CategoriesTable from "./CategoriesTable.jsx";
import { clearCategoriesError } from "../../features/categories/categoriesSlice.js";
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from "../../features/categories/categoriesThunks.js";
import {
  selectCategories,
  selectCategoriesDeleting,
  selectCategoriesError,
  selectCategoriesLoading,
  selectCategoriesSaving,
  selectCategoriesValidationErrors,
} from "../../features/categories/categoriesSelectors.js";
import { fetchDashboardCharts } from "../../features/dashboard/dashboardThunks.js";

const CategoriesSection = () => {
  const dispatch = useDispatch();

  const categories = useSelector(selectCategories) || [];
  const loading = useSelector(selectCategoriesLoading);
  const saving = useSelector(selectCategoriesSaving);
  const deleting = useSelector(selectCategoriesDeleting);
  const error = useSelector(selectCategoriesError);
  const validationErrors = useSelector(selectCategoriesValidationErrors);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [formResetKey, setFormResetKey] = useState(0);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = async (categoryData) => {
    const result = selectedCategory
      ? await dispatch(
          updateCategory({
            categoryId: selectedCategory._id,
            categoryData,
          }),
        )
      : await dispatch(createCategory(categoryData));

    if (
      createCategory.fulfilled.match(result) ||
      updateCategory.fulfilled.match(result)
    ) {
      setSelectedCategory(null);
      dispatch(clearCategoriesError());

      if (createCategory.fulfilled.match(result)) {
        setFormResetKey((current) => current + 1);
      }
    }
  };

  const handleEdit = (category) => {
    dispatch(clearCategoriesError());
    setSelectedCategory(category);
  };

  const handleCancelEdit = () => {
    dispatch(clearCategoriesError());
    setSelectedCategory(null);
  };

  const handleRequestDelete = (category) => {
    setCategoryToDelete(category);
  };

  const handleCloseDeleteDialog = () => {
    if (!deleting) {
      setCategoryToDelete(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) {
      return;
    }

    const result = await dispatch(deleteCategory(categoryToDelete._id));

    if (deleteCategory.fulfilled.match(result)) {
      dispatch(fetchDashboardCharts());

      if (selectedCategory?._id === categoryToDelete._id) {
        setSelectedCategory(null);
      }

      setCategoryToDelete(null);
    }
  };

  if (loading && categories.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: "grid", placeItems: "center", minHeight: 180 }}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  return (
    <>
      <Stack spacing={3}>
        {error && <Alert severity="error">{error}</Alert>}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "minmax(300px, 420px) 1fr",
            },
            gap: { xs: 2.5, md: 3 },
            alignItems: "start",
          }}
        >
          <Paper sx={{ p: { xs: 2.5, sm: 3 }, position: { lg: "sticky" }, top: 108 }}>
            <Stack spacing={0.75} sx={{ mb: 2.5 }}>
              <Typography variant="h6" component="h2">
                {selectedCategory ? "Editar categoría" : "Nueva categoría"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Definí nombre, descripción y color para mantener tus gastos ordenados.
              </Typography>
            </Stack>

            <CategoryForm
              key={`${selectedCategory?._id || "new-category"}-${formResetKey}`}
              selectedCategory={selectedCategory}
              validationErrors={validationErrors}
              saving={saving}
              onSubmit={handleSubmit}
              onCancel={handleCancelEdit}
            />
          </Paper>

          <CategoriesTable
            categories={categories}
            deleting={deleting}
            onEdit={handleEdit}
            onDelete={handleRequestDelete}
          />
        </Box>
      </Stack>

      <ConfirmDialog
        open={Boolean(categoryToDelete)}
        title="Eliminar categoría"
        description={
          categoryToDelete
            ? `¿Seguro que querés eliminar la categoría "${categoryToDelete.name}"? Esta acción no se puede deshacer.`
            : ""
        }
        confirmText="Eliminar"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onClose={handleCloseDeleteDialog}
      />
    </>
  );
};

export default CategoriesSection;
