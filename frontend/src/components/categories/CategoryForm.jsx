import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Stack,
  TextField
} from "@mui/material";

const getInitialFormData = (selectedCategory) => {
  if (selectedCategory) {
    return {
      name: selectedCategory.name || "",
      description: selectedCategory.description || "",
      color: selectedCategory.color || "#1976d2"
    };
  }

  return {
    name: "",
    description: "",
    color: "#1976d2"
  };
};

const CategoryForm = ({
  selectedCategory,
  validationErrors = [],
  saving,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState(() =>
    getInitialFormData(selectedCategory)
  );

  const fieldErrors = useMemo(() => {
    const errors = {};

    validationErrors.forEach((item) => {
      errors[item.field] = item.message;
    });

    return errors;
  }, [validationErrors]);

  const nameIsValid = formData.name.trim().length >= 2;
  const colorIsValid = /^#[0-9A-Fa-f]{6}$/.test(formData.color);

  const isFormValid = nameIsValid && colorIsValid;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isFormValid) {
      return;
    }

    onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim(),
      color: formData.color
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          label="Nombre"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
          error={Boolean(fieldErrors.name)}
          helperText={fieldErrors.name || "Ejemplo: Supermercado"}
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
          helperText={
            fieldErrors.description ||
            "Breve descripción de los gastos incluidos"
          }
        />

        <TextField
          label="Color"
          name="color"
          type="color"
          value={formData.color}
          onChange={handleChange}
          fullWidth
          required
          error={Boolean(fieldErrors.color)}
          helperText={fieldErrors.color || "Color identificador de la categoría"}
        />

        <Stack direction="row" spacing={1}>
          <Button
            type="submit"
            variant="contained"
            disabled={!isFormValid || saving}
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