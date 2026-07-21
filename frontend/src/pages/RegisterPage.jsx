import { Link as RouterLink, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Alert,
  Box,
  Button,
  Chip,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AutoGraphRoundedIcon from "@mui/icons-material/AutoGraphRounded";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import WalletRoundedIcon from "@mui/icons-material/WalletRounded";

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
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      dispatch(clearAuthError());

      const result = await dispatch(
        registerUser({
          username: values.username.trim(),
          email: values.email.trim(),
          password: values.password,
          confirmPassword: values.confirmPassword,
        })
      );

      if (registerUser.fulfilled.match(result)) {
        navigate("/dashboard", { replace: true });
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
    <Box
      sx={{
        minHeight: "100vh",
        px: { xs: 2, sm: 3, md: 5 },
        py: { xs: 4, md: 7 },
        display: "grid",
        placeItems: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1180,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "0.95fr 1.05fr" },
          gap: { xs: 3, md: 4 },
          alignItems: "stretch",
        }}
      >
        <Paper
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            display: "flex",
            alignItems: "center",
            order: { xs: 2, md: 1 },
          }}
        >
          <Stack spacing={3} sx={{ width: "100%" }}>
            <Stack spacing={1}>
              <Box
                sx={(theme) => ({
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "rgba(56, 189, 248, 0.16)"
                      : "rgba(37, 99, 235, 0.12)",
                  color: "secondary.main",
                })}
              >
                <PersonAddAltRoundedIcon />
              </Box>

              <Typography variant="h4" component="h1">
                Crear cuenta
              </Typography>

              <Typography color="text.secondary">
                Registrate para comenzar a organizar tus gastos con una lectura clara y moderna.
              </Typography>
            </Stack>

            {error && <Alert severity="error">{error}</Alert>}

            <Box component="form" onSubmit={formik.handleSubmit}>
              <Stack spacing={2.25}>
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
                  endIcon={<ArrowForwardRoundedIcon />}
                  disabled={loading}
                >
                  {loading ? "Creando cuenta..." : "Crear cuenta"}
                </Button>
              </Stack>
            </Box>

            <Typography variant="body2" color="text.secondary">
              ¿Ya tenés cuenta?{" "}
              <Link component={RouterLink} to="/login" fontWeight={800} underline="hover">
                Iniciá sesión
              </Link>
            </Typography>
          </Stack>
        </Paper>

        <Paper
          sx={{
            p: { xs: 3, sm: 4, md: 6 },
            minHeight: { md: 620 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            order: { xs: 1, md: 2 },
            overflow: "hidden",
            position: "relative",
            color: "#f8fbff",
            bgcolor: "primary.main",
            background:
              "radial-gradient(circle at 80% 0%, rgba(56, 189, 248, 0.36), transparent 30%), linear-gradient(145deg, #020617 0%, #0f172a 52%, #1d4ed8 100%)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: "-20% auto auto -12%",
              width: 320,
              height: 320,
              borderRadius: "50%",
              border: "1px solid rgba(56, 189, 248, 0.24)",
            }}
          />

          <Stack spacing={3} sx={{ position: "relative" }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "rgba(248, 251, 255, 0.12)",
                  border: "1px solid rgba(248, 251, 255, 0.18)",
                  fontWeight: 900,
                }}
              >
                EM
              </Box>
              <Typography variant="h6">Expense Manager</Typography>
            </Stack>

            <Stack spacing={2} maxWidth={560}>
              <Chip
                label="Minimalismo financiero"
                sx={{
                  width: "fit-content",
                  color: "#020617",
                  bgcolor: "#38bdf8",
                }}
              />

              <Typography
                variant="h2"
                component="h2"
                sx={{ fontSize: { xs: 42, sm: 52, md: 64 }, lineHeight: 0.95 }}
              >
                Convertí tus gastos diarios en información útil.
              </Typography>

              <Typography sx={{ color: "rgba(248, 251, 255, 0.74)", maxWidth: 520 }}>
                Categorías, comprobantes, gráficos y seguimiento mensual en una interfaz clara, sobria y responsiva.
              </Typography>
            </Stack>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ position: "relative", mt: 5 }}
          >
            <Stack direction="row" spacing={1.25} alignItems="center">
              <WalletRoundedIcon sx={{ color: "#38bdf8" }} />
              <Typography variant="body2" sx={{ color: "rgba(248, 251, 255, 0.74)" }}>
                Gastos personales
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <AutoGraphRoundedIcon sx={{ color: "#38bdf8" }} />
              <Typography variant="body2" sx={{ color: "rgba(248, 251, 255, 0.74)" }}>
                Métricas visuales
              </Typography>
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default RegisterPage;
