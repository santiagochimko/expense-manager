import { Navigate, Outlet } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { useSelector } from "react-redux";
import {
  selectAuthInitialized,
  selectAuthLoading,
  selectIsAuthenticated
} from "../../features/auth/authSelectors.js";

const ProtectedRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const initialized = useSelector(selectAuthInitialized);
  const loading = useSelector(selectAuthLoading);

  if (!initialized || loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center"
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;