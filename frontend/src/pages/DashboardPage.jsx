import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";

import DashboardSummary from "../components/dashboard/DashboardSummary.jsx";
import DashboardCharts from "../components/dashboard/DashboardCharts.jsx";
import PlanUpgradeCard from "../components/users/PlanUpgradeCard.jsx";

const DashboardPage = () => {
  return (
    <Stack spacing={{ xs: 3, md: 4 }}>
      <Paper
        sx={{
          p: { xs: 3, sm: 4, md: 5 },
          overflow: "hidden",
          position: "relative",
          color: "#f8fbff",
          bgcolor: "primary.main",
          background:
            "radial-gradient(circle at 82% 10%, rgba(56, 189, 248, 0.34), transparent 28%), linear-gradient(135deg, #020617 0%, #0f172a 58%, #1d4ed8 100%)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: "auto -8% -40% auto",
            width: 360,
            height: 360,
            borderRadius: "50%",
            border: "1px solid rgba(56, 189, 248, 0.22)",
          }}
        />

        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "flex-end" }}
          spacing={3}
          sx={{ position: "relative" }}
        >
          <Stack spacing={2} maxWidth={680}>
            <Chip
              label="Panorama financiero"
              sx={{
                width: "fit-content",
                color: "#020617",
                bgcolor: "#38bdf8",
              }}
            />

            <Typography
              variant="h2"
              component="h1"
              sx={{ fontSize: { xs: 40, sm: 52, md: 64 }, lineHeight: 0.95 }}
            >
              Resumen elegante de tus gastos.
            </Typography>

            <Typography sx={{ color: "rgba(248, 251, 255, 0.74)", maxWidth: 560 }}>
              Visualizá el estado general, detectá patrones y accedé rápido a las gestiones principales.
            </Typography>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} width={{ xs: "100%", sm: "auto" }}>
            <Button
              component={RouterLink}
              to="/expenses"
              variant="contained"
              startIcon={<AddRoundedIcon />}
              sx={{
                bgcolor: "#38bdf8",
                color: "#020617",
                background: "linear-gradient(135deg, #38bdf8, #2563eb)",
                "&:hover": {
                  bgcolor: "#2563eb",
                },
              }}
            >
              Nuevo gasto
            </Button>

            <Button
              component={RouterLink}
              to="/categories"
              variant="outlined"
              startIcon={<CategoryOutlinedIcon />}
              sx={{
                color: "#f8fbff",
                borderColor: "rgba(248, 251, 255, 0.24)",
                backgroundColor: "rgba(248, 251, 255, 0.08)",
                "&:hover": {
                  borderColor: "rgba(56, 189, 248, 0.55)",
                  backgroundColor: "rgba(56, 189, 248, 0.12)",
                },
              }}
            >
              Categorías
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <PlanUpgradeCard />

      <DashboardSummary />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography variant="h5" component="h2">
            Visualizaciones
          </Typography>
          <Typography color="text.secondary">
            Lectura global por categoría, mes y método de pago.
          </Typography>
        </Box>

        <Button component={RouterLink} to="/expenses" variant="outlined" startIcon={<ReceiptLongOutlinedIcon />}>
          Ver gastos
        </Button>
      </Box>

      <DashboardCharts />
    </Stack>
  );
};

export default DashboardPage;
