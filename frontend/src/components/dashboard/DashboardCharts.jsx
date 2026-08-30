import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
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

const getCurrentMonthKey = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
};

const getMonthKey = (item) => {
  if (!item?._id?.year || !item?._id?.month) {
    return "";
  }

  return `${item._id.year}-${String(item._id.month).padStart(2, "0")}`;
};

const getCategoryChartData = (charts) => {
  const expensesByCategory = charts?.expensesByCategory || [];

  return expensesByCategory.map((item) => ({
    name: item.categoryName || "Sin categoría",
    amount: item.totalAmount,
    count: item.totalCount,
  }));
};

const getMonthlyCategoryChartData = (charts, selectedMonth) => {
  const expensesByCategoryByMonth = charts?.expensesByCategoryByMonth || [];

  return expensesByCategoryByMonth
    .filter((item) => getMonthKey(item) === selectedMonth)
    .map((item) => ({
      name: item.categoryName || "Sin categoría",
      amount: item.totalAmount,
      count: item.totalCount,
    }));
};

const getMonthlyChartData = (charts) => {
  const expensesByMonth = charts?.expensesByMonth || [];
  let accumulatedAmount = 0;

  return expensesByMonth.map((item) => {
    accumulatedAmount += Number(item.totalAmount || 0);

    return {
      name: `${item._id.month}/${item._id.year}`,
      amount: item.totalAmount,
      accumulatedAmount: Number(accumulatedAmount.toFixed(2)),
      count: item.totalCount,
    };
  });
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

const DashboardCharts = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const charts = useSelector(selectDashboardCharts);
  const loading = useSelector(selectDashboardLoading);
  const error = useSelector(selectDashboardError);

  const [categoryMode, setCategoryMode] = useState("historical");
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthKey());

  useEffect(() => {
    dispatch(fetchDashboardCharts());
  }, [dispatch]);

  const monthOptions = charts?.availableMonths || [];
  const selectedCategoryMonth = monthOptions.includes(selectedMonth)
    ? selectedMonth
    : monthOptions.at(-1) || selectedMonth;

  const categoryChartData = useMemo(() => {
    if (categoryMode === "monthly") {
      return getMonthlyCategoryChartData(charts, selectedCategoryMonth);
    }

    return getCategoryChartData(charts);
  }, [categoryMode, charts, selectedCategoryMonth]);

  const monthlyChartData = getMonthlyChartData(charts);
  const paymentMethodChartData = getPaymentMethodChartData(charts);

  const chartColor = theme.palette.secondary.main;
  const lineColor = theme.palette.primary.main;
  const gridColor = theme.palette.divider;
  const axisColor = theme.palette.text.secondary;
  const tooltipProps = {
    contentStyle: {
      borderRadius: 16,
      border: `1px solid ${theme.palette.divider}`,
      background: theme.palette.background.paper,
      color: theme.palette.text.primary,
      boxShadow:
        theme.palette.mode === "dark"
          ? "0 18px 50px rgba(0, 0, 0, 0.34)"
          : "0 18px 50px rgba(15, 23, 42, 0.14)",
    },
  };

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
          Visualización de gastos por categoría, mes y método de pago. Los importes están convertidos a UYU.
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
          <Stack spacing={2}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              alignItems={{ xs: "stretch", sm: "center" }}
              justifyContent="space-between"
            >
              <ToggleButtonGroup
                exclusive
                size="small"
                value={categoryMode}
                onChange={(_, nextMode) => {
                  if (nextMode) {
                    setCategoryMode(nextMode);
                  }
                }}
              >
                <ToggleButton value="historical">Histórico</ToggleButton>
                <ToggleButton value="monthly">Mensual</ToggleButton>
              </ToggleButtonGroup>

              {categoryMode === "monthly" && (
                <FormControl size="small" sx={{ minWidth: 180 }}>
                  <InputLabel id="category-chart-month-label">Mes</InputLabel>
                  <Select
                    labelId="category-chart-month-label"
                    label="Mes"
                    value={selectedCategoryMonth}
                    onChange={(event) => setSelectedMonth(event.target.value)}
                  >
                    {monthOptions.map((month) => (
                      <MenuItem key={month} value={month}>
                        {month}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Stack>

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
                    <Bar dataKey="amount" name="Monto UYU" fill={chartColor} radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Stack>
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
                    name="Monto mensual UYU"
                    stroke={lineColor}
                    strokeWidth={3}
                    dot={{ r: 4, fill: chartColor, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: chartColor, stroke: lineColor }}
                  />
                  <Line
                    type="monotone"
                    dataKey="accumulatedAmount"
                    name="Acumulado histórico UYU"
                    stroke={chartColor}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
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
                <Bar dataKey="amount" name="Monto UYU" fill={chartColor} radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        )}
      </DashboardChartCard>
    </Stack>
  );
};

export default DashboardCharts;