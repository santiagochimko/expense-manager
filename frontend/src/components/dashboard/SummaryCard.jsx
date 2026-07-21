import { Box, Card, CardContent, Typography } from "@mui/material";

const SummaryCard = ({ title, value, helperText }) => {
  return (
    <Card
      sx={{
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={(theme) => ({
          position: "absolute",
          top: 0,
          right: 0,
          width: 96,
          height: 96,
          borderRadius: "0 0 0 100%",
          bgcolor:
            theme.palette.mode === "dark"
              ? "rgba(56, 189, 248, 0.12)"
              : "rgba(37, 99, 235, 0.1)",
        })}
      />

      <CardContent sx={{ p: { xs: 2.5, sm: 3 }, position: "relative" }}>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ fontWeight: 900, letterSpacing: "0.12em" }}
        >
          {title}
        </Typography>

        <Typography
          variant="h4"
          component="p"
          sx={{
            mt: 1,
            fontWeight: 900,
            letterSpacing: "-0.04em",
          }}
        >
          {value}
        </Typography>

        {helperText && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
            {helperText}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
