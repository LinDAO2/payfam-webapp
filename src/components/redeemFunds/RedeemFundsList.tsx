import { showSnackbar } from "@/helpers/snackbar-helpers";
import { useSession } from "@/hooks/app-hooks";
import { collectionServices } from "@/services/root";
import { TransactionDocument } from "@/types/transaction-types";
import { generateUUIDV4 } from "@/utils/funcs";
import { Stack, Typography } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import LoadingCircle from "../common/LoadingCircle";
import TransactionListItem from "../transactions/TransactionListItem";

const RedeemFundsList = () => {
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
            uField: "recieverPhonenumber",
            uid: profile.phonenumber,
          },
          {
            uField: "isRedeemed",
            uid: false,
          },
        ]
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
    <div>
      {" "}
      <Stack
        sx={{ width: "100%", my: 2 }}
        direction="row"
        justifyContent="center"
      >
        {processing && <LoadingCircle />}
      </Stack>
      {transactionList.length > 0 &&
        transactionList.map((transaction) => (
          <Fragment key={generateUUIDV4()}>
            <TransactionListItem transaction={transaction} />
          </Fragment>
        ))}
      {transactionList.length === 0 && (
        <Typography variant="subtitle1" color="textPrimary" textAlign="center">
          No Transactions yet
        </Typography>
      )}
    </div>
  );
};

export default RedeemFundsList;
