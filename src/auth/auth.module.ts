import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from 'src/session/session.serializer';
import { JwtModule } from '@nestjs/jwt';
import { MailingModule } from 'src/mailing/mailing.module';
import { SmsModule } from 'src/sms/sms.module';

@Module({
  imports: [
    UserModule,
    MailingModule,
    PassportModule.register({
      session: true,
    }),
    JwtModule.register({}),
    SmsModule,
  ],
  providers: [AuthService, LocalStrategy, GoogleStrategy, SessionSerializer],
  controllers: [AuthController],
})
export class AuthModule {}
