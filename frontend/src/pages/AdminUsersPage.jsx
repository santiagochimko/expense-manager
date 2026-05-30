import { Paper, Typography } from "@mui/material";

const AdminUsersPage = () => {
  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Usuarios
      </Typography>

      <Typography color="text.secondary">
        Listado global de usuarios.
      </Typography>
    </Paper>
  );
};

export default AdminUsersPage;