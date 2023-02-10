import { ConfigService } from "@nestjs/config";
import { SendManyMessageDto, SendMessageDto } from "./dto/send-message.dto";
import { HttpService } from "@nestjs/axios";
export declare class SmsService {
    private axios;
    private configService;
    constructor(axios: HttpService, configService: ConfigService<EnvironmentVariables>);
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
