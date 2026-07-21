import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { fetchExchangeRates } from "../features/exchange/exchangeThunks.js";
import {
  selectExchangeBase,
  selectExchangeDate,
  selectExchangeError,
  selectExchangeLoading,
  selectExchangeRates,
} from "../features/exchange/exchangeSelectors.js";

const exchangeSchema = Yup.object({
  base: Yup.string()
    .trim()
    .matches(/^[A-Z]{3}$/, "La moneda debe tener 3 letras")
    .required("La moneda base es obligatoria"),
});

const mainCurrencies = ["USD", "EUR", "BRL", "GBP", "CHF", "JPY"];

const getRatesArray = (rates) => {
  return Object.entries(rates).map(([currency, value]) => ({
    currency,
    value,
  }));
};

const ExchangeRatesPage = () => {
  const dispatch = useDispatch();

  const base = useSelector(selectExchangeBase);
  const rates = useSelector(selectExchangeRates);
  const date = useSelector(selectExchangeDate);
  const loading = useSelector(selectExchangeLoading);
  const error = useSelector(selectExchangeError);

  const ratesArray = getRatesArray(rates);

  const formik = useFormik({
    initialValues: {
      base: base || "USD",
    },
    validationSchema: exchangeSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      dispatch(fetchExchangeRates(values.base.trim().toUpperCase()));
    },
  });

  useEffect(() => {
    dispatch(fetchExchangeRates("USD"));
  }, [dispatch]);

  const handleReload = () => {
    dispatch(fetchExchangeRates(formik.values.base.trim().toUpperCase()));
  };

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <div>
          <Typography variant="h4" component="h1" gutterBottom>
            Tipo de cambio
          </Typography>

          <Typography color="text.secondary">
            Consultá cotizaciones según una moneda base.
          </Typography>
        </div>

        <Button
          variant="outlined"
          onClick={handleReload}
          disabled={loading}
          sx={{ minHeight: 42, height: 42, alignSelf: "center" }}
        >
          Actualizar
        </Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", md: "center" }}
          >
            <FormControl
              fullWidth
              error={Boolean(formik.touched.base) && Boolean(formik.errors.base)}
            >
              <InputLabel id="base-currency-label">Moneda base</InputLabel>

              <Select
                labelId="base-currency-label"
                label="Moneda base"
                name="base"
                value={formik.values.base}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                {mainCurrencies.map((currency) => (
                  <MenuItem key={currency} value={currency}>
                    {currency}
                  </MenuItem>
                ))}
              </Select>

              <FormHelperText>
                {formik.touched.base
                  ? formik.errors.base
                  : "Seleccioná la moneda base para consultar"}
              </FormHelperText>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                minHeight: 42,
                height: 42,
                px: 2.75,
                alignSelf: { xs: "stretch", md: "center" },
                flexShrink: 0,
                width: { xs: "100%", md: "auto" },
              }}
            >
              {loading ? "Consultando..." : "Consultar"}
            </Button>
          </Stack>
        </Box>
      </Paper>

      {loading && ratesArray.length === 0 ? (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: "grid", placeItems: "center", minHeight: 180 }}>
            <CircularProgress />
          </Box>
        </Paper>
      ) : (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Cotizaciones
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Base: {base || "-"} {date ? `· Fecha: ${date}` : ""}
          </Typography>

          {ratesArray.length === 0 ? (
            <Alert severity="info">
              Todavía no hay cotizaciones para mostrar.
            </Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Moneda</TableCell>
                    <TableCell align="right">
                      Valor por 1 {base || "base"}
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {ratesArray.map((rate) => (
                    <TableRow key={rate.currency}>
                      <TableCell>{rate.currency}</TableCell>

                      <TableCell align="right">{rate.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      )}
    </Stack>
  );
};

export default ExchangeRatesPage;
