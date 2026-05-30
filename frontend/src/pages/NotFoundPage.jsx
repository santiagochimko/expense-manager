import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Container, Typography } from "@mui/material";

const NotFoundPage = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h3" component="h1" gutterBottom>
          404
        </Typography>

        <Typography variant="h5" gutterBottom>
          Página no encontrada
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 3 }}>
          La ruta que intentaste visitar no existe.
        </Typography>

        <Button
          component={RouterLink}
          to="/dashboard"
          variant="contained"
        >
          Volver al dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;