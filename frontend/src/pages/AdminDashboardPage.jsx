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

import AdminSummary from "../components/admin/AdminSummary.jsx";
import AdminUsersFilters from "../components/admin/AdminUsersFilters.jsx";
import AdminUsersTable from "../components/admin/AdminUsersTable.jsx";
import AdminExpensesFilters from "../components/admin/AdminExpensesFilters.jsx";
import AdminExpensesTable from "../components/admin/AdminExpensesTable.jsx";
import AdminPagination from "../components/admin/AdminPagination.jsx";

import {
  setAdminExpensesFilters,
  setAdminExpensesPage,
  setAdminUsersFilters,
  setAdminUsersPage,
} from "../features/admin/adminSlice.js";
import {
  fetchAdminDashboard,
  fetchAdminExpenses,
  fetchAdminUsers,
} from "../features/admin/adminThunks.js";
import {
  selectAdminDashboard,
  selectAdminError,
  selectAdminExpenses,
  selectAdminExpensesFilters,
  selectAdminExpensesPagination,
  selectAdminLoadingDashboard,
  selectAdminLoadingExpenses,
  selectAdminLoadingUsers,
  selectAdminUsers,
  selectAdminUsersFilters,
  selectAdminUsersPagination,
} from "../features/admin/adminSelectors.js";

const AdminDashboardPage = () => {
  const dispatch = useDispatch();

  const dashboard = useSelector(selectAdminDashboard);
  const users = useSelector(selectAdminUsers);
  const expenses = useSelector(selectAdminExpenses);

  const usersFilters = useSelector(selectAdminUsersFilters);
  const expensesFilters = useSelector(selectAdminExpensesFilters);

  const loadingDashboard = useSelector(selectAdminLoadingDashboard);
  const loadingUsers = useSelector(selectAdminLoadingUsers);
  const loadingExpenses = useSelector(selectAdminLoadingExpenses);
  const error = useSelector(selectAdminError);

  const usersPagination = useSelector(selectAdminUsersPagination);
  const expensesPagination = useSelector(selectAdminExpensesPagination);

  const [localUsersFilters, setLocalUsersFilters] = useState({
    search: "",
    role: "",
    plan: "",
  });

  const [localExpensesFilters, setLocalExpensesFilters] = useState({
    search: "",
    isActive: "",
  });

  useEffect(() => {
    dispatch(fetchAdminDashboard());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAdminUsers(usersFilters));
  }, [dispatch, usersFilters]);

  useEffect(() => {
    dispatch(fetchAdminExpenses(expensesFilters));
  }, [dispatch, expensesFilters]);

  const handleReloadAll = () => {
    dispatch(fetchAdminDashboard());
    dispatch(fetchAdminUsers(usersFilters));
    dispatch(fetchAdminExpenses(expensesFilters));
  };

  const handleApplyUsersFilters = (nextFilters) => {
    dispatch(setAdminUsersFilters(nextFilters || localUsersFilters));
  };

  const handleClearUsersFilters = () => {
    const emptyFilters = {
      search: "",
      role: "",
      plan: "",
    };

    setLocalUsersFilters(emptyFilters);
    dispatch(setAdminUsersFilters(emptyFilters));
  };

  const handleApplyExpensesFilters = (nextFilters) => {
    dispatch(setAdminExpensesFilters(nextFilters || localExpensesFilters));
  };

  const handleClearExpensesFilters = () => {
    const emptyFilters = {
      search: "",
      isActive: "",
    };

    setLocalExpensesFilters(emptyFilters);
    dispatch(setAdminExpensesFilters(emptyFilters));
  };

  const handleUsersPageChange = (page) => {
    dispatch(setAdminUsersPage(page));
  };

  const handleExpensesPageChange = (page) => {
    dispatch(setAdminExpensesPage(page));
  };

  const loadingInitial =
    loadingDashboard && !dashboard && users.length === 0 && expenses.length === 0;

  if (loadingInitial) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", minHeight: 300 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={4}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <div>
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard admin
          </Typography>

          <Typography color="text.secondary">
            Vista global de usuarios y gastos del sistema.
          </Typography>
        </div>

        <Button
          variant="outlined"
          onClick={handleReloadAll}
          disabled={loadingDashboard || loadingUsers || loadingExpenses}
        >
          Actualizar
        </Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Stack spacing={2}>
        <Typography variant="h5" component="h2">
          Resumen global
        </Typography>

        <AdminSummary dashboard={dashboard} />
      </Stack>

      <Stack spacing={2}>
        <Typography variant="h5" component="h2">
          Usuarios
        </Typography>

        <Paper sx={{ p: 3 }}>
          <AdminUsersFilters
            filters={localUsersFilters}
            onChange={setLocalUsersFilters}
            onApply={handleApplyUsersFilters}
            onClear={handleClearUsersFilters}
          />
        </Paper>

        {loadingUsers && users.length === 0 ? (
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: "grid", placeItems: "center", minHeight: 160 }}>
              <CircularProgress />
            </Box>
          </Paper>
        ) : (
          <>
            <AdminUsersTable users={users} />

            <AdminPagination
              page={usersPagination.page}
              total={usersPagination.total}
              totalPages={usersPagination.totalPages}
              loading={loadingUsers}
              onPageChange={handleUsersPageChange}
            />
          </>
        )}
      </Stack>

      <Stack spacing={2}>
        <Typography variant="h5" component="h2">
          Gastos globales
        </Typography>

        <Paper sx={{ p: 3 }}>
          <AdminExpensesFilters
            filters={localExpensesFilters}
            onChange={setLocalExpensesFilters}
            onApply={handleApplyExpensesFilters}
            onClear={handleClearExpensesFilters}
          />
        </Paper>

        {loadingExpenses && expenses.length === 0 ? (
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: "grid", placeItems: "center", minHeight: 160 }}>
              <CircularProgress />
            </Box>
          </Paper>
        ) : (
          <>
            <AdminExpensesTable expenses={expenses} />

            <AdminPagination
              page={expensesPagination.page}
              total={expensesPagination.total}
              totalPages={expensesPagination.totalPages}
              loading={loadingExpenses}
              onPageChange={handleExpensesPageChange}
            />
          </>
        )}
      </Stack>
    </Stack>
  );
};

export default AdminDashboardPage;