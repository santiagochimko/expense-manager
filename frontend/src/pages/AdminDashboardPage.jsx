import { Paper, Typography } from "@mui/material";

const AdminDashboardPage = () => {
  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard Admin
      </Typography>

      <Typography color="text.secondary">
        Métricas globales del sistema.
      </Typography>
    </Paper>
  );
};

export default AdminDashboardPage;