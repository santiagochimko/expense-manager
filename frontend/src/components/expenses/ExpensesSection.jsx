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
import ExpenseForm from "./ExpenseForm.jsx";
import ExpensesFilters from "./ExpensesFilters.jsx";
import ExpensesPagination from "./ExpensesPagination.jsx";
import ExpensesTable from "./ExpensesTable.jsx";

import { fetchCategories } from "../../features/categories/categoriesThunks.js";
import { selectCategories } from "../../features/categories/categoriesSelectors.js";

import {
  clearExpensesError,
  setExpenseFilters,
  setExpensePage,
  setExpenseSort,
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
  const [formResetKey, setFormResetKey] = useState(0);
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

  const syncExpensesAndDashboard = () => {
    dispatch(fetchExpenses(filters));
    refreshDashboard();
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
          })
        )
      : await dispatch(createExpense(expenseData));

    if (
      createExpense.fulfilled.match(result) ||
      updateExpense.fulfilled.match(result)
    ) {
      const wasCreating = createExpense.fulfilled.match(result);

      setSelectedExpense(null);
      dispatch(clearExpensesError());
      dispatch(clearAiSuggestion());

      if (wasCreating) {
        setFormResetKey((current) => current + 1);
      }

      syncExpensesAndDashboard();
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
      if (selectedExpense?._id === expenseToDelete._id) {
        setSelectedExpense(null);
      }

      setExpenseToDelete(null);

      syncExpensesAndDashboard();
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

  const handleSortChange = (sortBy) => {
    dispatch(setExpenseSort(sortBy));
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
      <Stack spacing={3}>
        {error && <Alert severity="error">{error}</Alert>}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              xl: "minmax(320px, 460px) 1fr",
            },
            gap: { xs: 2.5, md: 3 },
            alignItems: "start",
          }}
        >
          <Paper sx={{ p: { xs: 2.5, sm: 3 }, position: { xl: "sticky" }, top: 108 }}>
            <Stack spacing={0.75} sx={{ mb: 2.5 }}>
              <Typography variant="h6" component="h2">
                {selectedExpense ? "Editar gasto" : "Nuevo gasto"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Registrá movimientos con categoría, método de pago, moneda y comprobante opcional.
              </Typography>
            </Stack>

            {categories.length === 0 ? (
              <Alert severity="info">
                Para crear gastos primero necesitás crear al menos una categoría.
              </Alert>
            ) : (
              <ExpenseForm
                key={`${selectedExpense?._id || "new-expense"}-${formResetKey}`}
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

          <Stack spacing={2.5}>
            <Paper sx={{ p: { xs: 2.5, sm: 3 } }}>
              <Stack spacing={0.75} sx={{ mb: 2.5 }}>
                <Typography variant="h6" component="h2">
                  Filtros
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Buscá por título o filtrá por categoría sin perder el contexto del paginado.
                </Typography>
              </Stack>

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
              sortBy={filters.sortBy || "date"}
              sortOrder={filters.sortOrder || "desc"}
              onSortChange={handleSortChange}
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