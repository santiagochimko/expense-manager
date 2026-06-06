import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const paymentMethodLabels = {
  cash: "Efectivo",
  debit_card: "Débito",
  credit_card: "Crédito",
  transfer: "Transferencia",
};

const formatDate = (date) => {
  if (!date) {
    return "-";
  }

  return new Date(date).toLocaleDateString("es-UY");
};

const AdminExpensesTable = ({ expenses }) => {
  if (expenses.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography color="text.secondary">
          No hay gastos globales para mostrar.
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Fecha</TableCell>
            <TableCell>Título</TableCell>
            <TableCell>Usuario</TableCell>
            <TableCell>Categoría</TableCell>
            <TableCell>Método</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="right">Monto</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense._id}>
              <TableCell>{formatDate(expense.date)}</TableCell>

              <TableCell>
                <Typography fontWeight={600}>{expense.title}</Typography>
                {expense.description && (
                  <Typography variant="body2" color="text.secondary">
                    {expense.description}
                  </Typography>
                )}
              </TableCell>

              <TableCell>
                <Typography variant="body2">
                  {expense.user?.username || "-"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {expense.user?.email || ""}
                </Typography>
              </TableCell>

              <TableCell>
                {expense.category ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: expense.category.color,
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    />
                    <Typography variant="body2">
                      {expense.category.name}
                    </Typography>
                  </Box>
                ) : (
                  "Sin categoría"
                )}
              </TableCell>

              <TableCell>
                <Chip
                  size="small"
                  label={
                    paymentMethodLabels[expense.paymentMethod] ||
                    expense.paymentMethod ||
                    "Sin método"
                  }
                  variant="outlined"
                />
              </TableCell>

              <TableCell>
                <Chip
                  size="small"
                  label={expense.isActive ? "Activo" : "Eliminado"}
                  color={expense.isActive ? "success" : "default"}
                  variant="outlined"
                />
              </TableCell>

              <TableCell align="right">${expense.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdminExpensesTable;