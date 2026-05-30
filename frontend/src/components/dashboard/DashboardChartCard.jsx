import { Paper, Typography } from "@mui/material";

const DashboardChartCard = ({ title, children }) => {
  return (
    <Paper sx={{ p: 3, height: "100%" }}>
      <Typography variant="h6" component="h2" gutterBottom>
        {title}
      </Typography>

      {children}
    </Paper>
  );
};

export default DashboardChartCard;