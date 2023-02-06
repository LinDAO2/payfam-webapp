import { ethers } from "ethers";

import PayfamContract from "@/contracts/PayfamBank.json";
import USDCTokenContractABI from "@/contracts/USDCTokenContract.json";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";

export const PayfamContractAddress =
  // "0xF32468e26EA9c63D133C4e6F6346f2E46B894BC0";
  // "0x538e69cD1dB3704A572dE952bdC34e41235a3357";
  "0xFbF64380d96Ea10cAFd84716b73509d31e313C87"
  
const PayfamContractABI = PayfamContract;

const USDCTokenContractAddress = "0x07865c6E87B9F70255377e024ace6630C1Eaa37F";

const web3 = createAlchemyWeb3(
  "wss://eth-goerli.g.alchemy.com/v2/RZ0yGQf9HG0xX3a4wLO3jLHBAClxOvRU"
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
