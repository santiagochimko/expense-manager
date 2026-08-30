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
  Typography,
  useTheme,
} from "@mui/material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
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

const formatMonthLabel = (monthKey) => {
  if (!monthKey) {
    return "Mes";
  }

  const [year, month] = monthKey.split("-");

  return `${month}/${year}`;
};

const getItemsByMonth = (charts, monthKey) => {
  const expensesByCategoryByMonth = charts?.expensesByCategoryByMonth || [];

  return expensesByCategoryByMonth.filter((item) => getMonthKey(item) === monthKey);
};

const buildCategoryComparisonData = (charts, selectedMonth, comparisonMonth) => {
  const selectedItems = getItemsByMonth(charts, selectedMonth);
  const comparisonItems = comparisonMonth ? getItemsByMonth(charts, comparisonMonth) : [];
  const rowsMap = new Map();

  const ensureRow = (item) => {
    const id = String(item?.categoryId || item?._id?.category || item?.categoryName || "uncategorized");

    if (!rowsMap.has(id)) {
      rowsMap.set(id, {
        id,
        name: item?.categoryName || "Sin categoría",
        selectedAmount: 0,
        comparisonAmount: 0,
      });
    }

    return rowsMap.get(id);
  };

  selectedItems.forEach((item) => {
    const row = ensureRow(item);
    row.selectedAmount = Number(item.totalAmount || 0);
  });

  comparisonItems.forEach((item) => {
    const row = ensureRow(item);
    row.comparisonAmount = Number(item.totalAmount || 0);
  });

  return Array.from(rowsMap.values()).sort((a, b) => {
    const totalA = a.selectedAmount + a.comparisonAmount;
    const totalB = b.selectedAmount + b.comparisonAmount;

    return totalB - totalA;
  });
};

const chartSx = {
  width: "100%",
  height: { xs: 320, sm: 360 },
  minWidth: 0,
};

const DashboardCharts = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const charts = useSelector(selectDashboardCharts);
  const loading = useSelector(selectDashboardLoading);
  const error = useSelector(selectDashboardError);

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthKey());
  const [comparisonMonth, setComparisonMonth] = useState("");

  useEffect(() => {
    dispatch(fetchDashboardCharts());
  }, [dispatch]);

  const monthOptions = charts?.availableMonths || [];
  const resolvedSelectedMonth = monthOptions.includes(selectedMonth)
    ? selectedMonth
    : monthOptions.at(-1) || selectedMonth;
  const comparisonOptions = monthOptions.filter((month) => month < resolvedSelectedMonth);
  const resolvedComparisonMonth = comparisonOptions.includes(comparisonMonth)
    ? comparisonMonth
    : "";

  const categoryChartData = useMemo(() => {
    return buildCategoryComparisonData(
      charts,
      resolvedSelectedMonth,
      resolvedComparisonMonth
    );
  }, [charts, resolvedSelectedMonth, resolvedComparisonMonth]);

  const chartColor = theme.palette.secondary.main;
  const comparisonColor = theme.palette.primary.main;
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
          Comparativa por categoría
        </Typography>

        <Typography color="text.secondary">
          Revisá el gasto mensual por categoría y comparalo side by side contra meses anteriores. Los importes están convertidos a UYU.
        </Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <DashboardChartCard title="Gastos por categoría">
        <Stack spacing={2}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1.5}
            alignItems={{ xs: "stretch", md: "center" }}
            justifyContent="space-between"
          >
            <FormControl size="small" sx={{ minWidth: { md: 180 } }}>
              <InputLabel id="category-chart-month-label">Mes a ver</InputLabel>
              <Select
                labelId="category-chart-month-label"
                label="Mes a ver"
                value={resolvedSelectedMonth}
                onChange={(event) => {
                  setSelectedMonth(event.target.value);
                  setComparisonMonth("");
                }}
              >
                {monthOptions.map((month) => (
                  <MenuItem key={month} value={month}>
                    {formatMonthLabel(month)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: { md: 240 } }}>
              <InputLabel id="category-chart-compare-label">Comparar con</InputLabel>
              <Select
                labelId="category-chart-compare-label"
                label="Comparar con"
                value={resolvedComparisonMonth}
                onChange={(event) => setComparisonMonth(event.target.value)}
              >
                <MenuItem value="">Sin comparación</MenuItem>
                {comparisonOptions.map((month) => (
                  <MenuItem key={month} value={month}>
                    {formatMonthLabel(month)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
                  {resolvedComparisonMonth && <Legend />}
                  <Bar
                    dataKey="selectedAmount"
                    name={`${formatMonthLabel(resolvedSelectedMonth)} UYU`}
                    fill={chartColor}
                    radius={[10, 10, 0, 0]}
                  />
                  {resolvedComparisonMonth && (
                    <Bar
                      dataKey="comparisonAmount"
                      name={`${formatMonthLabel(resolvedComparisonMonth)} UYU`}
                      fill={comparisonColor}
                      radius={[10, 10, 0, 0]}
                    />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </Box>
          )}
        </Stack>
      </DashboardChartCard>
    </Stack>
  );
};

export default DashboardCharts;
