import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";

const expensesFiltersSchema = Yup.object({
  search: Yup.string().trim().max(100, "Máximo 100 caracteres"),
  isActive: Yup.string().oneOf(["", "true", "false"], "Estado inválido"),
});

const AdminExpensesFilters = ({ filters, onChange, onApply, onClear }) => {
  const formik = useFormik({
    initialValues: {
      search: filters.search || "",
      isActive: filters.isActive || "",
    },
    validationSchema: expensesFiltersSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const nextFilters = {
        search: values.search.trim(),
        isActive: values.isActive,
      };

      onChange(nextFilters);
      onApply(nextFilters);
    },
  });

  const handleClear = () => {
    const emptyFilters = {
      search: "",
      isActive: "",
    };

    formik.resetForm({ values: emptyFilters });
    onChange(emptyFilters);
    onClear();
  };

  return (
    <Stack
      component="form"
      onSubmit={formik.handleSubmit}
      direction={{ xs: "column", md: "row" }}
      spacing={2}
    >
      <TextField
        label="Buscar"
        name="search"
        value={formik.values.search}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        fullWidth
        placeholder="Título del gasto"
        error={Boolean(formik.touched.search) && Boolean(formik.errors.search)}
        helperText={formik.touched.search ? formik.errors.search : ""}
      />

      <FormControl fullWidth>
        <InputLabel id="admin-expense-active-label">Estado</InputLabel>
        <Select
          labelId="admin-expense-active-label"
          label="Estado"
          name="isActive"
          value={formik.values.isActive}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="true">Activos</MenuItem>
          <MenuItem value="false">Eliminados</MenuItem>
        </Select>
        {formik.touched.isActive && formik.errors.isActive && (
          <FormHelperText>{formik.errors.isActive}</FormHelperText>
        )}
      </FormControl>

      <Button type="submit" variant="contained" disabled={!formik.isValid}>
        Aplicar
      </Button>

      <Button type="button" variant="outlined" onClick={handleClear}>
        Limpiar
      </Button>
    </Stack>
  );
};

export default AdminExpensesFilters;