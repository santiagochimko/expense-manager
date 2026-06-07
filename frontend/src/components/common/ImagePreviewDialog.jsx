import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const ImagePreviewDialog = ({ open, imageUrl, title, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{title || "Comprobante"}</DialogTitle>

      <DialogContent>
        <Box
          component="img"
          src={imageUrl}
          alt={title || "Comprobante"}
          sx={{
            width: "100%",
            maxHeight: "70vh",
            objectFit: "contain",
            borderRadius: 1,
            border: "1px solid",
            borderColor: "divider",
          }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImagePreviewDialog;