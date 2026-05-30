import { Paper, Typography } from "@mui/material";

const DashboardPage = () => {
  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      <Typography color="text.secondary">
        Resumen general de gastos del usuario.
      </Typography>
    </Paper>
  );
};

export default DashboardPage;