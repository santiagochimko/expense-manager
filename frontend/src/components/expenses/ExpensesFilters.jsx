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

const filtersSchema = Yup.object({
  search: Yup.string().trim(),
  category: Yup.string(),
});

const ExpensesFilters = ({
  filters,
  categories = [],
  onChange,
  onApply,
  onClear,
}) => {
  const formik = useFormik({
    initialValues: {
      search: filters.search || "",
      category: filters.category || "",
    },
    validationSchema: filtersSchema,
    enableReinitialize: true,
    validateOnChange: false,
    onSubmit: (values) => {
      const nextFilters = {
        search: values.search.trim(),
        category: values.category,
      };

      onChange(nextFilters);
      onApply(nextFilters);
    },
  });

  const handleClear = () => {
    const emptyFilters = {
      search: "",
      category: "",
    };

    formik.resetForm({
      values: emptyFilters,
    });

    onChange(emptyFilters);
    onClear();
  };

  return (
    <Stack
      direction={{ xs: "column", lg: "row" }}
      spacing={1.5}
      component="form"
      onSubmit={formik.handleSubmit}
      alignItems={{ xs: "stretch", lg: "flex-start" }}
    >
      <TextField
        label="Buscar"
        name="search"
        value={formik.values.search}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        fullWidth
        placeholder="Buscar por título"
        error={Boolean(formik.touched.search) && Boolean(formik.errors.search)}
        helperText={formik.touched.search ? formik.errors.search : ""}
        sx={{ flex: { lg: 1.3 } }}
      />

      <FormControl
        fullWidth
        error={
          Boolean(formik.touched.category) && Boolean(formik.errors.category)
        }
        sx={{ flex: { lg: 1 } }}
      >
        <InputLabel id="filter-category-label">Categoría</InputLabel>

        <Select
          labelId="filter-category-label"
          label="Categoría"
          name="category"
          value={formik.values.category}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <MenuItem value="">Todas</MenuItem>

          {categories.map((category) => (
            <MenuItem key={category._id} value={category._id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>

        {formik.touched.category && formik.errors.category && (
          <FormHelperText>{formik.errors.category}</FormHelperText>
        )}
      </FormControl>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
        <Button type="submit" variant="contained" disabled={!formik.isValid}>
          Aplicar
        </Button>

        <Button type="button" variant="outlined" onClick={handleClear}>
          Limpiar
        </Button>
      </Stack>
    </Stack>
  );
};

export default ExpensesFilters;
