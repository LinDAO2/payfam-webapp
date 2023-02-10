import NotificationRepository from "@/repositories/notification-respository";
import { SendSMSDto } from "@/types/notification-types";
import { mutationResponse } from "@/types/promise-types";

class NotificationService {
  private respository: NotificationRepository;

  constructor() {
    this.respository = new NotificationRepository();
  }

  async sendSMS(dto: SendSMSDto): Promise<mutationResponse> {
    try {
      const { status, data } = await this.respository.sendSMS(dto);
      if (status === 200) {
        return {
          status: "success",
          successMessage: "sent",
          data: data.data,
          errorMessage: "",
        };
      }
      return {
        status: "error",
        errorMessage: "couldn't send sms",
        data: {},
        successMessage: "",
      };
    } catch (error: any) {
      let errorMsg = "Error! MoMo providers could not be recieved";

      return {
        status: "error",
        errorMessage: errorMsg,
        successMessage: "",
      };
    }
  }
}

export default NotificationService;
