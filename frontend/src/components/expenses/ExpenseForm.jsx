import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { uploadReceiptImage } from "../../features/uploads/uploadsThunks.js";
import {
  selectUploadError,
  selectUploadLoading,
} from "../../features/uploads/uploadsSelectors.js";
import { clearUploadError } from "../../features/uploads/uploadsSlice.js";
import {
  getDateInputValue,
  getLocalDateInputValue,
} from "../../utils/date.js";

const confidenceLabels = {
  low: "baja",
  medium: "media",
  high: "alta",
};

const paymentMethodValues = [
  "cash",
  "debit_card",
  "credit_card",
  "transfer",
];

const expenseSchema = Yup.object({
  title: Yup.string()
    .trim()
    .min(2, "Mínimo 2 caracteres")
    .max(100, "Máximo 100 caracteres")
    .required("El título es obligatorio"),
  description: Yup.string().trim(),
  amount: Yup.number()
    .typeError("El monto debe ser numérico")
    .positive("El monto debe ser mayor a 0")
    .required("El monto es obligatorio"),
  date: Yup.date()
    .typeError("La fecha debe ser válida")
    .required("La fecha es obligatoria"),
  paymentMethod: Yup.string()
    .oneOf(paymentMethodValues, "Método de pago inválido"),
  category: Yup.string().required("La categoría es obligatoria"),
  receiptImageUrl: Yup.string()
    .trim()
    .test("is-url-or-empty", "Debe ser una URL válida", (value) => {
      if (!value) {
        return true;
      }

      return Yup.string().url().isValidSync(value);
    }),
});

const getTodayDate = () => {
  return getLocalDateInputValue();
};

const getInitialValues = (selectedExpense) => {
  if (selectedExpense) {
    return {
      title: selectedExpense.title || "",
      description: selectedExpense.description || "",
      amount: selectedExpense.amount || "",
      date: selectedExpense.date
        ? getDateInputValue(selectedExpense.date)
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

const getBackendFieldError = (validationErrors, fieldName) => {
  const error = validationErrors.find((item) => {
    return item.field === fieldName;
  });

  return error?.message || "";
};

const ExpenseForm = ({
  selectedExpense,
  categories = [],
  validationErrors = [],
  saving,
  aiLoading,
  aiError,
  aiSuggestion,
  onSubmit,
  onCancel,
  onSuggestCategory,
}) => {
  const dispatch = useDispatch();

  const uploadLoading = useSelector(selectUploadLoading);
  const uploadError = useSelector(selectUploadError);

  const formik = useFormik({
    initialValues: getInitialValues(selectedExpense),
    validationSchema: expenseSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const expenseData = {
        title: values.title.trim(),
        description: values.description.trim(),
        amount: Number(values.amount),
        date: values.date,
        paymentMethod: values.paymentMethod,
        category: values.category,
      };

      if (values.receiptImageUrl.trim() !== "") {
        expenseData.receiptImageUrl = values.receiptImageUrl.trim();
      }

      onSubmit(expenseData);
    },
  });

  const canSuggestCategory =
    formik.values.title.trim().length >= 2 &&
    Number(formik.values.amount) > 0 &&
    !aiLoading &&
    !selectedExpense;

  const handleSuggestCategory = async () => {
    if (!canSuggestCategory || !onSuggestCategory) {
      return;
    }

    const suggestion = await onSuggestCategory({
      title: formik.values.title.trim(),
      description: formik.values.description.trim(),
      amount: Number(formik.values.amount),
    });

    if (suggestion?.suggestedCategoryId) {
      formik.setFieldValue("category", suggestion.suggestedCategoryId);
    }
  };

  const handleUploadReceipt = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    dispatch(clearUploadError());

    const result = await dispatch(uploadReceiptImage(file));

    if (uploadReceiptImage.fulfilled.match(result)) {
      formik.setFieldValue("receiptImageUrl", result.payload.url);
    }

    event.target.value = "";
  };

  const handleRemoveReceipt = () => {
    formik.setFieldValue("receiptImageUrl", "");
    dispatch(clearUploadError());
  };

  const getFieldError = (fieldName) => {
    return (
      (formik.touched[fieldName] && formik.errors[fieldName]) ||
      getBackendFieldError(validationErrors, fieldName)
    );
  };

  const titleError = getFieldError("title");
  const descriptionError = getFieldError("description");
  const amountError = getFieldError("amount");
  const dateError = getFieldError("date");
  const paymentMethodError = getFieldError("paymentMethod");
  const categoryError = getFieldError("category");
  const receiptImageUrlError = getFieldError("receiptImageUrl");

  const receiptError = uploadError || receiptImageUrlError;

  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      <Stack spacing={2}>
        <TextField
          label="Título"
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          fullWidth
          required
          error={Boolean(titleError)}
          helperText={titleError || "Ejemplo: Compra supermercado"}
        />

        <TextField
          label="Descripción"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          fullWidth
          multiline
          minRows={3}
          error={Boolean(descriptionError)}
          helperText={descriptionError || "Detalle opcional del gasto"}
        />

        <TextField
          label="Monto"
          name="amount"
          type="number"
          value={formik.values.amount}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          fullWidth
          required
          error={Boolean(amountError)}
          helperText={amountError || "Debe ser mayor a 0"}
        />

        {!selectedExpense && (
          <Button
            type="button"
            variant="outlined"
            disabled={!canSuggestCategory}
            onClick={handleSuggestCategory}
          >
            {aiLoading ? "Sugiriendo..." : "Sugerir categoría con IA"}
          </Button>
        )}

        {aiError && <Alert severity="warning">{aiError}</Alert>}

        {aiSuggestion?.suggestedCategoryName && (
          <Alert severity="success">
            Categoría sugerida: {aiSuggestion.suggestedCategoryName}. Confianza:{" "}
            {confidenceLabels[aiSuggestion.confidence] ||
              aiSuggestion.confidence}
            . {aiSuggestion.reason}
          </Alert>
        )}

        {aiSuggestion &&
          !aiSuggestion.suggestedCategoryId &&
          !aiSuggestion.suggestedCategoryName && (
            <Alert severity="info">
              No se encontró una categoría sugerida. Confianza:{" "}
              {confidenceLabels[aiSuggestion.confidence] ||
                aiSuggestion.confidence ||
                "baja"}
              . {aiSuggestion.reason}
            </Alert>
          )}

        <TextField
          label="Fecha"
          name="date"
          type="date"
          value={formik.values.date}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          fullWidth
          required
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          error={Boolean(dateError)}
          helperText={dateError || "Fecha del gasto"}
        />

        <FormControl fullWidth required error={Boolean(categoryError)}>
          <InputLabel id="expense-category-label">Categoría</InputLabel>

          <Select
            labelId="expense-category-label"
            label="Categoría"
            name="category"
            value={formik.values.category}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>

          <FormHelperText>
            {categoryError || "Seleccioná una categoría"}
          </FormHelperText>
        </FormControl>

        <FormControl fullWidth error={Boolean(paymentMethodError)}>
          <InputLabel id="payment-method-label">Método de pago</InputLabel>

          <Select
            labelId="payment-method-label"
            label="Método de pago"
            name="paymentMethod"
            value={formik.values.paymentMethod}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <MenuItem value="cash">Efectivo</MenuItem>
            <MenuItem value="debit_card">Tarjeta de débito</MenuItem>
            <MenuItem value="credit_card">Tarjeta de crédito</MenuItem>
            <MenuItem value="transfer">Transferencia</MenuItem>
          </Select>

          {paymentMethodError && (
            <FormHelperText>{paymentMethodError}</FormHelperText>
          )}
        </FormControl>

        <Stack spacing={1}>
          <Typography variant="body2" fontWeight={600}>
            Comprobante del gasto
          </Typography>

          {receiptError && <Alert severity="error">{receiptError}</Alert>}

          {formik.values.receiptImageUrl && (
            <Box
              component="img"
              src={formik.values.receiptImageUrl}
              alt="Comprobante del gasto"
              sx={{
                width: "100%",
                maxHeight: 220,
                objectFit: "cover",
                borderRadius: 1,
                border: "1px solid",
                borderColor: "divider",
              }}
            />
          )}

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button variant="outlined" component="label" disabled={uploadLoading}>
              {uploadLoading
                ? "Subiendo..."
                : formik.values.receiptImageUrl
                  ? "Cambiar comprobante"
                  : "Subir comprobante"}

              <input
                type="file"
                hidden
                accept="image/jpeg,image/png,image/webp"
                onChange={handleUploadReceipt}
              />
            </Button>

            {formik.values.receiptImageUrl && (
              <Button
                type="button"
                variant="text"
                color="error"
                disabled={uploadLoading}
                onClick={handleRemoveReceipt}
              >
                Quitar
              </Button>
            )}
          </Box>

          <Typography variant="caption" color="text.secondary">
            Formatos permitidos: JPG, PNG o WEBP. Máximo 2MB.
          </Typography>
        </Stack>

        <Box
          sx={{
            display: "flex",
            gap: 1,
          }}
        >
          <Button
            type="submit"
            variant="contained"
            disabled={!formik.isValid || saving || uploadLoading}
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
        </Box>
      </Stack>
    </Box>
  );
};

export default ExpenseForm;
