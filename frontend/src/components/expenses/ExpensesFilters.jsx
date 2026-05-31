import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";

const ExpensesFilters = ({
  filters,
  categories,
  onChange,
  onApply,
  onClear,
}) => {
  const handleChange = (event) => {
    const { name, value } = event.target;

    onChange({
      ...filters,
      [name]: value,
    });
  };

  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
      <TextField
        label="Buscar"
        name="search"
        value={filters.search}
        onChange={handleChange}
        fullWidth
        placeholder="Buscar por título"
      />

      <FormControl fullWidth>
        <InputLabel id="filter-category-label">Categoría</InputLabel>

        <Select
          labelId="filter-category-label"
          label="Categoría"
          name="category"
          value={filters.category}
          onChange={handleChange}
        >
          <MenuItem value="">Todas</MenuItem>

          {categories.map((category) => (
            <MenuItem key={category._id} value={category._id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="contained" onClick={onApply}>
        Aplicar
      </Button>

      <Button variant="outlined" onClick={onClear}>
        Limpiar
      </Button>
    </Stack>
  );
};

export default ExpensesFilters;