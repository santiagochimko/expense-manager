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
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";

import { loginUser } from "../features/auth/authThunks.js";
import { clearAuthError } from "../features/auth/authSlice.js";
import {
  selectAuthError,
  selectAuthLoading,
  selectIsAuthenticated,
  selectUser,
} from "../features/auth/authSelectors.js";

const loginSchema = Yup.object({
  username: Yup.string()
    .trim()
    .required("El usuario es obligatorio"),
  password: Yup.string()
    .required("La contraseña es obligatoria"),
});

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: loginSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      dispatch(clearAuthError());

      const result = await dispatch(
        loginUser({
          username: values.username.trim(),
          password: values.password,
        })
      );

      if (loginUser.fulfilled.match(result)) {
        const loggedUser = result.payload.user;

        navigate(
          loggedUser.role === "admin" ? "/admin/dashboard" : "/dashboard",
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
          gridTemplateColumns: { xs: "1fr", md: "1.05fr 0.95fr" },
          gap: { xs: 3, md: 4 },
          alignItems: "stretch",
        }}
      >
        <Paper
          sx={{
            p: { xs: 3, sm: 4, md: 6 },
            minHeight: { md: 620 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "hidden",
            position: "relative",
            color: "primary.contrastText",
            bgcolor: "primary.main",
            background:
              "radial-gradient(circle at 20% 10%, rgba(200, 169, 106, 0.45), transparent 28%), linear-gradient(145deg, #14110f 0%, #2f2a25 52%, #090807 100%)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: "auto -10% -35% auto",
              width: 360,
              height: 360,
              borderRadius: "50%",
              border: "1px solid rgba(200, 169, 106, 0.24)",
              opacity: 0.8,
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
                  bgcolor: "rgba(255, 253, 248, 0.12)",
                  border: "1px solid rgba(255, 253, 248, 0.18)",
                  fontWeight: 900,
                }}
              >
                EM
              </Box>
              <Typography variant="h6">Expense Manager</Typography>
            </Stack>

            <Stack spacing={2} maxWidth={560}>
              <Chip
                label="Gestión financiera personal"
                sx={{
                  width: "fit-content",
                  color: "secondary.contrastText",
                  bgcolor: "secondary.main",
                }}
              />

              <Typography
                variant="h2"
                component="h1"
                sx={{ fontSize: { xs: 42, sm: 52, md: 64 }, lineHeight: 0.95 }}
              >
                Controlá tus gastos con una experiencia simple y elegante.
              </Typography>

              <Typography sx={{ color: "rgba(255, 253, 248, 0.72)", maxWidth: 520 }}>
                Visualizá tendencias, organizá categorías y mantené una lectura clara de tus decisiones financieras.
              </Typography>
            </Stack>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ position: "relative", mt: 5 }}
          >
            <Stack direction="row" spacing={1.25} alignItems="center">
              <AutoGraphRoundedIcon color="secondary" />
              <Typography variant="body2" sx={{ color: "rgba(255, 253, 248, 0.74)" }}>
                Dashboard global
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <ShieldOutlinedIcon color="secondary" />
              <Typography variant="body2" sx={{ color: "rgba(255, 253, 248, 0.74)" }}>
                Sesión protegida
              </Typography>
            </Stack>
          </Stack>
        </Paper>

        <Paper
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            display: "flex",
            alignItems: "center",
          }}
        >
          <Stack spacing={3} sx={{ width: "100%" }}>
            <Stack spacing={1}>
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "rgba(200, 169, 106, 0.16)",
                  color: "secondary.dark",
                }}
              >
                <LockOutlinedIcon />
              </Box>

              <Typography variant="h4" component="h2">
                Iniciar sesión
              </Typography>

              <Typography color="text.secondary">
                Ingresá con tu usuario y contraseña para continuar.
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
                    formik.touched.username ? formik.errors.username : ""
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
                    formik.touched.password ? formik.errors.password : ""
                  }
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardRoundedIcon />}
                  disabled={loading}
                >
                  {loading ? "Ingresando..." : "Ingresar"}
                </Button>
              </Stack>
            </Box>

            <Typography variant="body2" color="text.secondary">
              ¿No tenés cuenta?{" "}
              <Link component={RouterLink} to="/register" fontWeight={800} underline="hover">
                Registrate
              </Link>
            </Typography>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default LoginPage;
