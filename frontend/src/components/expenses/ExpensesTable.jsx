import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";

import ImagePreviewDialog from "../common/ImagePreviewDialog.jsx";
import { formatCalendarDate } from "../../utils/date.js";
import { formatMoney } from "../../utils/currency.js";

const paymentMethodLabels = {
  cash: "Efectivo",
  debit_card: "Débito",
  credit_card: "Crédito",
  transfer: "Transferencia",
};

const formatDate = formatCalendarDate;

const AmountCell = ({ expense, align = "right" }) => {
  const currency = expense?.currency || "UYU";

  return (
    <Box sx={{ textAlign: align }}>
      <Typography fontWeight={900}>
        {formatMoney(expense?.amount, currency)}
      </Typography>

      {currency !== "UYU" && expense?.amountUYU && (
        <Typography variant="caption" color="text.secondary">
          ≈ {formatMoney(expense.amountUYU, "UYU")}
        </Typography>
      )}
    </Box>
  );
};

const CategoryBadge = ({ category }) => {
  if (!category) {
    return <Typography color="text.secondary">Sin categoría</Typography>;
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box
        sx={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          bgcolor: category?.color || "grey.400",
          border: "1px solid",
          borderColor: "divider",
          flex: "0 0 auto",
        }}
      />

      <Typography variant="body2" fontWeight={700}>
        {category?.name || "Sin categoría"}
      </Typography>
    </Box>
  );
};

const SortableHeader = ({ children, sortKey, sortBy, sortOrder, onSortChange, align }) => {
  const active = sortBy === sortKey;

  return (
    <TableCell align={align} sortDirection={active ? sortOrder : false}>
      <TableSortLabel
        active={active}
        direction={active ? sortOrder : "desc"}
        hideSortIcon={false}
        onClick={() => onSortChange(sortKey)}
        sx={{
          fontWeight: 800,
          "& .MuiTableSortLabel-icon": {
            opacity: active ? 1 : 0.35,
          },
        }}
      >
        {children}
      </TableSortLabel>
    </TableCell>
  );
};

const ExpensesTable = ({
  expenses = [],
  deleting,
  sortBy = "date",
  sortOrder = "desc",
  onSortChange,
  onEdit,
  onDelete,
}) => {
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
        <Typography variant="h6" gutterBottom>
          Sin gastos para mostrar
        </Typography>
        <Typography color="text.secondary">
          Cuando registres movimientos, aparecerán acá con sus categorías y comprobantes.
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <Stack spacing={1.5} sx={{ display: { xs: "flex", lg: "none" } }}>
        {expenses.filter(Boolean).map((expense) => (
          <Paper key={expense?._id} sx={{ p: 2.25 }}>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography fontWeight={900}>{expense?.title || "Sin título"}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {expense?.date ? formatDate(expense.date) : "Sin fecha"}
                  </Typography>
                </Box>

                <AmountCell expense={expense} />
              </Stack>

              {expense?.description && (
                <Typography variant="body2" color="text.secondary">
                  {expense.description}
                </Typography>
              )}

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip
                  label={
                    paymentMethodLabels[expense?.paymentMethod] ||
                    expense?.paymentMethod ||
                    "Sin método"
                  }
                  size="small"
                  variant="outlined"
                />

                <Chip
                  label={expense?.category?.name || "Sin categoría"}
                  size="small"
                  sx={(theme) => ({
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "rgba(56, 189, 248, 0.14)"
                        : "rgba(37, 99, 235, 0.1)",
                    color: "text.primary",
                  })}
                />
              </Stack>

              {expense?.receiptImageUrl ? (
                <Button
                  type="button"
                  variant="outlined"
                  size="small"
                  onClick={() => handleOpenPreview(expense)}
                >
                  Ver comprobante
                </Button>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Sin comprobante adjunto
                </Typography>
              )}

              <Divider />

              <Stack direction="row" spacing={1}>
                <Button variant="outlined" size="small" fullWidth onClick={() => onEdit(expense)}>
                  Editar
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  fullWidth
                  disabled={deleting}
                  onClick={() => onDelete(expense)}
                >
                  Eliminar
                </Button>
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>

      <TableContainer component={Paper} sx={{ display: { xs: "none", lg: "block" } }}>
        <Table>
          <TableHead>
            <TableRow>
              <SortableHeader
                sortKey="date"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={onSortChange}
              >
                Fecha
              </SortableHeader>
              <TableCell>Título</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Método</TableCell>
              <TableCell>Comprobante</TableCell>
              <SortableHeader
                sortKey="amount"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={onSortChange}
                align="right"
              >
                Monto
              </SortableHeader>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {expenses.filter(Boolean).map((expense) => (
              <TableRow
                key={expense?._id}
                sx={(theme) => ({
                  "&:hover": {
                    bgcolor:
                      theme.palette.mode === "dark"
                        ? "rgba(56, 189, 248, 0.05)"
                        : "rgba(37, 99, 235, 0.04)",
                  },
                })}
              >
                <TableCell>
                  {expense?.date ? formatDate(expense.date) : "Sin fecha"}
                </TableCell>

                <TableCell>
                  <Typography fontWeight={800}>
                    {expense?.title || "Sin título"}
                  </Typography>

                  {expense?.description && (
                    <Typography variant="body2" color="text.secondary">
                      {expense.description}
                    </Typography>
                  )}
                </TableCell>

                <TableCell>
                  <CategoryBadge category={expense?.category} />
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
                      sx={{
                        p: 0,
                        width: 76,
                        height: 54,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        overflow: "hidden",
                        cursor: "pointer",
                        bgcolor: "transparent",
                      }}
                    >
                      <Box
                        component="img"
                        src={expense.receiptImageUrl}
                        alt={`Comprobante de ${expense?.title || "gasto"}`}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Sin imagen
                    </Typography>
                  )}
                </TableCell>

                <TableCell align="right">
                  <AmountCell expense={expense} />
                </TableCell>

                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button variant="outlined" size="small" onClick={() => onEdit(expense)}>
                      Editar
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      disabled={deleting}
                      onClick={() => onDelete(expense)}
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