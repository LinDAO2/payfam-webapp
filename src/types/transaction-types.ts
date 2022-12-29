import { Timestamp } from "firebase/firestore";

export type TransactionDocumentStatus = "pending" | "success" | "fail";
export interface TransactionDocument {
  uid: string;
  recieverName: string;
  recieverPhonenumber: string;
  currency: String;
  redeemedcurrency: String;
  amount: number;
  redemptionCode: string;
  isRedeemed: boolean;
  paymentMethod: string;
  senderID: string;
  senderName: string;
  senderPhonenumber: string;
  status: TransactionDocumentStatus;
  momoReferenceId?: string;
  txHash?: string;
  addedOn: Timestamp;
}

export interface TransactionRecipientDocument {
  uid: string;
  userId: string;
  recieverName: string;
  recieverPhonenumber: string;
  addedOn: Timestamp;
}

export type TransactionCurrency = "GHS" | "NGN" | "USDC" | "USD";

export type TransactionPaymethod =
  | "mobileMoney"
  | "bankTransfer"
  | "cryptocurrency";
