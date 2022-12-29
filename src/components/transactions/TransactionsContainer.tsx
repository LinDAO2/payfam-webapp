import { Grid, Paper, Stack, Typography } from "@mui/material";
import TransactionList from "./TransactionList";
import TransactionStats from "./TransactionStats";

const TransactionsContainer = () => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={5}>
        <Paper sx={{ p: 2, ml: 1 }}>
          <Stack alignItems="center">
            <Typography
              variant="h4"
              color="textPrimary"
              sx={{ textTransform: "uppercase" }}
            >
              Transactions
            </Typography>
          </Stack>
          <TransactionList />
        </Paper>
      </Grid>
      <Grid item xs={12} md={7}>
        <TransactionStats />
      </Grid>
    </Grid>
  );
};

export default TransactionsContainer;
