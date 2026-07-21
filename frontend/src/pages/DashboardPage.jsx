import { Stack, Typography } from "@mui/material";

import DashboardSummary from "../components/dashboard/DashboardSummary.jsx";
import DashboardCharts from "../components/dashboard/DashboardCharts.jsx";
import PlanUpgradeCard from "../components/users/PlanUpgradeCard.jsx";

const DashboardPage = () => {
  return (
    <Stack spacing={4}>
      <div>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>

        <Typography color="text.secondary">
          Resumen general y visualización de tus gastos.
        </Typography>
      </div>
      
      <PlanUpgradeCard />

      <DashboardSummary />

      <DashboardCharts />
    </Stack>
  );
};

export default DashboardPage;