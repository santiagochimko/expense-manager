import { Box, Paper, Typography } from "@mui/material";

const DashboardChartCard = ({ title, children }) => {
  return (
    <Paper
      sx={{
        p: { xs: 2.5, sm: 3 },
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mb: 2.5,
        }}
      >
        <Typography variant="h6" component="h2">
          {title}
        </Typography>

        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            bgcolor: "secondary.main",
            boxShadow: "0 0 0 6px rgba(200, 169, 106, 0.14)",
            flex: "0 0 auto",
          }}
        />
      </Box>

      {children}
    </Paper>
  );
};

export default DashboardChartCard;
