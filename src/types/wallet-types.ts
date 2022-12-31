import { Timestamp } from "firebase/firestore";
import { IAccountPersona } from "./account";

export interface IGetBankParams {
  country: string;
  currency: string;
}

export interface IGetAccountDetailsParams {
  accountNumber: string;
  bankCode: string;
}

export interface ICreatePSTransferReceiptCode {
  accountName: string;
  accountNumber: string;
  bankCode: string;
  userId?: string;
  bankName?: string;
  psrecieptCode?: string;
}
export interface IUpdateUserPSTransferReceiptCode {
  accountName: string;
  userId: string;
  persona: string;
  bankName: string;
  psrecieptCode: string;
  accountNumber: string;
  bankCode: string;
}

export interface IInstantPSInitiateTransfer {
  amount: number;
  psrecieptCode: string;
  reason: string;
  userId: string;
}

export interface IDeductFromUserWallet {
  userId: string;
  amount: number;
}
export interface IAddToUserWallet {
  userId: string;
  amount: number;
}
export interface IMoveFundFromCommissionToBalance {
  userId: string;
  amount: number;
}

export interface IGetBankParams {
  country: string;
  currency: string;
}

export interface IGetAccountDetailsParams {
  accountNumber: string;
  bankCode: string;
}

export interface ICreatePSTransferReceiptCode {
  accountName: string;
  accountNumber: string;
  bankCode: string;
}
export interface IUpdateUserPSTransferReceiptCode {
  accountName: string;
  userId: string;
  persona: string;
  bankName: string;
  psrecieptCode: string;
  accountNumber: string;
  bankCode: string;
}

export interface IInstantPSInitiateTransfer {
  amount: number;
  psrecieptCode: string;
  reason: string;
  userId: string;
}

export interface IInitiateMOMOCharge {
  amount: number;
  email: string;
  phone: string;
  provider: string;
}

export interface IPSBank {
  id: number;
  name: string;
  code: string;
  active: boolean;
}

export interface IPSResolveAccountDetails {
  account_number: string;
  account_name: string;
}

export interface IMoveFundFromCommissionToBalance {
  userId: string;
  amount: number;
}

export interface IGetCustomerTransactions {
  perPage: number;
  page: number;
  customer: string;
}

export interface ITransactionDoc {
  id: number;
  domain: string;
  status: string;
  reference: string;
  amount: number;
  message: null | string;
  gateway_response: string;
  paid_at: null | string;
  created_at: string;
  channel: string;
  currency: string;
  ip_address: null | string;
  metadata: null | string;
  timeline: null | string;
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    metadata: null | string;
    customer_code: string;
  };
  authorization?: {};
  plan?: {};
  requested_amount: number;
}

export type walletTransactionTypes =
  | "top-up"
  | "tranfer"
  | "deduction"
  | "withdraw"
  | "platform-fee"
  | "commission"
  | "credit"
  | "sale"
  | "refund";

export type walletSpaceTypes =
  | "order"
  | "balance"
  | "total-commission"
  | "coupon";
export type walletPersonaTypes = IAccountPersona;

export interface IWalletTransactionDocument {
  uid: string;
  userId: string;
  amount: number;
  type: walletTransactionTypes;
  space: walletSpaceTypes;
  persona: walletPersonaTypes;
  remark: string;
  metadata?: any;
  addedOn: Timestamp;
}
export interface IWalletTransactionInput
  extends Omit<IWalletTransactionDocument, "addedOn"> {}

export interface IMGTFinance {
  balance: number;
  totalCommission: number;
}
