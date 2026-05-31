import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
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
  return new Date(date).toLocaleDateString("es-UY");
};

const ExpensesTable = ({ expenses = [], deleting, onEdit, onDelete }) => {
  if (expenses.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography color="text.secondary">
          No hay gastos para mostrar.
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
            <TableCell>Categoría</TableCell>
            <TableCell>Método</TableCell>
            <TableCell align="right">Monto</TableCell>
            <TableCell align="right">Acciones</TableCell>
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
                {expense.category ? (
                  <Stack direction="row" spacing={1} alignItems="center">
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
                  </Stack>
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

              <TableCell align="right">${expense.amount}</TableCell>

              <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => onEdit(expense)}
                  >
                    Editar
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    disabled={deleting}
                    onClick={() => onDelete(expense._id)}
                  >
                    Eliminar
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ExpensesTable;