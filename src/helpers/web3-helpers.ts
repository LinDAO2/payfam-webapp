import { ethers } from "ethers";

import PayfamContract from "@/contracts/PayfamBank.json";
import USDCTokenContractABI from "@/contracts/USDCTokenContract.json";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";

export const PayfamContractAddress =
  // "0xF32468e26EA9c63D133C4e6F6346f2E46B894BC0";
  // "0x538e69cD1dB3704A572dE952bdC34e41235a3357";
  // "0xFbF64380d96Ea10cAFd84716b73509d31e313C87"
  "0xB2CfedF4879534A5EA59ACB4945B1f9419E94191";

const PayfamContractABI = PayfamContract;

const USDCTokenContractAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

const web3 = createAlchemyWeb3(
  "wss://eth-mainnet.g.alchemy.com/v2/Mv0SyvjiJxHYwn3JfwWs_HJXAxdB639T"
);

//@ts-ignore
const { ethereum } = window;

const provider = ethereum
  ? //@ts-ignore
    new ethers.providers.Web3Provider(ethereum)
  : undefined;

// Signer
export const signer = provider ? provider.getSigner() : undefined;

export const payfamBankContract = new ethers.Contract(
  PayfamContractAddress,
  PayfamContractABI.abi,
  signer
);

export const usdcTokenContract = new web3.eth.Contract(
  //@ts-ignore
  USDCTokenContractABI,
  USDCTokenContractAddress
);

export const getUSDCWei = (amount: number) => {
  return amount * 10 ** 6;
};
