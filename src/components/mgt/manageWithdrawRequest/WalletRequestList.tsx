import LoadingCircle from "@/components/common/LoadingCircle";
import { showSnackbar } from "@/helpers/snackbar-helpers";
import { collectionServices } from "@/services/root";
import { IWithdrawRequest } from "@/types/withdraw-request";
import { generateUUIDV4 } from "@/utils/funcs";
import { Chip, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import WalletRequestListItem from "./WalletRequestListItem";

const WalletRequestList = () => {
  const [withdrawRequestList, setWithdrawRequestList] = useState<
    IWithdrawRequest[]
  >([]);
  const [processing, setProcessing] = useState(false);
  const [tabIndex, setTabIndex] = useState<number>(0);

  
  useEffect(() => {
    (async () => {
      setProcessing(true);
      if (tabIndex === 0) {
        const { status, list, errorMessage } = await collectionServices.getDocs(
          "WithdrawRequests",
          [
            {
              uField: "isPaid",
              uid: false,
            },
          ]
        );

        if (status === "success") {
          if (list) {
            const _list = list as IWithdrawRequest[];
            setWithdrawRequestList(_list);
          } else {
            setWithdrawRequestList([]);
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
      }

      if (tabIndex === 1) {
        const { status, list, errorMessage } = await collectionServices.getDocs(
          "WithdrawRequests",
          [
            {
              uField: "isPaid",
              uid: true,
            },
          ]
        );

        if (status === "success") {
          if (list) {
            const _list = list as IWithdrawRequest[];
            setWithdrawRequestList(_list);
          } else {
            setWithdrawRequestList([]);
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
      }
    })();
  }, [tabIndex]);

  return (
    <Paper sx={{ p: 1 }}>
      <Typography variant="subtitle1" color="textPrimary">
        USDC withdraw requests
      </Typography>

      <Stack direction="row" spacing={2} justifyContent="center">
        <Chip
          label="To pay"
          onClick={() => {
            setTabIndex(0);
          }}
          sx={{
            p: 3,
            backgroundColor: tabIndex === 0 ? "primary.main" : "",
            color: tabIndex === 0 ? "#fff" : "textPrimary",
            fontWeight: "bold",
          }}
        />
        <Chip
          label="paid"
          onClick={() => {
            setTabIndex(1);
          }}
          sx={{
            p: 3,
            backgroundColor: tabIndex === 1 ? "primary.main" : "",
            color: tabIndex === 1 ? "#fff" : "textPrimary",
            fontWeight: "bold",
          }}
        />
      </Stack>

      <Stack
        sx={{ width: "100%", my: 2 }}
        direction="row"
        justifyContent="center"
      >
        {processing && <LoadingCircle />}
      </Stack>
      {withdrawRequestList.length > 0 &&
        withdrawRequestList.map((withdrawRequest) => (
          <WalletRequestListItem
            key={generateUUIDV4()}
            withdrawRequest={withdrawRequest}
          />
        ))}

      {withdrawRequestList.length === 0 && (
        <Typography variant="subtitle1" color="textPrimary" textAlign="center">
          No request yet
        </Typography>
      )}
    </Paper>
  );
};

export default WalletRequestList;
