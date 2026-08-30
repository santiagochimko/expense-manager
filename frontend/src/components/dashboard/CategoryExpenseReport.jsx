import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

import {
  selectDashboardCategoryReport,
  selectDashboardCategoryReportLoading,
  selectDashboardCharts,
  selectDashboardError,
} from "../../features/dashboard/dashboardSelectors.js";
import {
  fetchDashboardCategoryReport,
  fetchDashboardCharts,
} from "../../features/dashboard/dashboardThunks.js";
import { formatMoney } from "../../utils/currency.js";
import { formatCalendarDate } from "../../utils/date.js";

const paymentMethodLabels = {
  cash: "Efectivo",
  debit_card: "Débito",
  credit_card: "Crédito",
  transfer: "Transferencia",
};

const getCurrentMonthKey = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
};

const getCategoryOptions = (charts, report) => {
  const optionsMap = new Map();

  (charts?.expensesByCategory || []).forEach((category) => {
    const id = String(category?._id || "");

    if (id) {
      optionsMap.set(id, {
        id,
        name: category.categoryName || "Sin categoría",
        color: category.categoryColor || "#94a3b8",
      });
    }
  });

  (report?.categories || []).forEach((category) => {
    const id = String(category?.id || "");

    if (id && !optionsMap.has(id)) {
      optionsMap.set(id, {
        id,
        name: category.name || "Sin categoría",
        color: category.color || "#94a3b8",
      });
    }
  });

  return Array.from(optionsMap.values()).sort((a, b) => a.name.localeCompare(b.name));
};

const escapeCsvValue = (value) => {
  const normalizedValue = String(value ?? "");

  if (/[";\n]/.test(normalizedValue)) {
    return `"${normalizedValue.replaceAll('"', '""')}"`;
  }

  return normalizedValue;
};

const buildCsv = (report) => {
  const rows = [
    ["Mes", report?.month || ""],
    ["Moneda base", "UYU"],
    ["Total del mes", report?.totalAmount || 0],
    ["Total mes anterior", report?.previousTotalAmount || 0],
    [],
    ["Gasto", "Fecha", "Categoría", "Método", "Monto original", "Moneda", "Monto UYU"],
  ];

  const expensesByCategory = new Map();

  (report?.expenses || []).forEach((expense) => {
    const categoryId = expense.categoryId || "uncategorized";

    if (!expensesByCategory.has(categoryId)) {
      expensesByCategory.set(categoryId, []);
    }

    expensesByCategory.get(categoryId).push(expense);
  });

  (report?.categories || []).forEach((category) => {
    const expenses = expensesByCategory.get(category.id) || [];

    expenses.forEach((expense) => {
      rows.push([
        expense.title,
        formatCalendarDate(expense.date),
        category.name,
        paymentMethodLabels[expense.paymentMethod] || expense.paymentMethod || "-",
        expense.amount,
        expense.currency || "UYU",
        expense.amountUYU || expense.amount || 0,
      ]);
    });

    rows.push(["TOTAL CATEGORÍA", "", category.name, "", "", "UYU", category.totalAmount || 0]);
    rows.push([]);
  });

  rows.push(["TOTAL GENERAL", "", "", "", "", "UYU", report?.totalAmount || 0]);

  return rows
    .map((row) => row.map(escapeCsvValue).join(";"))
    .join("\n");
};

const CategoryExpenseReport = () => {
  const dispatch = useDispatch();

  const charts = useSelector(selectDashboardCharts);
  const report = useSelector(selectDashboardCategoryReport);
  const loading = useSelector(selectDashboardCategoryReportLoading);
  const error = useSelector(selectDashboardError);

  const [month, setMonth] = useState(getCurrentMonthKey());
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

  useEffect(() => {
    dispatch(fetchDashboardCharts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchDashboardCategoryReport({ month, categoryIds: selectedCategoryIds }));
  }, [dispatch, month, selectedCategoryIds]);

  const categoryOptions = useMemo(() => {
    return getCategoryOptions(charts, report);
  }, [charts, report]);

  const selectedCategoriesLabel = selectedCategoryIds.length === 0
    ? "Todas las categorías"
    : `${selectedCategoryIds.length} seleccionadas`;

  const handleExport = () => {
    if (!report) {
      return;
    }

    const csvContent = `\uFEFF${buildCsv(report)}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `gastos-${report.month || month}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const variationPrefix = Number(report?.variationAmount || 0) > 0 ? "+" : "";

  return (
    <Paper sx={{ p: { xs: 2.5, sm: 3 } }}>
      <Stack spacing={2.5}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) auto" },
            alignItems: { xs: "stretch", md: "flex-start" },
            gap: 2,
            width: "100%",
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h5" component="h2">
              Reporte por categorías
            </Typography>

            <Typography color="text.secondary">
              Filtrá categorías, compará contra el mes anterior y exportá el detalle mensual para Excel o Google Sheets.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "stretch", md: "flex-end" },
              justifySelf: { xs: "stretch", md: "end" },
              width: { xs: "100%", md: "auto" },
            }}
          >
            <Button
              variant="contained"
              startIcon={<FileDownloadOutlinedIcon />}
              disabled={!report || loading}
              onClick={handleExport}
              sx={{ width: { xs: "100%", md: "auto" } }}
            >
              Exportar CSV
            </Button>
          </Box>
        </Box>

        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ xs: "stretch", md: "center" }}>
          <TextField
            label="Mes"
            type="month"
            value={month}
            onChange={(event) => setMonth(event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ minWidth: { md: 180 } }}
          />

          <FormControl sx={{ minWidth: { md: 280 }, flex: { md: 1 } }}>
            <InputLabel id="category-report-filter-label">Categorías</InputLabel>
            <Select
              multiple
              labelId="category-report-filter-label"
              label="Categorías"
              value={selectedCategoryIds}
              renderValue={() => selectedCategoriesLabel}
              onChange={(event) => {
                const value = event.target.value;
                setSelectedCategoryIds(typeof value === "string" ? value.split(",") : value);
              }}
            >
              {categoryOptions.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  <Checkbox checked={selectedCategoryIds.includes(category.id)} />
                  <ListItemText primary={category.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedCategoryIds.length > 0 && (
            <Button type="button" variant="outlined" onClick={() => setSelectedCategoryIds([])}>
              Ver todas
            </Button>
          )}
        </Stack>

        {error && <Alert severity="error">{error}</Alert>}

        {loading && !report ? (
          <Box sx={{ display: "grid", placeItems: "center", minHeight: 160 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={2.5}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                gap: 2,
              }}
            >
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Total filtrado
                </Typography>
                <Typography variant="h5" fontWeight={900}>
                  {formatMoney(report?.totalAmount, "UYU")}
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Mes anterior
                </Typography>
                <Typography variant="h5" fontWeight={900}>
                  {formatMoney(report?.previousTotalAmount, "UYU")}
                </Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Variación
                </Typography>
                <Typography variant="h5" fontWeight={900}>
                  {variationPrefix}{formatMoney(report?.variationAmount, "UYU")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {variationPrefix}{report?.variationPercent ?? 0}% contra {report?.previousMonth}
                </Typography>
              </Paper>
            </Box>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {(report?.categories || []).map((category) => (
                <Chip
                  key={category.id}
                  label={`${category.name}: ${formatMoney(category.totalAmount, "UYU")}`}
                  variant="outlined"
                  sx={{ borderColor: category.color }}
                />
              ))}
            </Stack>

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Gasto</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Categoría</TableCell>
                    <TableCell>Método</TableCell>
                    <TableCell align="right">Monto original</TableCell>
                    <TableCell align="right">Monto UYU</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(report?.expenses || []).map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{expense.title}</TableCell>
                      <TableCell>{formatCalendarDate(expense.date)}</TableCell>
                      <TableCell>{expense.categoryName}</TableCell>
                      <TableCell>{paymentMethodLabels[expense.paymentMethod] || expense.paymentMethod || "-"}</TableCell>
                      <TableCell align="right">{formatMoney(expense.amount, expense.currency)}</TableCell>
                      <TableCell align="right">{formatMoney(expense.amountUYU, "UYU")}</TableCell>
                    </TableRow>
                  ))}

                  {(report?.expenses || []).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Typography color="text.secondary">
                          No hay gastos para el mes y categorías seleccionadas.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};

export default CategoryExpenseReport;
