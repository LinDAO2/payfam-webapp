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
