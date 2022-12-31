import { Timestamp } from "firebase/firestore";
import { IStatus } from "./general";
import { IImage } from "./global-types";
import { TransactionCurrency } from "./transaction-types";

export type IAccountPersona = "customer" | "mgt";

export interface IAccountDocument {
  id: string;
  uid: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phonenumber: string;
  query: string[];
  persona: IAccountPersona;
  status: IStatus;
  defaultCurrency: TransactionCurrency | "manual";
  photo?: IImage;
  momoPhoneNumber?: string;
  usdcBalance?: number;
  ghsBalance?: number;
  ngnBalance?: number;
  bankAccount?: IAccountBankAccount;
  mobileMoneyAccount?: IAccountBankAccount;
  addedOn: Timestamp;
}

export interface IAccountBankAccount {
  paystack: IAccountBankAccountPaystack;
}

export interface IAccountBankAccountPaystack {
  accountName: string;
  accountNumber: string;
  bankCode: string;
  bankName: string;
  psrecieptCode: string;
}


