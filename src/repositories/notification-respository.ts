import { SendSMSDto } from "@/types/notification-types";
import axios from "axios";

class NotificationRepository {
  async sendSMS(dto: SendSMSDto) {
    return axios.post(
      `${process.env.REACT_APP_SERVERLESS_FUNCTION}/sms/send`,
      {
        ...dto,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export default NotificationRepository;
