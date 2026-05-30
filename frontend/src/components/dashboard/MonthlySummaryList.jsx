import {
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography
} from "@mui/material";

const MonthlySummaryList = ({ data = [] }) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Gastos por mes
      </Typography>

      {data.length === 0 ? (
        <Typography color="text.secondary">
          Todavía no hay gastos mensuales.
        </Typography>
      ) : (
        <List disablePadding>
          {data.map((item) => (
            <ListItem key={`${item.year}-${item.month}`} disableGutters>
              <ListItemText
                primary={`${item.month}/${item.year}`}
                secondary={`Total: $${item.total}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default MonthlySummaryList;