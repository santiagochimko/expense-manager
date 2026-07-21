import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Box,
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

const chartColor = "#c8a96a";
const lineColor = "#14110f";
const gridColor = "rgba(20, 17, 15, 0.08)";
const axisColor = "#7b7166";

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

const paymentMethodLabels = {
  cash: "Efectivo",
  debit_card: "Tarjeta de débito",
  credit_card: "Tarjeta de crédito",
  transfer: "Transferencia",
};

const getPaymentMethodChartData = (charts) => {
  const expensesByPaymentMethod = charts?.expensesByPaymentMethod || [];

  return expensesByPaymentMethod.map((item) => ({
    name: paymentMethodLabels[item._id] || item._id || "Sin método",
    amount: item.totalAmount,
    count: item.totalCount,
  }));
};

const chartSx = {
  width: "100%",
  height: { xs: 280, sm: 320 },
  minWidth: 0,
};

const tooltipProps = {
  contentStyle: {
    borderRadius: 16,
    border: "1px solid rgba(20, 17, 15, 0.1)",
    boxShadow: "0 18px 50px rgba(20, 17, 15, 0.14)",
  },
};

const DashboardCharts = () => {
  const dispatch = useDispatch();

  const charts = useSelector(selectDashboardCharts);
  const loading = useSelector(selectDashboardLoading);
  const error = useSelector(selectDashboardError);

  useEffect(() => {
    dispatch(fetchDashboardCharts());
  }, [dispatch]);

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
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h5" component="h2">
          Gráficos
        </Typography>

        <Typography color="text.secondary">
          Visualización de gastos por categoría, mes y método de pago.
        </Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "1fr 1fr",
          },
          gap: 2.5,
        }}
      >
        <DashboardChartCard title="Gastos por categoría">
          {categoryChartData.length === 0 ? (
            <EmptyChartState />
          ) : (
            <Box sx={chartSx}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="name" tick={{ fill: axisColor, fontSize: 12 }} />
                  <YAxis tick={{ fill: axisColor, fontSize: 12 }} />
                  <Tooltip {...tooltipProps} />
                  <Bar dataKey="amount" name="Monto" fill={chartColor} radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          )}
        </DashboardChartCard>

        <DashboardChartCard title="Evolución mensual">
          {monthlyChartData.length === 0 ? (
            <EmptyChartState />
          ) : (
            <Box sx={chartSx}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="name" tick={{ fill: axisColor, fontSize: 12 }} />
                  <YAxis tick={{ fill: axisColor, fontSize: 12 }} />
                  <Tooltip {...tooltipProps} />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    name="Monto"
                    stroke={lineColor}
                    strokeWidth={3}
                    dot={{ r: 4, fill: chartColor, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: chartColor, stroke: lineColor }}
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
          <Box sx={chartSx}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentMethodChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" tick={{ fill: axisColor, fontSize: 12 }} />
                <YAxis tick={{ fill: axisColor, fontSize: 12 }} />
                <Tooltip {...tooltipProps} />
                <Bar dataKey="amount" name="Monto" fill={chartColor} radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        )}
      </DashboardChartCard>
    </Stack>
  );
};

export default DashboardCharts;
