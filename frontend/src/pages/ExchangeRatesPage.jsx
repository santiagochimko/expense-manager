import { Paper, Typography } from "@mui/material";

const ExchangeRatesPage = () => {
  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Tipo de cambio
      </Typography>

      <Typography color="text.secondary">
        Consulta de cotizaciones externas.
      </Typography>
    </Paper>
  );
};

export default ExchangeRatesPage;