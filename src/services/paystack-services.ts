import PaystackRepository from "@/repositories/paystack-repository";
import { mutationResponse } from "@/types/promise-types";
import {
  ICreatePSTransferReceiptCode,
  IGetAccountDetailsParams,
  IGetBankParams,
  IInstantPSInitiateTransfer,
} from "@/types/wallet-types";
import { FirebaseError } from "firebase/app";

class PaystackServices {
  private respository: PaystackRepository;

  constructor() {
    this.respository = new PaystackRepository();
  }
  async getbanks({
    country,
    currency,
  }: IGetBankParams): Promise<mutationResponse> {
    try {
      const { status, data } = await this.respository.getbanks({
        currency,
        country,
      });
      if (status === 200) {
        return {
          status: "success",
          successMessage: "Bank list recieved",
          data: data.data,
          errorMessage: "",
        };
      }
      return {
        status: "error",
        errorMessage: "Error! Bank list could not be recieved",
        data: {},
        successMessage: "",
      };
    } catch (error: unknown) {
      let errorMsg = "Error! Bank list could not be recieved";
      if (error instanceof FirebaseError) errorMsg = error.message;
      return {
        status: "error",
        errorMessage: errorMsg,
        successMessage: "",
      };
    }
  }
  async getMoMoProviders(): Promise<mutationResponse> {
    try {
      const { status, data } = await this.respository.getMoMoProviders();
      if (status === 200) {
        return {
          status: "success",
          successMessage: "MoMo providers recieved",
          data: data.data,
          errorMessage: "",
        };
      }
      return {
        status: "error",
        errorMessage: "Error! MoMo providers could not be recieved",
        data: {},
        successMessage: "",
      };
    } catch (error: unknown) {
      let errorMsg = "Error! MoMo providers could not be recieved";
      if (error instanceof FirebaseError) errorMsg = error.message;
      return {
        status: "error",
        errorMessage: errorMsg,
        successMessage: "",
      };
    }
  }
  async resolveAccountDetails({
    accountNumber,
    bankCode,
  }: IGetAccountDetailsParams): Promise<mutationResponse> {
    try {
      const { status, data } = await this.respository.resolveAccountDetails({
        accountNumber,
        bankCode,
      });
      if (status === 200) {
        return {
          status: "success",
          successMessage: "resolved account successfully",
          data: data.data,
          errorMessage: "",
        };
      }
      return {
        status: "error",
        errorMessage: "Error! could not resolve account",
        data: {},
        successMessage: "",
      };
    } catch (error: any) {
      // let errorMsg = "Error! could not resolve account";
      // if (error instanceof FirebaseError) errorMsg = error.message;
      return {
        status: "error",
        errorMessage: error.message,
        successMessage: "",
      };
    }
  }

  async createPSTransferReceiptCode({
    accountName,
    accountNumber,
    bankCode,
  }: ICreatePSTransferReceiptCode): Promise<mutationResponse> {
    try {
      const { status, data } =
        await this.respository.createPSTransferReceiptCode({
          accountName,
          accountNumber,
          bankCode,
        });

      if (status === 201) {
        return {
          status: "success",
          successMessage: "created account transfer reciept successfully",
          data: data.data,
          errorMessage: "",
        };
      }
      return {
        status: "error",
        errorMessage: "Error! could not create account transfer reciept",
        data: {},
        successMessage: "",
      };
    } catch (error: unknown) {
      let errorMsg = "Error! could not create account transfer reciept";
      if (error instanceof FirebaseError) errorMsg = error.message;
      return {
        status: "error",
        errorMessage: errorMsg,
        successMessage: "",
      };
    }
  }
  async createPSMoMoTransferReceiptCode({
    accountName,
    accountNumber,
    bankCode,
  }: ICreatePSTransferReceiptCode): Promise<mutationResponse> {
    try {
      const { status, data } =
        await this.respository.createPSMoMoTransferReceiptCode({
          accountName,
          accountNumber,
          bankCode,
        });

        console.log(status);
        console.log(data);
        

      if (status === 201) {
        return {
          status: "success",
          successMessage: "created account transfer reciept successfully",
          data: data.data,
          errorMessage: "",
        };
      }
      return {
        status: "error",
        errorMessage: "Error! could not create account transfer reciept",
        data: {},
        successMessage: "",
      };
    } catch (error: unknown) {
      console.log(error);
      
      let errorMsg = "Error! could not create account transfer reciept";
      if (error instanceof FirebaseError) errorMsg = error.message;
      return {
        status: "error",
        errorMessage: errorMsg,
        successMessage: "",
      };
    }
  }

  async instantPSInitiateTransfer({
    amount,
    psrecieptCode,
    reason,
    userId,
  }: IInstantPSInitiateTransfer): Promise<mutationResponse> {
    try {
      await this.respository.instantPSInitiateTransfer({
        amount,
        psrecieptCode,
        reason,
        userId,
      });

      return {
        status: "success",
        successMessage: "Tranfer of funds processed",
        errorMessage: "",
      };
    } catch (error: any) {
      return {
        status: "error",
        errorMessage: error.message,
        successMessage: "",
      };
    }
  }
  async initiateMOMOTransfer({
    amount,
    psrecieptCode,
    reason,
    userId,
  }: IInstantPSInitiateTransfer): Promise<mutationResponse> {
    try {
      await this.respository.initiateMOMOTransfer({
        amount,
        psrecieptCode,
        reason,
        userId,
      });

      return {
        status: "success",
        successMessage: "Tranfer of funds processed",
        errorMessage: "",
      };
    } catch (error: any) {
      console.log(error);
      
      return {
        status: "error",
        errorMessage: error.message,
        successMessage: "",
      };
    }
  }
}

export default PaystackServices;
