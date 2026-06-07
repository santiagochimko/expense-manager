import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const ConfirmDialog = ({
  open,
  title,
  description,
  confirmText = "Eliminar",
  cancelText = "Cancelar",
  loading = false,
  onConfirm,
  onClose,
}) => {
  return (
    <Dialog open={open} onClose={loading ? undefined : onClose}>
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>

        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={loading}
        >
          {loading ? "Eliminando..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;