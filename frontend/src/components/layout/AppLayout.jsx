import { useState } from "react";
import { Link as RouterLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Drawer,
  FormControlLabel,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Switch,
  Toolbar,
  Typography,
} from "@mui/material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CurrencyExchangeOutlinedIcon from "@mui/icons-material/CurrencyExchangeOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";

import { logout } from "../../features/auth/authSlice.js";
import {
  selectIsAdmin,
  selectUser,
} from "../../features/auth/authSelectors.js";
import { useThemeMode } from "../../theme/ThemeModeContext.js";

const getNavItems = (isAdmin) => {
  if (isAdmin) {
    return [
      {
        label: "Dashboard admin",
        to: "/admin/dashboard",
        icon: <AdminPanelSettingsOutlinedIcon fontSize="small" />,
      },
    ];
  }

  return [
    {
      label: "Dashboard",
      to: "/dashboard",
      icon: <DashboardOutlinedIcon fontSize="small" />,
    },
    {
      label: "Categorías",
      to: "/categories",
      icon: <CategoryOutlinedIcon fontSize="small" />,
    },
    {
      label: "Gastos",
      to: "/expenses",
      icon: <ReceiptLongOutlinedIcon fontSize="small" />,
    },
    {
      label: "Tipo de cambio",
      to: "/exchange-rates",
      icon: <CurrencyExchangeOutlinedIcon fontSize="small" />,
    },
  ];
};

const AppLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggleMode } = useThemeMode();

  const user = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = getNavItems(isAdmin);
  const isDark = mode === "dark";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const handleCloseMobile = () => {
    setMobileOpen(false);
  };

  const isActive = (to) => {
    return location.pathname === to || location.pathname.startsWith(`${to}/`);
  };

  const modeSwitch = (
    <FormControlLabel
      sx={{ m: 0 }}
      control={
        <Switch
          size="small"
          checked={isDark}
          onChange={toggleMode}
          inputProps={{ "aria-label": "Cambiar modo oscuro" }}
        />
      }
      label={
        <Stack direction="row" spacing={0.75} alignItems="center">
          {isDark ? <DarkModeOutlinedIcon fontSize="small" /> : <LightModeOutlinedIcon fontSize="small" />}
          <Typography variant="body2" fontWeight={700}>
            {isDark ? "Oscuro" : "Claro"}
          </Typography>
        </Stack>
      }
    />
  );

  const drawerContent = (
    <Box sx={{ width: 300, p: 2.5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              color: "primary.contrastText",
              bgcolor: "primary.main",
              fontWeight: 900,
              letterSpacing: "-0.08em",
            }}
          >
            EM
          </Box>
          <Typography variant="h6">Expense Manager</Typography>
        </Stack>

        <IconButton onClick={handleCloseMobile} aria-label="Cerrar navegación">
          <CloseRoundedIcon />
        </IconButton>
      </Stack>

      <Divider sx={{ mb: 1.5 }} />

      <List disablePadding>
        {navItems.map((item) => (
          <ListItemButton
            key={item.to}
            component={RouterLink}
            to={item.to}
            onClick={handleCloseMobile}
            selected={isActive(item.to)}
            sx={{
              borderRadius: 3,
              mb: 0.75,
              minHeight: 48,
              "&.Mui-selected": {
                color: "primary.contrastText",
                bgcolor: "primary.main",
                "&:hover": {
                  bgcolor: "primary.light",
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 38, color: "inherit" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 1.5 }}>{modeSwitch}</Box>

      {user && (
        <Chip
          icon={<AccountCircleOutlinedIcon />}
          label={`${user.username} · ${user.role}`}
          variant="outlined"
          sx={{ width: "100%", justifyContent: "flex-start", mb: 1.5 }}
        />
      )}

      <Button
        fullWidth
        variant="outlined"
        startIcon={<LogoutRoundedIcon />}
        onClick={handleLogout}
      >
        Salir
      </Button>
    </Box>
  );

  return (
    <Box sx={{ minHeight: "100vh", color: "text.primary" }}>
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={(theme) => ({
          borderBottom: "1px solid",
          borderColor: "divider",
          backdropFilter: "blur(22px)",
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(2, 6, 23, 0.84)"
              : "rgba(248, 251, 255, 0.84)",
        })}
      >
        <Toolbar disableGutters>
          <Container
            maxWidth="xl"
            sx={{
              minHeight: { xs: 72, md: 82 },
              display: "grid",
              gridTemplateColumns: { xs: "1fr auto", md: "1fr auto 1fr" },
              alignItems: "center",
              gap: 2,
              px: { xs: 2, sm: 3, md: 5 },
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
              <IconButton
                aria-label="Abrir navegación"
                onClick={() => setMobileOpen(true)}
                sx={{ display: { xs: "inline-flex", md: "none" }, mr: 0.5 }}
              >
                <MenuRoundedIcon />
              </IconButton>

              <Typography
                component={RouterLink}
                to={isAdmin ? "/admin/dashboard" : "/dashboard"}
                variant="h6"
                color="text.primary"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  textDecoration: "none",
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  whiteSpace: "nowrap",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    color: "primary.contrastText",
                    bgcolor: "primary.main",
                    fontSize: 14,
                    fontWeight: 900,
                    boxShadow: (theme) =>
                      theme.palette.mode === "dark"
                        ? "0 14px 30px rgba(56, 189, 248, 0.2)"
                        : "0 14px 30px rgba(15, 23, 42, 0.18)",
                  }}
                >
                  EM
                </Box>
                Expense Manager
              </Typography>
            </Stack>

            <Stack
              direction="row"
              spacing={0.75}
              alignItems="center"
              justifyContent="center"
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              {navItems.map((item) => {
                const active = isActive(item.to);

                return (
                  <Button
                    key={item.to}
                    component={RouterLink}
                    to={item.to}
                    startIcon={item.icon}
                    variant={active ? "contained" : "text"}
                    size="small"
                    sx={{
                      minHeight: 40,
                      px: 1.75,
                      color: active ? "primary.contrastText" : "text.secondary",
                      "&:hover": {
                        color: active ? "primary.contrastText" : "text.primary",
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
              <Box sx={{ display: { xs: "none", sm: "block" } }}>{modeSwitch}</Box>

              {user && (
                <Chip
                  icon={<AccountCircleOutlinedIcon />}
                  label={`${user.username} · ${user.role}`}
                  size="small"
                  variant="outlined"
                  sx={{ display: { xs: "none", lg: "inline-flex" } }}
                />
              )}

              <Button
                variant="outlined"
                startIcon={<LogoutRoundedIcon />}
                onClick={handleLogout}
                size="small"
                sx={{ display: { xs: "none", sm: "inline-flex" } }}
              >
                Salir
              </Button>
            </Stack>
          </Container>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleCloseMobile}
        slotProps={{
          paper: {
            sx: {
              bgcolor: "background.paper",
              borderTopRightRadius: 28,
              borderBottomRightRadius: 28,
            },
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Container
        maxWidth="xl"
        sx={{
          px: { xs: 2, sm: 3, md: 5 },
          py: { xs: 3, md: 5 },
        }}
      >
        <Outlet />
      </Container>
    </Box>
  );
};

export default AppLayout;
