import { Paper, Stack, Typography } from "@mui/material";
import TransactionList from "./TransactionList";

const TransactionsContainer = () => {
  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      sx={{ width: "100%", minHeight: "50vh" }}
    >
      <Paper sx={{ width: { xs: "90vw", md: "40vw" }, p: 2 }}>
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
    </Stack>
  );
};

export default TransactionsContainer;
