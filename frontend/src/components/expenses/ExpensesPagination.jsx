import { Box, Button, Stack, Typography } from "@mui/material";

const ExpensesPagination = ({
  page,
  total,
  totalPages,
  loading,
  onPageChange
}) => {
  if (total === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2
      }}
    >
      <Typography color="text.secondary">
        Página {page} de {totalPages} · {total} resultados
      </Typography>

      <Stack direction="row" spacing={1}>
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
      </Stack>
    </Box>
  );
};

export default ExpensesPagination;