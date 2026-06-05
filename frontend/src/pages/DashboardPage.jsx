import { Stack, Typography } from "@mui/material";

import DashboardSummary from "../components/dashboard/DashboardSummary.jsx";
import DashboardCharts from "../components/dashboard/DashboardCharts.jsx";
import CategoriesSection from "../components/categories/CategoriesSection.jsx";
import ExpensesSection from "../components/expenses/ExpensesSection.jsx";

const DashboardPage = () => {
  return (
    <Stack spacing={4}>
      <div>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>

        <Typography color="text.secondary">
          Resumen y gestión general de tus gastos.
        </Typography>
      </div>

      <DashboardSummary />

      <DashboardCharts />

      <CategoriesSection />

      <ExpensesSection />
    </Stack>
  );
};

export default DashboardPage;