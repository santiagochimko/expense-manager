import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";

const getTodayDate = () => {
  return new Date().toISOString().slice(0, 10);
};

const getInitialFormData = (selectedExpense) => {
  if (selectedExpense) {
    return {
      title: selectedExpense.title || "",
      description: selectedExpense.description || "",
      amount: selectedExpense.amount || "",
      date: selectedExpense.date
        ? new Date(selectedExpense.date).toISOString().slice(0, 10)
        : getTodayDate(),
      paymentMethod: selectedExpense.paymentMethod || "cash",
      category:
        typeof selectedExpense.category === "object"
          ? selectedExpense.category._id
          : selectedExpense.category || "",
      receiptImageUrl: selectedExpense.receiptImageUrl || "",
    };
  }

  return {
    title: "",
    description: "",
    amount: "",
    date: getTodayDate(),
    paymentMethod: "cash",
    category: "",
    receiptImageUrl: "",
  };
};

const getFieldErrors = (validationErrors) => {
  const errors = {};

  validationErrors.forEach((item) => {
    errors[item.field] = item.message;
  });

  return errors;
};

const ExpenseForm = ({
  selectedExpense,
  categories,
  validationErrors = [],
  saving,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState(() =>
    getInitialFormData(selectedExpense),
  );

  const fieldErrors = getFieldErrors(validationErrors);

  const titleIsValid = formData.title.trim().length >= 2;
  const amountIsValid = Number(formData.amount) > 0;
  const dateIsValid = formData.date !== "";
  const categoryIsValid = formData.category !== "";

  const isFormValid =
    titleIsValid && amountIsValid && dateIsValid && categoryIsValid;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isFormValid) {
      return;
    }

    const expenseData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      amount: Number(formData.amount),
      date: formData.date,
      paymentMethod: formData.paymentMethod,
      category: formData.category,
    };

    if (formData.receiptImageUrl.trim() !== "") {
      expenseData.receiptImageUrl = formData.receiptImageUrl.trim();
    }

    onSubmit(expenseData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          label="Título"
          name="title"
          value={formData.title}
          onChange={handleChange}
          fullWidth
          required
          error={Boolean(fieldErrors.title)}
          helperText={fieldErrors.title || "Ejemplo: Compra supermercado"}
        />

        <TextField
          label="Descripción"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          multiline
          minRows={3}
          error={Boolean(fieldErrors.description)}
          helperText={fieldErrors.description || "Detalle opcional del gasto"}
        />

        <TextField
          label="Monto"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={handleChange}
          fullWidth
          required
          error={Boolean(fieldErrors.amount)}
          helperText={fieldErrors.amount || "Debe ser mayor a 0"}
        />

        <TextField
          label="Fecha"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
          error={Boolean(fieldErrors.date)}
          helperText={fieldErrors.date || "Fecha del gasto"}
        />

        <FormControl fullWidth required error={Boolean(fieldErrors.category)}>
          <InputLabel id="expense-category-label">Categoría</InputLabel>

          <Select
            labelId="expense-category-label"
            label="Categoría"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>

          <FormHelperText>
            {fieldErrors.category || "Seleccioná una categoría"}
          </FormHelperText>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="payment-method-label">Método de pago</InputLabel>

          <Select
            labelId="payment-method-label"
            label="Método de pago"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
          >
            <MenuItem value="cash">Efectivo</MenuItem>
            <MenuItem value="debit_card">Tarjeta de débito</MenuItem>
            <MenuItem value="credit_card">Tarjeta de crédito</MenuItem>
            <MenuItem value="transfer">Transferencia</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="URL del comprobante"
          name="receiptImageUrl"
          value={formData.receiptImageUrl}
          onChange={handleChange}
          fullWidth
          error={Boolean(fieldErrors.receiptImageUrl)}
          helperText={
            fieldErrors.receiptImageUrl ||
            "Opcional. Debe ser una URL válida si se completa"
          }
        />

        <Stack direction="row" spacing={1}>
          <Button
            type="submit"
            variant="contained"
            disabled={!isFormValid || saving}
          >
            {saving
              ? "Guardando..."
              : selectedExpense
                ? "Actualizar gasto"
                : "Crear gasto"}
          </Button>

          {selectedExpense && (
            <Button type="button" variant="outlined" onClick={onCancel}>
              Cancelar edición
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default ExpenseForm;