import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import ConfirmDialog from "../common/ConfirmDialog.jsx";
import ExpenseForm from "./ExpenseForm.jsx";
import ExpensesFilters from "./ExpensesFilters.jsx";
import ExpensesPagination from "./ExpensesPagination.jsx";
import ExpensesTable from "./ExpensesTable.jsx";

import { fetchCategories } from "../../features/categories/categoriesThunks.js";
import {
  selectCategories,
  selectCategoriesLoading,
} from "../../features/categories/categoriesSelectors.js";

import {
  clearExpensesError,
  setExpenseFilters,
  setExpensePage,
} from "../../features/expenses/expensesSlice.js";
import {
  createExpense,
  deleteExpense,
  fetchExpenses,
  updateExpense,
} from "../../features/expenses/expensesThunks.js";
import {
  selectExpenses,
  selectExpensesDeleting,
  selectExpensesError,
  selectExpensesFilters,
  selectExpensesLoading,
  selectExpensesPage,
  selectExpensesSaving,
  selectExpensesTotal,
  selectExpensesTotalPages,
  selectExpensesValidationErrors,
} from "../../features/expenses/expensesSelectors.js";

import { suggestCategory } from "../../features/ai/aiThunks.js";
import {
  selectAiError,
  selectAiLoading,
  selectAiSuggestion,
} from "../../features/ai/aiSelectors.js";
import { clearAiSuggestion } from "../../features/ai/aiSlice.js";
import {
  fetchDashboardCharts,
  fetchDashboardSummary,
} from "../../features/dashboard/dashboardThunks.js";

const ExpensesSection = () => {
  const dispatch = useDispatch();

  const categories = useSelector(selectCategories) || [];
  const categoriesLoading = useSelector(selectCategoriesLoading);

  const expenses = useSelector(selectExpenses) || [];
  const filters = useSelector(selectExpensesFilters);
  const loading = useSelector(selectExpensesLoading);
  const saving = useSelector(selectExpensesSaving);
  const deleting = useSelector(selectExpensesDeleting);
  const error = useSelector(selectExpensesError);
  const validationErrors = useSelector(selectExpensesValidationErrors);
  const page = useSelector(selectExpensesPage);
  const total = useSelector(selectExpensesTotal);
  const totalPages = useSelector(selectExpensesTotalPages);

  const aiLoading = useSelector(selectAiLoading);
  const aiError = useSelector(selectAiError);
  const aiSuggestion = useSelector(selectAiSuggestion);

  const [selectedExpense, setSelectedExpense] = useState(null);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [localFilters, setLocalFilters] = useState({
    search: "",
    category: "",
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchExpenses(filters));
  }, [dispatch, filters]);

  const refreshDashboard = () => {
    dispatch(fetchDashboardSummary());
    dispatch(fetchDashboardCharts());
  };

  const handleSuggestCategory = async (expenseData) => {
    dispatch(clearAiSuggestion());

    const result = await dispatch(suggestCategory(expenseData));

    if (suggestCategory.fulfilled.match(result)) {
      return result.payload;
    }

    return null;
  };

  const handleSubmit = async (expenseData) => {
    const result = selectedExpense
      ? await dispatch(
          updateExpense({
            expenseId: selectedExpense._id,
            expenseData,
          }),
        )
      : await dispatch(createExpense(expenseData));

    if (
      createExpense.fulfilled.match(result) ||
      updateExpense.fulfilled.match(result)
    ) {
      setSelectedExpense(null);
      dispatch(clearExpensesError());
      dispatch(clearAiSuggestion());
      dispatch(fetchExpenses(filters));
      refreshDashboard();
    }
  };

  const handleEdit = (expense) => {
    dispatch(clearExpensesError());
    dispatch(clearAiSuggestion());
    setSelectedExpense(expense);
  };

  const handleCancelEdit = () => {
    dispatch(clearExpensesError());
    dispatch(clearAiSuggestion());
    setSelectedExpense(null);
  };

  const handleRequestDelete = (expense) => {
    setExpenseToDelete(expense);
  };

  const handleCloseDeleteDialog = () => {
    if (!deleting) {
      setExpenseToDelete(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!expenseToDelete) {
      return;
    }

    const result = await dispatch(deleteExpense(expenseToDelete._id));

    if (deleteExpense.fulfilled.match(result)) {
      dispatch(fetchExpenses(filters));
      refreshDashboard();

      if (selectedExpense?._id === expenseToDelete._id) {
        setSelectedExpense(null);
      }

      setExpenseToDelete(null);
    }
  };

  const handleApplyFilters = (nextFilters) => {
    dispatch(setExpenseFilters(nextFilters || localFilters));
  };

  const handleClearFilters = () => {
    const emptyFilters = {
      search: "",
      category: "",
    };

    setLocalFilters(emptyFilters);
    dispatch(setExpenseFilters(emptyFilters));
  };

  const handlePageChange = (newPage) => {
    dispatch(setExpensePage(newPage));
  };

  const handleReload = () => {
    dispatch(fetchCategories());
    dispatch(fetchExpenses(filters));
  };

  if (loading && expenses.length === 0) {
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
      <Stack spacing={2}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <div>
            <Typography variant="h5" component="h2">
              Gastos
            </Typography>

            <Typography color="text.secondary">
              Registrá, filtrá y administrá tus gastos.
            </Typography>
          </div>

          <Button
            variant="outlined"
            onClick={handleReload}
            disabled={loading || categoriesLoading}
          >
            Actualizar
          </Button>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "minmax(280px, 420px) 1fr",
            },
            gap: 3,
          }}
        >
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              {selectedExpense ? "Editar gasto" : "Nuevo gasto"}
            </Typography>

            {categories.length === 0 ? (
              <Alert severity="info">
                Para crear gastos primero necesitás crear al menos una
                categoría.
              </Alert>
            ) : (
              <ExpenseForm
                key={selectedExpense?._id || "new-expense"}
                selectedExpense={selectedExpense}
                categories={categories}
                validationErrors={validationErrors}
                saving={saving}
                aiLoading={aiLoading}
                aiError={aiError}
                aiSuggestion={aiSuggestion}
                onSubmit={handleSubmit}
                onCancel={handleCancelEdit}
                onSuggestCategory={handleSuggestCategory}
              />
            )}
          </Paper>

          <Stack spacing={2}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" component="h3" gutterBottom>
                Filtros
              </Typography>

              <ExpensesFilters
                filters={localFilters}
                categories={categories}
                onChange={setLocalFilters}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
              />
            </Paper>

            <ExpensesTable
              expenses={expenses || []}
              deleting={deleting}
              onEdit={handleEdit}
              onDelete={handleRequestDelete}
            />

            <ExpensesPagination
              page={page}
              total={total}
              totalPages={totalPages}
              loading={loading}
              onPageChange={handlePageChange}
            />
          </Stack>
        </Box>
      </Stack>

      <ConfirmDialog
        open={Boolean(expenseToDelete)}
        title="Eliminar gasto"
        description={
          expenseToDelete
            ? `¿Seguro que querés eliminar el gasto "${expenseToDelete.title}"? Esta acción no se puede deshacer.`
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

export default ExpensesSection;
