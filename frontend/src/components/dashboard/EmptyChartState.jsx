import { Box, Typography } from "@mui/material";

const EmptyChartState = () => {
  return (
    <Box
      sx={{
        height: 300,
        display: "grid",
        placeItems: "center"
      }}
    >
      <Typography color="text.secondary">
        No hay datos suficientes para mostrar este gráfico.
      </Typography>
    </Box>
  );
};

export default EmptyChartState;