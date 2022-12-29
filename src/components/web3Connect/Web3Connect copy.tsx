import { showSnackbar } from "@/helpers/snackbar-helpers";
import { LoadingButton } from "@mui/lab";
import { Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const Web3Connect = () => {
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);

  const checkWalletIsConnected = async () => {
    //@ts-ignore
    const { ethereum } = window;

    if (!ethereum) {
      showSnackbar({
        status: "warning",
        msg: "Kindly install metamask",
        openSnackbar: true,
      });
      return;
    } else {
      console.log("metamask exist!");
    }

    // const accounts = await ethereum.request({
    //   method: "eth_requestAccounts",
    // });

    // if (accounts.length !== 0) {
    //   setCurrentAccount(accounts[0]);
    // }
  };

  const connectWalletHandler = async () => {
    setIsConnectingWallet(true);
    //@ts-ignore
    const { ethereum } = window;

    if (!ethereum) {
      showSnackbar({
        status: "warning",
        msg: "Kindly install metamask",
        openSnackbar: true,
      });
    }

    // try {
    //   const accounts = await ethereum.request({
    //     method: "eth_requestAccounts",
    //   });
    //   setCurrentAccount(accounts[0]);
    // } catch (error) {
    //   console.log(error);
    // }

    setIsConnectingWallet(false);
  };

  const connectWalletButton = () => {
    return (
      <LoadingButton
        loading={isConnectingWallet}
        disabled={isConnectingWallet}
        onClick={connectWalletHandler}
        variant="contained"
        sx={{ color: "#fff" }}
      >
        Connect Wallet
      </LoadingButton>
    );
  };

  const depositButton = () => {
    return (
      <LoadingButton
        // loading={isConnectingWallet}
        // disabled={isConnectingWallet}
        // onClick={connectWalletHandler}
        variant="contained"
        sx={{ color: "#fff" }}
      >
        Send funds
      </LoadingButton>
    );
  };

  useEffect(() => {
    checkWalletIsConnected();
  }, []);

  return (
    <Stack sx={{ mt: 1 }}>
      {currentAccount && (
        <Typography variant="body2" color="textPrimary">
          Address : {currentAccount}
        </Typography>
      )}
      {currentAccount ? depositButton() : connectWalletButton()}
    </Stack>
  );
};

export default Web3Connect;
