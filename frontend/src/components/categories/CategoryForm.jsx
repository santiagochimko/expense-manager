import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  Stack,
  TextField,
} from "@mui/material";

const categorySchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Mínimo 2 caracteres")
    .max(50, "Máximo 50 caracteres")
    .required("El nombre es obligatorio"),
  description: Yup.string()
    .trim(),
  color: Yup.string()
    .trim(),
});

const getInitialValues = (selectedCategory) => {
  if (selectedCategory) {
    return {
      name: selectedCategory.name || "",
      description: selectedCategory.description || "",
      color: selectedCategory.color || "#2563eb",
    };
  }

  return {
    name: "",
    description: "",
    color: "#2563eb",
  };
};

const getBackendFieldError = (validationErrors, fieldName) => {
  const error = validationErrors.find((item) => {
    return item.field === fieldName;
  });

  return error?.message || "";
};

const CategoryForm = ({
  selectedCategory,
  validationErrors = [],
  saving,
  onSubmit,
  onCancel,
}) => {
  const formik = useFormik({
    initialValues: getInitialValues(selectedCategory),
    validationSchema: categorySchema,
    enableReinitialize: true,
    validateOnChange: false,
    onSubmit: (values) => {
      onSubmit({
        name: values.name.trim(),
        description: values.description.trim(),
        color: values.color,
      });
    },
  });

  const nameError =
    (formik.touched.name && formik.errors.name) ||
    getBackendFieldError(validationErrors, "name");

  const descriptionError =
    (formik.touched.description && formik.errors.description) ||
    getBackendFieldError(validationErrors, "description");

  const colorError =
    (formik.touched.color && formik.errors.color) ||
    getBackendFieldError(validationErrors, "color");

  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      <Stack spacing={2.25}>
        <TextField
          label="Nombre"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          fullWidth
          required
          error={Boolean(nameError)}
          helperText={nameError || "Ejemplo: Supermercado"}
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
          helperText={
            descriptionError || "Breve descripción de los gastos incluidos"
          }
        />

        <TextField
          label="Color"
          name="color"
          type="color"
          value={formik.values.color}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          fullWidth
          required
          error={Boolean(colorError)}
          helperText={colorError || "Color identificador de la categoría"}
          sx={{
            "& input": {
              minHeight: 48,
              cursor: "pointer",
            },
          }}
        />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
          <Button
            type="submit"
            variant="contained"
            disabled={saving}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            {saving
              ? "Guardando..."
              : selectedCategory
                ? "Actualizar categoría"
                : "Crear categoría"}
          </Button>

          {selectedCategory && (
            <Button type="button" variant="outlined" onClick={onCancel}>
              Cancelar edición
            </Button>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default CategoryForm;
