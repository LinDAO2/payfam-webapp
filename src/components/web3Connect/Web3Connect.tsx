import {
  payfamBankContract,
  // PayfamContractAddress,
  // signer,
  // usdcTokenContract,
} from "@/helpers/web3-helpers";
import { Button, Stack } from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ReactNode, useEffect, useState } from "react";

interface Props {
  children: ReactNode | ReactNode[];
}
const Web3Connect = ({ children }: Props) => {
  const [currentAccount, setCurrentAccount] = useState<string | null>(null);

  const checkWalletIsConnected = async () => {
    //@ts-ignore
    const { ethereum } = window;

    if (!ethereum) {
      return;
    } else {
    }

    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    if (accounts.length !== 0) {
      setCurrentAccount(accounts[0]);
    }
  };

  useEffect(() => {
    checkWalletIsConnected();
  }, []);

  return (
    <Stack alignItems="center" spacing={2}>
      <ConnectButton showBalance={false} />
      {currentAccount && (
        <>
          {children}

          <Button
            variant="contained"
            sx={{ color: "#fff" }}
            onClick={async () => {
              let balance = await payfamBankContract.getStakingBalance();

              console.log(balance);
            }}
          >
            get Balance Of Contract
          </Button>

          {/* <Button
            variant="contained"
            sx={{ color: "#fff" }}
            onClick={async () => {
              const signerAddress = await signer.getAddress();

              usdcTokenContract.methods
                .approve(PayfamContractAddress, 1 * 10 ** 6)
                .send(
                  { from: signerAddress },
                  function (err: any, transactionHash: any) {
                    //some code
                    console.log("error!", err);
                    console.log("transactionHash!", transactionHash);
                  }
                );
            }}
          >
            Approve 1 USDC
          </Button> */}

          {/* <Button
            variant="contained"
            sx={{ color: "#fff" }}
            onClick={async () => {
              console.log("Start deposit token...");
              try {
                let depositTokenTxn = await payfamBankContract.depositTokens(1);

                console.log("mining token...");
                await depositTokenTxn.wait();

                console.log("txn etherscan ...");
                console.log(
                  `https://goerli.etherscan.io/tx/${depositTokenTxn.hash}`
                );
              } catch (error) {
                console.log("deposit token error!", error);
              }
            }}
          >
            deposit 1 USDC
          </Button> */}

          <Button
            variant="contained"
            sx={{ color: "#fff" }}
            onClick={async () => {
              console.log("Start withdraw token...");
              try {
                let withdrawTokenTxn =
                  await payfamBankContract.withdrawTokenFromBalance(2);

                console.log("withdrawing token...");
                await withdrawTokenTxn.wait();

                console.log("txn etherscan ...");
                console.log(
                  `https://goerli.etherscan.io/tx/${withdrawTokenTxn.hash}`
                );
              } catch (error) {
                console.log("withdraw token error!", error);
              }
            }}
          >
            withdraw 2 USDC
          </Button>

          {/* <Button
            variant="contained"
            sx={{ color: "#fff" }}
            onClick={async () => {
              // let balance = await payfamBankContract.getStakingBalance();

              // console.log(balance);

              const signerAddress = await signer.getAddress();

              usdcTokenContract.methods
                .approve(PayfamContractAddress, 1 * 10 ** 6)
                .send(
                  { from: signerAddress },
                  function (err: any, transactionHash: any) {
                    //some code
                    console.log("error!", err);
                    console.log("transactionHash!", transactionHash);
                  }
                );
            }}
            // onClick={async () => {
            //   try {
            //     //@ts-ignore
            //     const { ethereum } = window;

            //     if (ethereum) {
            //       // Provider
            //       //@ts-ignore
            //       const provider = new ethers.providers.Web3Provider(ethereum);

            //       // const alchemyProvider = new ethers.providers.AlchemyProvider(
            //       //   "goerli",
            //       //   // api key
            //       //   "RZ0yGQf9HG0xX3a4wLO3jLHBAClxOvRU"
            //       // );

            //       // Signer
            //       const signer = provider.getSigner();
            //       // const signer = new ethers.Wallet(
            //       //   //private key
            //       //   "893ef4749e7b6c7296c3562db278b1d0615bbbccf52c47ba551c7df1f83ac587",
            //       //   alchemyProvider
            //       // );

            //       const usdcProxyTokenContract = new ethers.Contract(
            //         PayfamContractAddress,
            //         PayfamContractABI.abi,
            //         signer
            //       );

            //       await usdcProxyTokenContract
            //         .approve(PayfamContractAddress)
            //         .send();

            //       // let depositTokenTxn =
            //       //   await usdcProxyTokenContract.depositTokens(1);

            //       //   await depositTokenTxn.wait();

            //       // console.log(depositTokenTxn.hash);

            //       // let balance =
            //       //   await usdcProxyTokenContract.getStakingBalance();

            //       // console.log(balance);

            //       //  let withdrawTokenTxn =
            //       //     await usdcProxyTokenContract.withdrawTokenFromBalance(1);

            //       //     await withdrawTokenTxn.wait();

            //       //   console.log(withdrawTokenTxn.hash);
            //     }
            //   } catch (err) {
            //     console.log(err);
            //   }
            // }}
          >
            get Balance Of Contract
          </Button> */}
        </>
      )}
    </Stack>
  );
};

export default Web3Connect;
