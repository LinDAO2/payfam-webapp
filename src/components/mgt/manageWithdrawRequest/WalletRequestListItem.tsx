import Confirmation from "@/components/modals/Confirmation";
import { showSnackbar } from "@/helpers/snackbar-helpers";
import { payfamBankContract } from "@/helpers/web3-helpers";
import { useSession } from "@/hooks/app-hooks";
import { collectionServices } from "@/services/root";
import { IWithdrawRequest } from "@/types/withdraw-request";
import { Chip, Grid, Stack, Typography } from "@mui/material";
import { increment } from "firebase/firestore";
import moment from "moment";
import { useState } from "react";

interface Props {
  withdrawRequest: IWithdrawRequest;
}
const WalletRequestListItem = ({ withdrawRequest }: Props) => {
  const [showConfirmTransfer, setShowConfirmTransfer] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [markAsPaid, setMarkAsPaid] = useState(false);
  const profile = useSession();
  return (
    <Grid
      container
      alignItems="center"
      justifyContent="space-between"
      sx={{ my: 1 }}
    >
      <Confirmation
        loading={processing}
        visible={showConfirmTransfer}
        close={() => setShowConfirmTransfer(false)}
        action={async () => {
          setProcessing(true);
          try {
            let withdrawTokenTxn =
              await payfamBankContract.makePaymentToAccount(
                withdrawRequest.amount,
                withdrawRequest.address
              );
            await withdrawTokenTxn.wait();
            if (withdrawTokenTxn.hash) {
              const deductFrombalance = await collectionServices.editDoc(
                "Users",
                withdrawRequest.userId,
                {
                  usdcPendingWithdrawBalance: increment(
                    -withdrawRequest.amount
                  ),
                }
              );
              const editWithdrawRequest = collectionServices.editDoc(
                "WithdrawRequests",
                withdrawRequest.transactionId,
                {
                  isPaid: true,
                  adminId: profile.uid,
                }
              );

              const allPromise = Promise.all([
                editWithdrawRequest,
                deductFrombalance,
              ]);

              const results = await allPromise;

              results.forEach((result) => {
                if (result.status === "error") {
                  showSnackbar({
                    status: "error",
                    msg: result.errorMessage,
                    openSnackbar: true,
                  });
                  setProcessing(false);
                }
              });

              if (
                results.every((result) => {
                  return result.status === "success";
                })
              ) {
                showSnackbar({
                  status: "success",
                  msg: "funds transferred",
                  openSnackbar: true,
                });
                setProcessing(false);
                setMarkAsPaid(true);
              }
            }
          } catch (error) {
            if (error) {
              showSnackbar({
                status: "error",
                msg: "An error occured try again",
                openSnackbar: true,
              });
              setProcessing(false);
            }
          }
        }}
      />
      <Grid item xs={12} md={5}>
        <Typography
          variant="caption"
          component="code"
          color="textPrimary"
          sx={{ border: "1px solid #ccc", p: 1, borderRadius: 3 }}
        >
          {withdrawRequest.address}
        </Typography>
      </Grid>
      <Grid item xs={12} md={3}>
        <Typography
          variant="caption"
          color="textPrimary"
          sx={{ fontSize: "1.3rem" }}
        >
          {new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: "USD",
          }).format(withdrawRequest.amount)}
        </Typography>
      </Grid>
      <Grid item xs={12} md={3}>
        <Stack alignItems="center">
          {!withdrawRequest.isPaid && markAsPaid === false ? (
            <Chip
              label={processing ? "processing..." : "confirm transfer"}
              onClick={() => {
                setShowConfirmTransfer(true);
              }}
              sx={{
                p: 3,
                fontWeight: "bold",
              }}
              color="warning"
            />
          ) : (
            <Chip
              label="paid"
              sx={{
                p: 3,
                fontWeight: "bold",
              }}
              color="success"
            />
          )}
          <Typography variant="caption" color="textPrimary">
            {moment(withdrawRequest.addedOn.toDate()).format("lll")}
          </Typography>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default WalletRequestListItem;
