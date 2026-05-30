import { Container, Paper, Typography } from "@mui/material";

const RegisterPage = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Crear cuenta
        </Typography>

        <Typography color="text.secondary">
          Pantalla de registro. La implementare en la siguiente etapa.
        </Typography>
      </Paper>
    </Container>
  );
};

export default RegisterPage;