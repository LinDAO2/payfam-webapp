import TransactionList from "../transactions/TransactionList";
import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";

const HomeTransactionSummary = () => {
  return (
    <div>
      <Typography variant="h6" color="textPrimary" gutterBottom={false}>
        Recent transactions
      </Typography>
      <Divider sx={{ mb: 1 }} />
      <TransactionList />
    </div>
  );
};

export default HomeTransactionSummary;
