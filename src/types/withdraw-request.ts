import { Timestamp } from "firebase/firestore";

export interface IWithdrawRequest {
  transactionId: string;
  userId: string;
  amount: number;
  address: string;
  isPaid: boolean;
  adminId?: string;
  addedOn: Timestamp;
}

export interface IWithdrawMoMoRequest {
  transactionId: string;
  userId: string;
  amount: number;
  accountName: string;
  phoneNumber: string;
  isPaid: boolean;
  adminId?: string;
  addedOn: Timestamp;
}

export interface IWithdrawNGNRequest {
  transactionId: string;
  userId: string;
  amount: number;
  accountName: string;
  accountNumber: string;
  phoneNumber: string;
  isPaid: boolean;
  adminId?: string;
  addedOn: Timestamp;
}
