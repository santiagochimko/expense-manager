import { Link as RouterLink, Outlet } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography
} from "@mui/material";

const AppLayout = () => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" color="inherit" elevation={1}>
        <Toolbar>
          <Container
            maxWidth="lg"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <Typography
              component={RouterLink}
              to="/dashboard"
              variant="h6"
              color="text.primary"
              sx={{
                textDecoration: "none",
                fontWeight: 700
              }}
            >
              Expense Manager
            </Typography>

            <Box sx={{ display: "flex", gap: 1 }}>
              <Button component={RouterLink} to="/dashboard">
                Dashboard
              </Button>

              <Button component={RouterLink} to="/categories">
                Categorías
              </Button>

              <Button component={RouterLink} to="/expenses">
                Gastos
              </Button>

              <Button component={RouterLink} to="/exchange-rates">
                Tipo de cambio
              </Button>
            </Box>
          </Container>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default AppLayout;