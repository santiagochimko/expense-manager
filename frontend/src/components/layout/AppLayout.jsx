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
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CurrencyExchangeOutlinedIcon from "@mui/icons-material/CurrencyExchangeOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";

import { logout } from "../../features/auth/authSlice.js";
import {
  selectIsAdmin,
  selectUser,
} from "../../features/auth/authSelectors.js";

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

  const user = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = getNavItems(isAdmin);

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
              color: "background.paper",
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
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          backdropFilter: "blur(22px)",
          backgroundColor: "rgba(251, 248, 241, 0.78)",
        }}
      >
        <Toolbar disableGutters>
          <Container
            maxWidth="xl"
            sx={{
              minHeight: { xs: 72, md: 82 },
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              px: { xs: 2, sm: 3, md: 5 },
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
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
                    color: "background.paper",
                    bgcolor: "primary.main",
                    fontSize: 14,
                    fontWeight: 900,
                    boxShadow: "0 14px 30px rgba(20, 17, 15, 0.18)",
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
                    sx={{
                      color: active ? "primary.contrastText" : "text.secondary",
                      px: 1.75,
                      "&:hover": {
                        color: active ? "primary.contrastText" : "text.primary",
                        bgcolor: active ? "primary.main" : "rgba(20, 17, 15, 0.05)",
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              {user && (
                <Chip
                  icon={<AccountCircleOutlinedIcon />}
                  label={`${user.username} · ${user.role}`}
                  size="small"
                  variant="outlined"
                  sx={{ display: { xs: "none", sm: "inline-flex" } }}
                />
              )}

              <Button
                variant="outlined"
                startIcon={<LogoutRoundedIcon />}
                onClick={handleLogout}
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
