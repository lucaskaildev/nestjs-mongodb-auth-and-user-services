import { Module } from '@nestjs/common';
import { MailingService } from './mailing.service';
import { NodemailerStrategy } from './strategies/nodemailer.strategy';

@Module({
  providers: [MailingService, NodemailerStrategy],
  controllers: [],
  exports: [MailingService]
})
export class MailingModule {}
