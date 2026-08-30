import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";

import DashboardSummary from "../components/dashboard/DashboardSummary.jsx";
import DashboardCharts from "../components/dashboard/DashboardCharts.jsx";
import CategoryExpenseReport from "../components/dashboard/CategoryExpenseReport.jsx";

const ctaButtonSx = {
  minHeight: 40,
  height: 40,
  py: 0,
  px: 2.25,
  flexShrink: 0,
  alignSelf: { xs: "stretch", sm: "center" },
  width: { xs: "100%", sm: "auto" },
};

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

        <Box
          sx={{
            position: "relative",
            width: "100%",
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "minmax(0, 1fr) auto",
            },
            alignItems: "center",
            gap: { xs: 3, md: 4 },
          }}
        >
          <Stack spacing={2} maxWidth={680} sx={{ minWidth: 0 }}>
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
              Resumen de tus gastos.
            </Typography>

            <Typography sx={{ color: "rgba(248, 251, 255, 0.74)", maxWidth: 560 }}>
              Visualizá el estado general, compará categorías y exportá tus gastos mensuales.
            </Typography>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            alignItems={{ xs: "stretch", sm: "center" }}
            justifyContent={{ xs: "flex-start", md: "flex-end" }}
            sx={{
              width: { xs: "100%", sm: "auto" },
              justifySelf: { xs: "stretch", md: "end" },
            }}
          >
            <Button
              component={RouterLink}
              to="/expenses"
              variant="contained"
              startIcon={<AddRoundedIcon />}
              sx={{
                ...ctaButtonSx,
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
                ...ctaButtonSx,
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
        </Box>
      </Paper>

      <DashboardSummary />

      <CategoryExpenseReport />

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

        <Button
          component={RouterLink}
          to="/expenses"
          variant="outlined"
          startIcon={<ReceiptLongOutlinedIcon />}
          sx={{ minHeight: 40, height: 40, py: 0 }}
        >
          Ver gastos
        </Button>
      </Box>

      <DashboardCharts />
    </Stack>
  );
};

export default DashboardPage;