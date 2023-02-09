import { Timestamp } from "firebase/firestore";

export interface MoMoDepositDoc {
  transId: string;
  userId: string;
  userPhoneNumber: string;
  amount: number;
  referenceCode: string;
  metadata: {
    query: string[];
  };

  isComplete: boolean;
  addedOn?: Timestamp;
}
