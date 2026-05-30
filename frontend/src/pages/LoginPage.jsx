import { useState } from "react";
import { Link as RouterLink, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Box,
  Button,
  Container,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { loginUser } from "../features/auth/authThunks.js";
import { clearAuthError } from "../features/auth/authSlice.js";
import {
  selectAuthError,
  selectAuthLoading,
  selectIsAuthenticated,
  selectUser,
} from "../features/auth/authSelectors.js";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const isFormValid =
    formData.username.trim() !== "" && formData.password !== "";

  const handleChange = (event) => {
    const { name, value } = event.target;

    dispatch(clearAuthError());

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isFormValid) {
      return;
    }

    const result = await dispatch(loginUser(formData));

    if (loginUser.fulfilled.match(result)) {
      const loggedUser = result.payload.user;

      navigate(
        loggedUser.role === "admin" ? "/admin/dashboard" : "/dashboard",
        { replace: true },
      );
    }
  };

  if (isAuthenticated && user) {
    return (
      <Navigate
        to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
        replace
      />
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Iniciar sesión
            </Typography>

            <Typography color="text.secondary">
              Ingresá con tu usuario y contraseña.
            </Typography>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Usuario"
                name="username"
                value={formData.username}
                onChange={handleChange}
                fullWidth
                required
              />

              <TextField
                label="Contraseña"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                required
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={!isFormValid || loading}
              >
                {loading ? "Ingresando..." : "Ingresar"}
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2" color="text.secondary">
            ¿No tenés cuenta?{" "}
            <Link component={RouterLink} to="/register">
              Registrate
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
};

export default LoginPage;
