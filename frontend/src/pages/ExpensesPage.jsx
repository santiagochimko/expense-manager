import { Box, Chip, Paper, Stack, Typography } from "@mui/material";

import ExpensesSection from "../components/expenses/ExpensesSection.jsx";

const ExpensesPage = () => {
  return (
    <Stack spacing={{ xs: 3, md: 4 }}>
      <Paper
        sx={{
          p: { xs: 3, sm: 4 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -80,
            right: -60,
            width: 220,
            height: 220,
            borderRadius: "50%",
            bgcolor: "rgba(200, 169, 106, 0.12)",
          }}
        />

        <Stack spacing={1.5} sx={{ position: "relative" }}>
          <Chip label="Movimientos" sx={{ width: "fit-content" }} />
          <Typography variant="h3" component="h1" sx={{ fontSize: { xs: 34, md: 46 } }}>
            Gastos
          </Typography>
          <Typography color="text.secondary" maxWidth={660}>
            Registrá, filtrá y revisá tus movimientos con una lectura visual cómoda en desktop, tablet y mobile.
          </Typography>
        </Stack>
      </Paper>

      <ExpensesSection />
    </Stack>
  );
};

export default ExpensesPage;
