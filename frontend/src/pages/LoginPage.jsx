import { Container, Paper, Typography } from "@mui/material";

const LoginPage = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Iniciar sesión
        </Typography>

        <Typography color="text.secondary">
          Pantalla de login. La implementare en la siguiente etapa.
        </Typography>
      </Paper>
    </Container>
  );
};

export default LoginPage;