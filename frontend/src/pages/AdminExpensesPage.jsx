import { Paper, Typography } from "@mui/material";

const AdminExpensesPage = () => {
  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Gastos globales
      </Typography>

      <Typography color="text.secondary">
        Listado global de gastos.
      </Typography>
    </Paper>
  );
};

export default AdminExpensesPage;