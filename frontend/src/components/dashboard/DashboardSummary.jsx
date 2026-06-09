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
    <Stack spacing={2}>
      <Box>
        <Typography variant="h5" component="h2">
          Resumen
        </Typography>

        <Typography color="text.secondary">
          Estado general de tus gastos.
        </Typography>
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
    </Stack>
  );
};

export default DashboardSummary;