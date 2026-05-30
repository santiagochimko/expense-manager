import { Paper, Typography } from "@mui/material";

const CategoriesPage = () => {
  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Categorías
      </Typography>

      <Typography color="text.secondary">
        Gestión de categorías.
      </Typography>
    </Paper>
  );
};

export default CategoriesPage;