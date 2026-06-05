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

import DashboardChartCard from "./DashboardChartCard.jsx";
import EmptyChartState from "./EmptyChartState.jsx";
import {
  selectDashboardCharts,
  selectDashboardError,
  selectDashboardLoading,
} from "../../features/dashboard/dashboardSelectors.js";
import { fetchDashboardCharts } from "../../features/dashboard/dashboardThunks.js";

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

const DashboardCharts = () => {
  const dispatch = useDispatch();

  const charts = useSelector(selectDashboardCharts);
  const loading = useSelector(selectDashboardLoading);
  const error = useSelector(selectDashboardError);

  useEffect(() => {
    dispatch(fetchDashboardCharts());
  }, [dispatch]);

  const handleReload = () => {
    dispatch(fetchDashboardCharts());
  };

  const categoryChartData = getCategoryChartData(charts);
  const monthlyChartData = getMonthlyChartData(charts);
  const paymentMethodChartData = getPaymentMethodChartData(charts);

  if (loading && !charts) {
    return (
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: "grid", placeItems: "center", minHeight: 180 }}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  return (
    <Stack spacing={2}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <div>
          <Typography variant="h5" component="h2">
            Gráficos
          </Typography>

          <Typography color="text.secondary">
            Visualización de gastos por categoría, mes y método de pago.
          </Typography>
        </div>

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
    </Stack>
  );
};

export default DashboardCharts;