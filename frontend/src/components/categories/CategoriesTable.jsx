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
        <Typography color="text.secondary">
          Todavía no tenés categorías creadas.
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
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
            <TableRow key={category._id}>
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

              <TableCell>{category.name}</TableCell>

              <TableCell>
                {category.description || "Sin descripción"}
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
  );
};

export default CategoriesTable;