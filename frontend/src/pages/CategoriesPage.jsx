import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography
} from "@mui/material";

import CategoryForm from "../components/categories/CategoryForm.jsx";
import CategoriesTable from "../components/categories/CategoriesTable.jsx";
import {
  clearCategoriesError
} from "../features/categories/categoriesSlice.js";
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory
} from "../features/categories/categoriesThunks.js";
import {
  selectCategories,
  selectCategoriesDeleting,
  selectCategoriesError,
  selectCategoriesLoading,
  selectCategoriesSaving,
  selectCategoriesValidationErrors
} from "../features/categories/categoriesSelectors.js";

const CategoriesPage = () => {
  const dispatch = useDispatch();

  const categories = useSelector(selectCategories);
  const loading = useSelector(selectCategoriesLoading);
  const saving = useSelector(selectCategoriesSaving);
  const deleting = useSelector(selectCategoriesDeleting);
  const error = useSelector(selectCategoriesError);
  const validationErrors = useSelector(selectCategoriesValidationErrors);

  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = async (categoryData) => {
    const result = selectedCategory
      ? await dispatch(
          updateCategory({
            categoryId: selectedCategory._id,
            categoryData
          })
        )
      : await dispatch(createCategory(categoryData));

    if (
      createCategory.fulfilled.match(result) ||
      updateCategory.fulfilled.match(result)
    ) {
      setSelectedCategory(null);
      dispatch(clearCategoriesError());
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

  const handleDelete = async (categoryId) => {
    const confirmDelete = window.confirm(
      "¿Seguro que querés eliminar esta categoría?"
    );

    if (!confirmDelete) {
      return;
    }

    await dispatch(deleteCategory(categoryId));

    if (selectedCategory?._id === categoryId) {
      setSelectedCategory(null);
    }
  };

  const handleReload = () => {
    dispatch(fetchCategories());
  };

  if (loading && categories.length === 0) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", minHeight: 300 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Categorías
          </Typography>

          <Typography color="text.secondary">
            Creá y administrá las categorías que usás para clasificar tus gastos.
          </Typography>
        </Box>

        <Button variant="outlined" onClick={handleReload} disabled={loading}>
          Actualizar
        </Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              {selectedCategory ? "Editar categoría" : "Nueva categoría"}
            </Typography>

            <CategoryForm
              selectedCategory={selectedCategory}
              validationErrors={validationErrors}
              saving={saving}
              onSubmit={handleSubmit}
              onCancel={handleCancelEdit}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <CategoriesTable
            categories={categories}
            deleting={deleting}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default CategoriesPage;