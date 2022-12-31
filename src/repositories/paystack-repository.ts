import {
  ICreatePSTransferReceiptCode,
  IGetAccountDetailsParams,
  IGetBankParams,
  IInitiateMOMOCharge,
  IInstantPSInitiateTransfer,
} from "@/types/wallet-types";
import axios from "axios";

class PaystackRepository {
  async getbanks({ country, currency }: IGetBankParams) {
    return axios.get("https://api.paystack.co/bank", {
      params: {
        country,
        currency,
      },
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_PAYSTACK_LIVE_SECRET_KEY}`,
      },
    });
  }
  async getMoMoProviders() {
    return axios.get(
      "https://api.paystack.co/bank?currency=GHS&type=mobile_money",
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_PAYSTACK_BIDOPALABS_LIVE_SECRET_KEY}`,
        },
      }
    );
  }

  async resolveAccountDetails({
    accountNumber,
    bankCode,
  }: IGetAccountDetailsParams) {
    return axios.get("https://api.paystack.co/bank/resolve", {
      params: {
        account_number: accountNumber,
        bank_code: bankCode,
      },
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_PAYSTACK_LIVE_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });
  }

  async createPSTransferReceiptCode({
    accountName,
    accountNumber,
    bankCode,
  }: ICreatePSTransferReceiptCode) {
    return axios.post(
      "https://api.paystack.co/transferrecipient",
      {
        type: "nuban",
        name: accountName,
        account_number: accountNumber,
        bank_code: bankCode,
        currency: "NGN",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_PAYSTACK_LIVE_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
  }

  async createPSMoMoTransferReceiptCode({
    accountName,
    accountNumber,
    bankCode,
  }: ICreatePSTransferReceiptCode) {
    return axios.post(
      "https://api.paystack.co/transferrecipient",
      {
        type: "mobile_money",
        name: accountName,
        account_number: accountNumber,
        bank_code: bankCode,
        currency: "GHS",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_PAYSTACK_BIDOPALABS_LIVE_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
  }

  async instantPSInitiateTransfer({
    amount,
    psrecieptCode,
    reason,
  }: IInstantPSInitiateTransfer) {
    return axios.post(
      "https://api.paystack.co/transfer",
      {
        source: "balance",
        amount: amount * 100,
        recipient: psrecieptCode,
        reason: reason,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_PAYSTACK_LIVE_SECRET_KEY_EKIOJA}`,
          "Content-Type": `application/json`,
        },
      }
    );
  }

  async initiateMOMOCharge({
    amount,
    email,
    phone,
    provider,
  }: IInitiateMOMOCharge) {
    return axios.post(
      "https://api.paystack.co/charge",
      {
        email,
        amount: amount * 100,
        currency: "GHS",
        mobile_money: {
          phone,
          provider,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_PAYSTACK_LIVE_SECRET_KEY_EKIOJA}`,
          "Content-Type": `application/json`,
        },
      }
    );
  }
}

export default PaystackRepository;
