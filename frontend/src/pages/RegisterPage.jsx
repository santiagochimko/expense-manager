import { Link as RouterLink, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
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
  selectIsAuthenticated,
  selectUser,
} from "../features/auth/authSelectors.js";

const registerSchema = Yup.object({
  username: Yup.string()
    .trim()
    .min(3, "Mínimo 3 caracteres")
    .max(30, "Máximo 30 caracteres")
    .required("El usuario es obligatorio"),
  email: Yup.string()
    .trim()
    .email("Ingresá un email válido")
    .required("El email es obligatorio"),
  role: Yup.string()
    .oneOf(["user", "admin"], "Seleccioná un tipo válido")
    .required("El tipo de usuario es obligatorio"),
  password: Yup.string()
    .min(6, "Mínimo 6 caracteres")
    .max(50, "Máximo 50 caracteres")
    .required("La contraseña es obligatoria"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
    .required("Debe repetir la contraseña"),
});

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      role: "user",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      dispatch(clearAuthError());

      const result = await dispatch(
        registerUser({
          username: values.username.trim(),
          email: values.email.trim(),
          role: values.role,
          password: values.password,
          confirmPassword: values.confirmPassword,
        })
      );

      if (registerUser.fulfilled.match(result)) {
        const registeredUser = result.payload.user;

        navigate(
          registeredUser.role === "admin" ? "/admin/dashboard" : "/dashboard",
          { replace: true }
        );
      }
    },
  });

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

          <Box component="form" onSubmit={formik.handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Usuario"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                fullWidth
                required
                error={
                  Boolean(formik.touched.username) &&
                  Boolean(formik.errors.username)
                }
                helperText={
                  formik.touched.username
                    ? formik.errors.username
                    : "Mínimo 3 caracteres"
                }
              />

              <TextField
                label="Email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                fullWidth
                required
                error={
                  Boolean(formik.touched.email) &&
                  Boolean(formik.errors.email)
                }
                helperText={
                  formik.touched.email
                    ? formik.errors.email
                    : "Ingresá un email válido"
                }
              />

              <FormControl
                fullWidth
                required
                error={
                  Boolean(formik.touched.role) &&
                  Boolean(formik.errors.role)
                }
              >
                <InputLabel id="role-label">Tipo de usuario</InputLabel>

                <Select
                  labelId="role-label"
                  label="Tipo de usuario"
                  name="role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <MenuItem value="user">Usuario</MenuItem>
                  <MenuItem value="admin">Administrador</MenuItem>
                </Select>

                <FormHelperText>
                  {formik.touched.role
                    ? formik.errors.role
                    : "Seleccioná el tipo de usuario para el registro"}
                </FormHelperText>
              </FormControl>

              <TextField
                label="Contraseña"
                name="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                fullWidth
                required
                error={
                  Boolean(formik.touched.password) &&
                  Boolean(formik.errors.password)
                }
                helperText={
                  formik.touched.password
                    ? formik.errors.password
                    : "Mínimo 6 caracteres"
                }
              />

              <TextField
                label="Repetir contraseña"
                name="confirmPassword"
                type="password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                fullWidth
                required
                error={
                  Boolean(formik.touched.confirmPassword) &&
                  Boolean(formik.errors.confirmPassword)
                }
                helperText={
                  formik.touched.confirmPassword
                    ? formik.errors.confirmPassword
                    : "Debe coincidir con la contraseña"
                }
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={!formik.isValid || !formik.dirty || loading}
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