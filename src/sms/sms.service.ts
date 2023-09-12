import { Injectable } from '@nestjs/common';
import { TwilioSmsStrategy } from './strategies/twilio-sms.strategy';
import { SendSmsBody } from './dtos/send-sms-body';

@Injectable()
export class SmsService {
  constructor(private readonly smsStrategy: TwilioSmsStrategy) {}

  public async sendSms(sendSmsBody: SendSmsBody) {
    return await this.smsStrategy.sendSms(sendSmsBody);
  }

  public async sendAuthCode(phoneNumber: string, code: string) {
    return await this.sendSms({
      destinationNumber: phoneNumber,
      body: `Your ${process.env.APP_NAME_PUBLIC} verification code is ${code}. Don't share this with anyone. This code will become invalid after some time.`,
    });
  }
}
