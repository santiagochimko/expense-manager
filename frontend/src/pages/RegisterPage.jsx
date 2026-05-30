import { useMemo, useState } from "react";
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
  Typography
} from "@mui/material";

import { registerUser } from "../features/auth/authThunks.js";
import { clearAuthError } from "../features/auth/authSlice.js";
import {
  selectAuthError,
  selectAuthLoading,
  selectAuthValidationErrors,
  selectIsAuthenticated
} from "../features/auth/authSelectors.js";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const validationErrors = useSelector(selectAuthValidationErrors);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const fieldErrors = useMemo(() => {
    const errors = {};

    validationErrors.forEach((item) => {
      errors[item.field] = item.message;
    });

    return errors;
  }, [validationErrors]);

  const usernameIsValid = formData.username.trim().length >= 3;
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const passwordIsValid = formData.password.length >= 6;
  const confirmPasswordIsValid =
    formData.confirmPassword !== "" &&
    formData.confirmPassword === formData.password;

  const isFormValid =
    usernameIsValid &&
    emailIsValid &&
    passwordIsValid &&
    confirmPasswordIsValid;

  const handleChange = (event) => {
    const { name, value } = event.target;

    dispatch(clearAuthError());

    setFormData((currentData) => ({
      ...currentData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isFormValid) {
      return;
    }

    const result = await dispatch(registerUser(formData));

    if (registerUser.fulfilled.match(result)) {
      navigate("/dashboard", { replace: true });
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Crear cuenta
            </Typography>

            <Typography color="text.secondary">
              Registrate para comenzar a gestionar tus gastos.
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
                error={Boolean(fieldErrors.username)}
                helperText={fieldErrors.username || "Mínimo 3 caracteres"}
              />

              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
                error={Boolean(fieldErrors.email)}
                helperText={fieldErrors.email || "Ingresá un email válido"}
              />

              <TextField
                label="Contraseña"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                required
                error={Boolean(fieldErrors.password)}
                helperText={fieldErrors.password || "Mínimo 6 caracteres"}
              />

              <TextField
                label="Repetir contraseña"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                fullWidth
                required
                error={
                  Boolean(fieldErrors.confirmPassword) ||
                  (formData.confirmPassword !== "" && !confirmPasswordIsValid)
                }
                helperText={
                  fieldErrors.confirmPassword ||
                  (formData.confirmPassword !== "" && !confirmPasswordIsValid
                    ? "Las contraseñas no coinciden"
                    : "Debe coincidir con la contraseña")
                }
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={!isFormValid || loading}
              >
                {loading ? "Creando cuenta..." : "Crear cuenta"}
              </Button>
            </Stack>
          </Box>

          <Typography variant="body2" color="text.secondary">
            ¿Ya tenés cuenta?{" "}
            <Link component={RouterLink} to="/login">
              Iniciá sesión
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
};

export default RegisterPage;