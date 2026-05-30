import { Paper, Typography } from "@mui/material";

const ExpensesPage = () => {
  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Gastos
      </Typography>

      <Typography color="text.secondary">
        Gestión de gastos.
      </Typography>
    </Paper>
  );
};

export default ExpensesPage;