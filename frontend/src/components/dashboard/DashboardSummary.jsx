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

import SummaryCard from "./SummaryCard.jsx";
import {
  selectDashboardError,
  selectDashboardLoading,
  selectDashboardSummary,
} from "../../features/dashboard/dashboardSelectors.js";
import { fetchDashboardSummary } from "../../features/dashboard/dashboardThunks.js";
import { formatMoney } from "../../utils/currency.js";

const DashboardSummary = () => {
  const dispatch = useDispatch();

  const summary = useSelector(selectDashboardSummary);
  const loading = useSelector(selectDashboardLoading);
  const error = useSelector(selectDashboardError);

  useEffect(() => {
    dispatch(fetchDashboardSummary());
  }, [dispatch]);

  if (loading && !summary) {
    return (
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: "grid", placeItems: "center", minHeight: 160 }}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h5" component="h2">
          Resumen
        </Typography>

        <Typography color="text.secondary">
          Estado general de tus gastos. Los montos consolidados se muestran en UYU.
        </Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
          },
          gap: 2.5,
        }}
      >
        <SummaryCard
          title="Total de gastos"
          value={summary?.totalExpenses ?? 0}
          helperText="Cantidad de gastos registrados"
        />

        <SummaryCard
          title="Monto del mes"
          value={formatMoney(summary?.currentMonthAmount, "UYU")}
          helperText={`${summary?.currentMonthExpenses ?? 0} gastos registrados este mes`}
        />
      </Box>
    </Stack>
  );
};

export default DashboardSummary;