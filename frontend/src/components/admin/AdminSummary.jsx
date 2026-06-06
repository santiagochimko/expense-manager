import { Box, Paper, Typography } from "@mui/material";

const AdminSummaryCard = ({ title, value, helperText }) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {title}
      </Typography>

      <Typography variant="h5" component="p" fontWeight={700}>
        {value}
      </Typography>

      {helperText && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {helperText}
        </Typography>
      )}
    </Paper>
  );
};

const AdminSummary = ({ dashboard }) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "repeat(4, 1fr)",
        },
        gap: 2,
      }}
    >
      <AdminSummaryCard
        title="Usuarios totales"
        value={dashboard?.totalUsers ?? 0}
        helperText="Incluye usuarios y admins"
      />

      <AdminSummaryCard
        title="Usuarios premium"
        value={dashboard?.totalPremiumUsers ?? 0}
        helperText="Usuarios con plan premium"
      />

      <AdminSummaryCard
        title="Gastos activos"
        value={dashboard?.activeExpenses ?? 0}
        helperText="Gastos activos globales"
      />

      <AdminSummaryCard
        title="Monto total"
        value={`$${dashboard?.totalAmount ?? 0}`}
        helperText="Monto global de gastos activos"
      />

      <AdminSummaryCard
        title="Admins"
        value={dashboard?.totalAdmins ?? 0}
        helperText="Usuarios con rol administrador"
      />

      <AdminSummaryCard
        title="Usuarios plus"
        value={dashboard?.totalPlusUsers ?? 0}
        helperText="Usuarios con plan plus"
      />

      <AdminSummaryCard
        title="Categorías activas"
        value={dashboard?.totalCategories ?? 0}
        helperText="Categorías activas globales"
      />

      <AdminSummaryCard
        title="Gastos eliminados"
        value={dashboard?.deletedExpenses ?? 0}
        helperText="Gastos marcados como inactivos"
      />
    </Box>
  );
};

export default AdminSummary;