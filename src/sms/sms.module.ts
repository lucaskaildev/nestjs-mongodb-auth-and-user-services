import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { TwilioSmsStrategy } from './strategies/twilio-sms.strategy';

@Module({
  providers: [SmsService, TwilioSmsStrategy],
  exports: [SmsService]
})
export class SmsModule {}
