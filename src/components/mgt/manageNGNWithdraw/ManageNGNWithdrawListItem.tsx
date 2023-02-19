import { IWithdrawNGNRequest } from "@/types/withdraw-request";
import Confirmation from "@/components/modals/Confirmation";
import { setProfileReload } from "@/helpers/session-helpers";
import { showSnackbar } from "@/helpers/snackbar-helpers";
import { collectionServices, notificationService } from "@/services/root";
import { LoadingButton } from "@mui/lab";
import { Box, Stack, Typography } from "@mui/material";
import { increment } from "firebase/firestore";
import moment from "moment";
import { useEffect, useState } from "react";

interface Props {
  transaction: IWithdrawNGNRequest;
}

const ManageNGNWithdrawListItem = ({ transaction }: Props) => {
  const [isComplete, setIsComplete] = useState(false);

  const [confirmComplete, setConfirmComplete] = useState(false);

  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    setIsComplete(transaction.isPaid);
  }, [transaction.isPaid]);
  return (
    <div>
      <Confirmation
        visible={confirmComplete}
        close={() => setConfirmComplete(false)}
        action={async () => {
          setProcessing(true);
          const momodepositPromise = collectionServices.editDoc(
            "WithdrawNGNRequests",
            transaction.transactionId,
            {
              isPaid: true,
            }
          );
          const ghsWalletDepositPromise = collectionServices.editDoc(
            "Users",
            transaction.userId,
            {
              ngnPendingWithdrawBalance: increment(-transaction.amount),
            }
          );

          const allPromise = Promise.all([
            momodepositPromise,
            ghsWalletDepositPromise,
          ]);

          const response = await allPromise;

          response.forEach((res) => {
            if (res.status === "error") {
              showSnackbar({
                status: res.status,
                msg: res.errorMessage,
                openSnackbar: true,
              });
              setProcessing(false);
            }
          });

          const isAllGood = response.every((item) => item.status === "success");

          if (isAllGood) {
            await notificationService.sendSMS({
              to: transaction.phoneNumber,
              sms: `Dear Fam! 
                  Your deposit of NGN ${transaction.amount} is now available in your PayFam account. Log in to check your balance
                  `,
            });
            setConfirmComplete(false);
            setIsComplete(true);
            setProcessing(false);
            setProfileReload(true);
          }
        }}
      />

      <Stack direction="row" justifyContent="space-between">
        <Typography
          variant="caption"
          sx={{
            textTransform: "uppercase",
            pl: 1,
            color: "#000",
            fontSize: "0.9em",
          }}
        >
          {moment(transaction.addedOn?.toDate()).format("lll")}
        </Typography>
      </Stack>
      <Box
        sx={{
          // width: "100%",
          p: 2,
          borderRadius: 2,
          bgcolor: isComplete ? "#b2dfdb" : "#ffcdd2",
          color: "#000",
          mb: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography sx={{ ml: 2 }}>{transaction?.accountName}</Typography>
          <Typography sx={{ ml: 2 }}>{transaction?.accountNumber}</Typography>
          <Typography sx={{ ml: 2 }}>{transaction?.phoneNumber}</Typography>
          <Typography sx={{ ml: 2 }}>
            {new Intl.NumberFormat(undefined, {
              style: "currency",
              currency: "NGN",
            }).format(transaction.amount)}
          </Typography>
        </Stack>
        <LoadingButton
          loading={processing}
          disabled={processing || isComplete}
          variant="text"
          color="primary"
          onClick={() => {
            if (isComplete === false) {
              setConfirmComplete(true);
            }
          }}
        >
          {isComplete ? "Complete" : "Confirm"}
        </LoadingButton>
      </Box>
    </div>
  );
};

export default ManageNGNWithdrawListItem;
