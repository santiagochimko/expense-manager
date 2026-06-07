import {
  Alert,
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";

const ReceiptImageUpload = ({
  imageUrl,
  loading,
  error,
  onUpload,
  onRemove,
}) => {
  const handleChange = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      onUpload(file);
    }

    event.target.value = "";
  };

  return (
    <Stack spacing={1}>
      <Typography variant="body2" fontWeight={600}>
        Comprobante
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {imageUrl && (
        <Box
          component="img"
          src={imageUrl}
          alt="Comprobante del gasto"
          sx={{
            width: "100%",
            maxHeight: 220,
            objectFit: "cover",
            borderRadius: 1,
            border: "1px solid",
            borderColor: "divider",
          }}
        />
      )}

      <Box sx={{ display: "flex", gap: 1 }}>
        <Button variant="outlined" component="label" disabled={loading}>
          {loading ? "Subiendo..." : imageUrl ? "Cambiar imagen" : "Subir imagen"}

          <input
            type="file"
            hidden
            accept="image/jpeg,image/png,image/webp"
            onChange={handleChange}
          />
        </Button>

        {imageUrl && (
          <Button
            type="button"
            variant="text"
            color="error"
            disabled={loading}
            onClick={onRemove}
          >
            Quitar
          </Button>
        )}
      </Box>

      <Typography variant="caption" color="text.secondary">
        Formatos permitidos: JPG, PNG o WEBP. Máximo 2MB.
      </Typography>
    </Stack>
  );
};

export default ReceiptImageUpload;