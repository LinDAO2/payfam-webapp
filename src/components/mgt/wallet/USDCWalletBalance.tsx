import {
  payfamBankContract,
  // PayfamContractAddress,
  // signer,
  // usdcTokenContract,
} from "@/helpers/web3-helpers";
import { IconButton, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";

const USDCWalletBalance = () => {
  const [balance, setBalance] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      let _balance = await payfamBankContract.getBalanceOfContract();

      setBalance(parseInt(_balance._hex) / 10 ** 6);

      setLoading(false);
      setRefresh(false);
    })();
  }, [refresh]);

  return (
    <Paper sx={{ p: 1 }}>
      <Stack direction="row" justifyContent="space-between">
        <Typography
          variant="subtitle1"
          color="textPrimary"
          sx={{ fontSize: "2rem" }}
        >
          Payfam smart contract balance -{" "}
          {loading ? (
            "loading..."
          ) : (
            <b>
              {new Intl.NumberFormat(undefined, {
                style: "currency",
                currency: "USD",
              }).format(balance)}
            </b>
          )}{" "}
        </Typography>
        <IconButton
          onClick={() => {
            setRefresh(true);
          }}
        >
          <RefreshIcon />
        </IconButton>
      </Stack>
    </Paper>
  );
};

export default USDCWalletBalance;
