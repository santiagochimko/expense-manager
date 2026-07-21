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
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
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
    <Paper
      sx={{
        p: { xs: 2.5, sm: 3 },
        overflow: "hidden",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -70,
          right: -50,
          width: 180,
          height: 180,
          borderRadius: "50%",
          bgcolor: "rgba(200, 169, 106, 0.12)",
        }}
      />

      <Stack spacing={2} sx={{ position: "relative" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                bgcolor: "rgba(200, 169, 106, 0.16)",
                color: "secondary.dark",
              }}
            >
              <WorkspacePremiumOutlinedIcon />
            </Box>

            <div>
              <Typography variant="h6" component="h2">
                Plan de usuario
              </Typography>

              <Typography color="text.secondary">
                Gestioná el alcance asociado a tu cuenta.
              </Typography>
            </div>
          </Stack>

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
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", md: "center" }}
            justifyContent="space-between"
          >
            <Typography color="text.secondary" maxWidth={720}>
              El plan Plus tiene un límite de gastos activos. Con Premium podés registrar gastos sin ese límite.
            </Typography>

            <Button
              variant="contained"
              onClick={handleUpgrade}
              disabled={loading}
              sx={{ whiteSpace: "nowrap" }}
            >
              {loading ? "Actualizando..." : "Actualizar a Premium"}
            </Button>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};

export default PlanUpgradeCard;
