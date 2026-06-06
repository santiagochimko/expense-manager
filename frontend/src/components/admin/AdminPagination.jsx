import { Box, Button, Typography } from "@mui/material";

const AdminPagination = ({ page, total, totalPages, loading, onPageChange }) => {
  if (total === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Typography color="text.secondary">
        Página {page} de {totalPages} · {total} resultados
      </Typography>

      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          variant="outlined"
          disabled={loading || page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Anterior
        </Button>

        <Button
          variant="outlined"
          disabled={loading || page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Siguiente
        </Button>
      </Box>
    </Box>
  );
};

export default AdminPagination;