import {
  Box,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography
} from "@mui/material";

const CategorySummaryList = ({ data = [] }) => {
  const maxAmount = data.reduce((max, item) => {
    return item.total > max ? item.total : max;
  }, 0);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Gastos por categoría
      </Typography>

      {data.length === 0 ? (
        <Typography color="text.secondary">
          Todavía no hay gastos por categoría.
        </Typography>
      ) : (
        <List disablePadding>
          {data.map((item) => {
            const progress = maxAmount > 0 ? (item.total / maxAmount) * 100 : 0;

            return (
              <ListItem key={item.categoryName} disableGutters>
                <ListItemText
                  primary={item.categoryName}
                  secondary={`$${item.total}`}
                />

                <Box sx={{ width: 160, ml: 2 }}>
                  <LinearProgress variant="determinate" value={progress} />
                </Box>
              </ListItem>
            );
          })}
        </List>
      )}
    </Paper>
  );
};

export default CategorySummaryList;