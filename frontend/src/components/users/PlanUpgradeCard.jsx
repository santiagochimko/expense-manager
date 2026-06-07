import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import { clearAuthError } from "../../features/auth/authSlice.js";
import { updateMyPlan } from "../../features/auth/authThunks.js";
import {
  selectAuthError,
  selectAuthLoading,
  selectUser,
} from "../../features/auth/authSelectors.js";
import {
  fetchDashboardCharts,
  fetchDashboardSummary,
} from "../../features/dashboard/dashboardThunks.js";

const PlanUpgradeCard = () => {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const [successMessage, setSuccessMessage] = useState("");

  const isAdmin = user?.role === "admin";
  const isPremium = user?.plan === "premium";

  const handleUpgrade = async () => {
    setSuccessMessage("");
    dispatch(clearAuthError());

    const result = await dispatch(updateMyPlan("premium"));

    if (updateMyPlan.fulfilled.match(result)) {
      setSuccessMessage("Tu plan se actualizó a premium correctamente.");
      dispatch(fetchDashboardSummary());
      dispatch(fetchDashboardCharts());
    }
  };

  if (!user || isAdmin) {
    return null;
  }

  return (
    <Paper sx={{ p: 3 }}>
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
            <Typography variant="h6" component="h2">
              Plan de usuario
            </Typography>

            <Typography color="text.secondary">
              Gestioná el plan asociado a tu cuenta.
            </Typography>
          </div>

          <Chip
            label={user.plan === "premium" ? "Premium" : "Plus"}
            color={user.plan === "premium" ? "success" : "default"}
            variant="outlined"
          />
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        {successMessage && <Alert severity="success">{successMessage}</Alert>}

        {isPremium ? (
          <Alert severity="success">
            Ya tenés el plan premium activo. No tenés límite de gastos.
          </Alert>
        ) : (
          <Stack spacing={1}>
            <Typography>
              El plan Plus tiene un límite de gastos activos. Con Premium podés
              registrar gastos sin ese límite.
            </Typography>

            <Box>
              <Button
                variant="contained"
                onClick={handleUpgrade}
                disabled={loading}
              >
                {loading ? "Actualizando..." : "Actualizar a Premium"}
              </Button>
            </Box>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};

export default PlanUpgradeCard;