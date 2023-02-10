import { ApiProperty } from "@nestjs/swagger";
import { ArrayMaxSize, ArrayNotEmpty, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class SendMessageDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  to: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(160)
  sms: string;
}

export class SendManyMessageDto {
  @ApiProperty()
  @ArrayNotEmpty()
  @ArrayMaxSize(100)
  @IsString({ each: true })
  to: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(160)
  sms: string;
}
