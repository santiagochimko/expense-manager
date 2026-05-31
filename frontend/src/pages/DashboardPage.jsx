import { useEffect } from "react";
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
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import SummaryCard from "../components/dashboard/SummaryCard.jsx";
import DashboardChartCard from "../components/dashboard/DashboardChartCard.jsx";
import EmptyChartState from "../components/dashboard/EmptyChartState.jsx";
import {
  selectDashboardCharts,
  selectDashboardError,
  selectDashboardLoading,
  selectDashboardSummary,
} from "../features/dashboard/dashboardSelectors.js";
import {
  fetchDashboardCharts,
  fetchDashboardSummary,
} from "../features/dashboard/dashboardThunks.js";

const getCategoryChartData = (charts) => {
  const expensesByCategory = charts?.expensesByCategory || [];

  return expensesByCategory.map((item) => ({
    name: item.categoryName || "Sin categoría",
    amount: item.totalAmount,
    count: item.totalCount,
  }));
};

const getMonthlyChartData = (charts) => {
  const expensesByMonth = charts?.expensesByMonth || [];

  return expensesByMonth.map((item) => ({
    name: `${item._id.month}/${item._id.year}`,
    amount: item.totalAmount,
    count: item.totalCount,
  }));
};

const getPaymentMethodChartData = (charts) => {
  const expensesByPaymentMethod = charts?.expensesByPaymentMethod || [];

  return expensesByPaymentMethod.map((item) => ({
    name: item._id || "Sin método",
    amount: item.totalAmount,
    count: item.totalCount,
  }));
};

const DashboardPage = () => {
  const dispatch = useDispatch();

  const summary = useSelector(selectDashboardSummary);
  const charts = useSelector(selectDashboardCharts);
  const loading = useSelector(selectDashboardLoading);
  const error = useSelector(selectDashboardError);

  useEffect(() => {
    dispatch(fetchDashboardSummary());
    dispatch(fetchDashboardCharts());
  }, [dispatch]);

  const categoryChartData = getCategoryChartData(charts);
  const monthlyChartData = getMonthlyChartData(charts);
  const paymentMethodChartData = getPaymentMethodChartData(charts);

  const handleReload = () => {
    dispatch(fetchDashboardSummary());
    dispatch(fetchDashboardCharts());
  };

  if (loading && !summary && !charts) {
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
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard
          </Typography>

          <Typography color="text.secondary">
            Resumen general de tus gastos.
          </Typography>
        </Box>

        <Button variant="outlined" onClick={handleReload} disabled={loading}>
          Actualizar
        </Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(4, 1fr)",
          },
          gap: 2,
        }}
      >
        <SummaryCard
          title="Total de gastos"
          value={summary?.totalExpenses ?? 0}
          helperText="Cantidad de gastos registrados"
        />

        <SummaryCard
          title="Monto total"
          value={`$${summary?.totalAmount ?? 0}`}
          helperText="Suma total acumulada"
        />

        <SummaryCard
          title="Monto del mes"
          value={`$${summary?.currentMonthAmount ?? 0}`}
          helperText="Total gastado este mes"
        />

        <SummaryCard
          title={summary?.plan === "plus" ? "Gastos restantes" : "Plan"}
          value={
            summary?.plan === "plus"
              ? summary?.remaining ?? 0
              : summary?.plan ?? "-"
          }
          helperText={
            summary?.plan === "plus"
              ? "Disponibles antes de llegar al límite"
              : "Plan actual del usuario"
          }
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
          },
          gap: 2,
        }}
      >
        <DashboardChartCard title="Gastos por categoría">
          {categoryChartData.length === 0 ? (
            <EmptyChartState />
          ) : (
            <Box sx={{ width: "100%", height: 320, minWidth: 0 }}>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={categoryChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" name="Monto" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          )}
        </DashboardChartCard>

        <DashboardChartCard title="Evolución mensual">
          {monthlyChartData.length === 0 ? (
            <EmptyChartState />
          ) : (
            <Box sx={{ width: "100%", height: 320, minWidth: 0 }}>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    name="Monto"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          )}
        </DashboardChartCard>
      </Box>

      <DashboardChartCard title="Gastos por método de pago">
        {paymentMethodChartData.length === 0 ? (
          <EmptyChartState />
        ) : (
          <Box sx={{ width: "100%", height: 320, minWidth: 0 }}>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={paymentMethodChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" name="Monto" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        )}
      </DashboardChartCard>

      {!loading && !summary && !charts && !error && (
        <Paper sx={{ p: 3 }}>
          <Typography color="text.secondary">
            Todavía no hay información para mostrar.
          </Typography>
        </Paper>
      )}
    </Stack>
  );
};

export default DashboardPage;