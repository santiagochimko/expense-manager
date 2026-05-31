import { useState } from "react";
import { Link as RouterLink, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { registerUser } from "../features/auth/authThunks.js";
import { clearAuthError } from "../features/auth/authSlice.js";
import {
  selectAuthError,
  selectAuthLoading,
  selectAuthValidationErrors,
  selectIsAuthenticated,
  selectUser,
} from "../features/auth/authSelectors.js";

const getFieldErrors = (validationErrors) => {
  const errors = {};

  validationErrors.forEach((item) => {
    errors[item.field] = item.message;
  });

  return errors;
};

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const validationErrors = useSelector(selectAuthValidationErrors);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const fieldErrors = getFieldErrors(validationErrors);

  const usernameIsValid = formData.username.trim().length >= 3;
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const passwordIsValid = formData.password.length >= 6;
  const confirmPasswordIsValid =
    formData.confirmPassword !== "" &&
    formData.confirmPassword === formData.password;
  const roleIsValid = formData.role === "user" || formData.role === "admin";

  const isFormValid =
    usernameIsValid &&
    emailIsValid &&
    passwordIsValid &&
    confirmPasswordIsValid &&
    roleIsValid;

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

    const result = await dispatch(registerUser(formData));

    if (registerUser.fulfilled.match(result)) {
      const registeredUser = result.payload.user;

      navigate(
        registeredUser.role === "admin" ? "/admin/dashboard" : "/dashboard",
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

              <FormControl fullWidth required error={Boolean(fieldErrors.role)}>
                <InputLabel id="role-label">Tipo de usuario</InputLabel>

                <Select
                  labelId="role-label"
                  label="Tipo de usuario"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <MenuItem value="user">Usuario</MenuItem>
                  <MenuItem value="admin">Administrador</MenuItem>
                </Select>

                <FormHelperText>
                  {fieldErrors.role ||
                    "Seleccioná el tipo de usuario para el registro"}
                </FormHelperText>
              </FormControl>

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
