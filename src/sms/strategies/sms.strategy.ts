import { SendSmsBody } from "../dtos/send-sms-body";

export interface SmsStrategy {
    sendSms(sendSmsBody: SendSmsBody): Promise<void>
  }