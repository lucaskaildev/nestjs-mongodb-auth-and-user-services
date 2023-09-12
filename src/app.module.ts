import 'dotenv/config'
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailingModule } from './mailing/mailing.module';
import { SmsModule } from './sms/sms.module';


@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_CONNECT_URI),
    UserModule,
    AuthModule,
    MailingModule,
    SmsModule,
  ],
  controllers: [],
  providers: [
  ],
})
export class AppModule {}
