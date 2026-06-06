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

const usersFiltersSchema = Yup.object({
  search: Yup.string().trim().max(100, "Máximo 100 caracteres"),
  role: Yup.string().oneOf(["", "user", "admin"], "Rol inválido"),
  plan: Yup.string().oneOf(["", "plus", "premium"], "Plan inválido"),
});

const AdminUsersFilters = ({ filters, onChange, onApply, onClear }) => {
  const formik = useFormik({
    initialValues: {
      search: filters.search || "",
      role: filters.role || "",
      plan: filters.plan || "",
    },
    validationSchema: usersFiltersSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const nextFilters = {
        search: values.search.trim(),
        role: values.role,
        plan: values.plan,
      };

      onChange(nextFilters);
      onApply(nextFilters);
    },
  });

  const handleClear = () => {
    const emptyFilters = {
      search: "",
      role: "",
      plan: "",
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
        placeholder="Usuario o email"
        error={Boolean(formik.touched.search) && Boolean(formik.errors.search)}
        helperText={formik.touched.search ? formik.errors.search : ""}
      />

      <FormControl fullWidth>
        <InputLabel id="admin-user-role-label">Rol</InputLabel>
        <Select
          labelId="admin-user-role-label"
          label="Rol"
          name="role"
          value={formik.values.role}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="user">Usuario</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>
        {formik.touched.role && formik.errors.role && (
          <FormHelperText>{formik.errors.role}</FormHelperText>
        )}
      </FormControl>

      <FormControl fullWidth>
        <InputLabel id="admin-user-plan-label">Plan</InputLabel>
        <Select
          labelId="admin-user-plan-label"
          label="Plan"
          name="plan"
          value={formik.values.plan}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="plus">Plus</MenuItem>
          <MenuItem value="premium">Premium</MenuItem>
        </Select>
        {formik.touched.plan && formik.errors.plan && (
          <FormHelperText>{formik.errors.plan}</FormHelperText>
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

export default AdminUsersFilters;