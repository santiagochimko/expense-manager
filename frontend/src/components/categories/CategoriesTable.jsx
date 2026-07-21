import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";

const CategoriesTable = ({ categories, deleting, onEdit, onDelete }) => {
  if (categories.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Sin categorías todavía
        </Typography>
        <Typography color="text.secondary">
          Creá tu primera categoría para clasificar gastos y mejorar tus gráficos.
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <Stack spacing={1.5} sx={{ display: { xs: "flex", md: "none" } }}>
        {categories.map((category) => (
          <Paper key={category._id} sx={{ p: 2.25 }}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    bgcolor: category.color,
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: "0 0 0 6px rgba(20, 17, 15, 0.04)",
                    flex: "0 0 auto",
                  }}
                />

                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography fontWeight={800}>{category.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.description || "Sin descripción"}
                  </Typography>
                </Box>

                <Chip
                  label={category.isActive ? "Activa" : "Inactiva"}
                  size="small"
                  color={category.isActive ? "success" : "default"}
                  variant="outlined"
                />
              </Stack>

              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  onClick={() => onEdit(category)}
                >
                  Editar
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  fullWidth
                  disabled={deleting}
                  onClick={() => onDelete(category)}
                >
                  Eliminar
                </Button>
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>

      <TableContainer component={Paper} sx={{ display: { xs: "none", md: "block" } }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Color</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {categories.map((category) => (
              <TableRow
                key={category._id}
                sx={{
                  "&:hover": {
                    bgcolor: "rgba(200, 169, 106, 0.05)",
                  },
                }}
              >
                <TableCell>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      bgcolor: category.color,
                      border: "1px solid",
                      borderColor: "divider"
                    }}
                  />
                </TableCell>

                <TableCell>
                  <Typography fontWeight={800}>{category.name}</Typography>
                </TableCell>

                <TableCell>
                  <Typography color="text.secondary">
                    {category.description || "Sin descripción"}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Chip
                    label={category.isActive ? "Activa" : "Inactiva"}
                    size="small"
                    color={category.isActive ? "success" : "default"}
                    variant="outlined"
                  />
                </TableCell>

                <TableCell align="right">
                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent="flex-end"
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => onEdit(category)}
                    >
                      Editar
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      disabled={deleting}
                      onClick={() => onDelete(category)}
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
    </>
  );
};

export default CategoriesTable;
