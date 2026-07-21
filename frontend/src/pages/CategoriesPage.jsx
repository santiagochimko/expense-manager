import { Box, Chip, Paper, Stack, Typography } from "@mui/material";

import CategoriesSection from "../components/categories/CategoriesSection.jsx";

const CategoriesPage = () => {
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
          sx={(theme) => ({
            position: "absolute",
            top: -80,
            right: -60,
            width: 220,
            height: 220,
            borderRadius: "50%",
            bgcolor:
              theme.palette.mode === "dark"
                ? "rgba(56, 189, 248, 0.12)"
                : "rgba(37, 99, 235, 0.1)",
          })}
        />

        <Stack spacing={1.5} sx={{ position: "relative" }}>
          <Chip label="Clasificación" sx={{ width: "fit-content" }} />
          <Typography variant="h3" component="h1" sx={{ fontSize: { xs: 34, md: 46 } }}>
            Categorías
          </Typography>
          <Typography color="text.secondary" maxWidth={660}>
            Organizá tus gastos con categorías claras, colores consistentes y una estructura fácil de mantener.
          </Typography>
        </Stack>
      </Paper>

      <CategoriesSection />
    </Stack>
  );
};

export default CategoriesPage;
