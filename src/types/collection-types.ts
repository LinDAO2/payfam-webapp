import { OrderByDirection, Timestamp } from "firebase/firestore";

export type ICollectionNames =
  | "Users"
  | "Recipients"
  | "Transactions"
  | "Profiles"
  | "Inventory"
  | "Story"
  | "CartV2"
  | "WishlistV2"
  | "Addresses"
  | "LogisticsOptions"
  | "OrdersV2"
  | "Rating"
  | "WalletTransactions"
  | "KYCReports"
  | "Ekioja"
  | "Coupons"
  | "CouponRecords"
  | "KYCEmailBlacklist"
  | "Chats"
  | "Chat"
  | "ChatMsgs"
  | "WithdrawRequests"
  | "MomoDeposits";

export type ICollectionDocumentStatus =
  | "active"
  | "inactive"
  | "trash"
  | "draft"
  | "blocked"
  | "issues"
  | "underReview"
  | "cancelled"
  | "complete";

export type ICollectionDocUniqueArg = {
  uField: string;
  uid: string | boolean | number | Timestamp | null;
  operator?:
    | "array-contains"
    | "in"
    | "not-in"
    | "array-contains-any"
    | ">="
    | "=="
    | "<="
    | ">";
  type?: "where" | "orderby";
  orderByDirection?: OrderByDirection;
  limit?: number;
  customOrderField?: string;
  useCustomOrderField?: boolean;
};
