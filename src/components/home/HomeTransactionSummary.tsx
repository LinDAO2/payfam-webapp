
import Typography from "@mui/material/Typography";
import { Divider, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { TransactionDocument } from "@/types/transaction-types";
import { useSession } from "@/hooks/app-hooks";
import { showSnackbar } from "@/helpers/snackbar-helpers";
import { collectionServices } from "@/services/root";
import TransactionListItem from "../transactions/TransactionListItem";
import { generateUUIDV4 } from "@/utils/funcs";

const HomeTransactionSummary = () => {
  const [transactionList, setTransactionList] = useState<TransactionDocument[]>(
    []
  );

  const [processing, setProcessing] = useState(false);

  const profile = useSession();

  useEffect(() => {
    (async () => {
      setProcessing(true);

      const { status, list, errorMessage } = await collectionServices.getDocs(
        "Transactions",
        [
          {
            uField: "senderID",
            uid: profile.uid,
          },
        ],
        5
      );

      if (status === "success") {
        if (list) {
          const _list = list as TransactionDocument[];
          setTransactionList(_list);
        } else {
          setTransactionList([]);
        }
      }
      if (status === "error") {
        showSnackbar({
          status: "error",
          msg: errorMessage,
          openSnackbar: true,
        });
      }
      setProcessing(false);
    })();
  }, [profile]);

  return (
    <Paper sx={{p:2 , borderRadius:4}} elevation={10}>
      <Typography variant="h6" color="textPrimary" gutterBottom={false}>
        Transaction history
      </Typography>
      <Divider sx={{ mb: 1 }} />
      { !processing && transactionList.length > 0 &&
        transactionList.map((transaction) => (
          <TransactionListItem
            key={generateUUIDV4()}
            transaction={transaction}
          />
        ))}

      {transactionList.length === 0 && (
        <Typography variant="subtitle1" color="textPrimary" textAlign="center">
          No Transactions yet
        </Typography>
      )}
    </Paper>
  );
};

export default HomeTransactionSummary;
