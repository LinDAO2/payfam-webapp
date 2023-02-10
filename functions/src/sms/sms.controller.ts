import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { SmsService } from "./sms.service";
import { SendManyMessageDto, SendMessageDto } from "./dto/send-message.dto";

@Controller("sms")
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @HttpCode(HttpStatus.OK)
  @Post("send")
  sendMessage(@Body() dto: SendMessageDto) {
    return this.smsService.sendMessage(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post("send-many")
  sendManyMessage(@Body() dto: SendManyMessageDto) {
    return this.smsService.sendManyMessage(dto);
  }
}
