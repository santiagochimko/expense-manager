import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const formatDate = (date) => {
  if (!date) {
    return "-";
  }

  return new Date(date).toLocaleDateString("es-UY");
};

const AdminUsersTable = ({ users }) => {
  if (users.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography color="text.secondary">
          No hay usuarios para mostrar.
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Usuario</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Rol</TableCell>
            <TableCell>Plan</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Creado</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id || user.id}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Chip
                  label={user.role}
                  size="small"
                  variant="outlined"
                  color={user.role === "admin" ? "warning" : "default"}
                />
              </TableCell>
              <TableCell>{user.role === "admin" ? "-" : user.plan}</TableCell>
              <TableCell>
                <Chip
                  label={user.isActive ? "Activo" : "Inactivo"}
                  size="small"
                  variant="outlined"
                  color={user.isActive ? "success" : "default"}
                />
              </TableCell>
              <TableCell>{formatDate(user.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdminUsersTable;