import { Card, CardContent, Typography } from "@mui/material";

const SummaryCard = ({ title, value, helperText }) => {
  return (
    <Card>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default SummaryCard;