import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SendManyMessageDto, SendMessageDto } from "./dto/send-message.dto";
import { HttpService } from "@nestjs/axios";

@Injectable()
export class SmsService {
  constructor(
    private axios: HttpService,
    private configService: ConfigService<EnvironmentVariables>
  ) {}

  async sendMessage(dto: SendMessageDto) {
    const isNigerianNumber = dto.to.substring(0, 3) === "233" ? false : true;
    try {
      await this.axios.axiosRef.post(
        `${this.configService.get("TERMII_BASE_URL", {
          infer: true,
        })}/api/sms/send`,
        {
          to: dto.to,
          from: isNigerianNumber ? "N-Alert" : "Payfam",
          sms: dto.sms,
          type: "plain",
          api_key: `${this.configService.get("TERMII_API_KEY", {
            infer: true,
          })}`,
          channel: isNigerianNumber ? "dnd" : "generic",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return {
        status: "success",
      };
    } catch (error) {
      return {
        status: "error",
        message: error.response.data.message,
      };
    }
  }
  async sendManyMessage(dto: SendManyMessageDto) {
    try {
      await this.axios.axiosRef.post(
        `${this.configService.get("TERMII_BASE_URL", {
          infer: true,
        })}/api/sms/send/bulk`,
        {
          to: dto.to,
          from: "Payfam",
          sms: dto.sms,
          type: "plain",
          api_key: `${this.configService.get("TERMII_API_KEY", {
            infer: true,
          })}`,
          channel: "generic",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return {
        status: "success",
      };
    } catch (error) {
      return {
        status: "error",
        message: error.response.data.message,
      };
    }
  }
}
