import { useState } from "react";
import {
  Box,
  Button,
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

import ImagePreviewDialog from "../common/ImagePreviewDialog.jsx";

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
  const [previewImage, setPreviewImage] = useState(null);

  const handleOpenPreview = (expense) => {
    if (!expense?.receiptImageUrl) {
      return;
    }

    setPreviewImage({
      url: expense.receiptImageUrl,
      title: expense?.title || "Comprobante",
    });
  };

  const handleClosePreview = () => {
    setPreviewImage(null);
  };

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
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Título</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Método</TableCell>
              <TableCell>Comprobante</TableCell>
              <TableCell align="right">Monto</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {expenses.filter(Boolean).map((expense) => (
              <TableRow key={expense?._id}>
                <TableCell>
                  {expense?.date ? formatDate(expense.date) : "Sin fecha"}
                </TableCell>

                <TableCell>
                  <Typography fontWeight={600}>
                    {expense?.title || "Sin título"}
                  </Typography>

                  {expense?.description && (
                    <Typography variant="body2" color="text.secondary">
                      {expense.description}
                    </Typography>
                  )}
                </TableCell>

                <TableCell>
                  {expense?.category ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          bgcolor: expense.category?.color || "grey.400",
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      />

                      <Typography variant="body2">
                        {expense.category?.name || "Sin categoría"}
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
                      paymentMethodLabels[expense?.paymentMethod] ||
                      expense?.paymentMethod ||
                      "Sin método"
                    }
                    variant="outlined"
                  />
                </TableCell>

                <TableCell>
                  {expense?.receiptImageUrl ? (
                    <Box
                      component="button"
                      type="button"
                      onClick={() => handleOpenPreview(expense)}
                    >
                      <Box
                        component="img"
                        src={expense.receiptImageUrl}
                        alt={`Comprobante de ${expense?.title || "gasto"}`}
                      />
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Sin imagen
                    </Typography>
                  )}
                </TableCell>

                <TableCell align="right">${expense?.amount ?? 0}</TableCell>

                <TableCell align="right">
                  <Button onClick={() => onEdit(expense)}>Editar</Button>

                  <Button
                    color="error"
                    disabled={deleting}
                    onClick={() => onDelete(expense)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ImagePreviewDialog
        open={Boolean(previewImage)}
        imageUrl={previewImage?.url || ""}
        title={previewImage?.title || "Comprobante"}
        onClose={handleClosePreview}
      />
    </>
  );
};

export default ExpensesTable;
