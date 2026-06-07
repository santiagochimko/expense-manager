import { Link as RouterLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

import { logout } from "../../features/auth/authSlice.js";
import {
  selectIsAdmin,
  selectUser,
} from "../../features/auth/authSelectors.js";

const AppLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" color="inherit" elevation={1}>
        <Toolbar>
          <Container
            maxWidth="lg"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Typography
              component={RouterLink}
              to={isAdmin ? "/admin/dashboard" : "/dashboard"}
              variant="h6"
              color="text.primary"
              sx={{
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Expense Manager
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              {isAdmin ? (
                <>
                  <Button component={RouterLink} to="/admin/dashboard">
                    Dashboard admin
                  </Button>                  
                </>
              ) : (
                <>
                  <Button component={RouterLink} to="/dashboard">
                    Dashboard
                  </Button>

                  <Button component={RouterLink} to="/exchange-rates">
                    Tipo de cambio
                  </Button>
                </>
              )}
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              {user && (
                <Chip
                  label={`${user.username} · ${user.role}`}
                  size="small"
                  variant="outlined"
                />
              )}

              <Button variant="outlined" onClick={handleLogout}>
                Salir
              </Button>
            </Stack>
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
