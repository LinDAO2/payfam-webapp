import { SmsService } from "./sms.service";
import { SendManyMessageDto, SendMessageDto } from "./dto/send-message.dto";
export declare class SmsController {
    private readonly smsService;
    constructor(smsService: SmsService);
    sendMessage(dto: SendMessageDto): Promise<{
        status: string;
        message?: undefined;
    } | {
        status: string;
        message: any;
    }>;
    sendManyMessage(dto: SendManyMessageDto): Promise<{
        status: string;
        message?: undefined;
    } | {
        status: string;
        message: any;
    }>;
}
