import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { UserNotFoundException } from 'src/common/exceptions/user-not-found.exception';
import { UserRegisterBody } from 'src/user/dtos/user-register-body';
import { MailingService } from 'src/mailing/mailing.service';
import { JwtService } from '@nestjs/jwt';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { InvalidCredentialsException } from 'src/common/exceptions/invalid-credentials.exception';
import { UserNotVerifiedException } from 'src/common/exceptions/user-not-verified.exception';
import { SmsService } from 'src/sms/sms.service';
import { redisClient } from 'src/config/redis-store.config';
import { InvalidAuthCodeException } from 'src/common/exceptions/invalid-auth-code.exception';
import { InvalidTokenException } from 'src/common/exceptions/invalid-token.exception';
import * as bcrypt from 'bcrypt';
import { TwoFactorAuthMethods } from './enums/2fa-methods.enum';
import { UserNotActiveException } from 'src/common/exceptions/user-not-active.exception';
import { TwoFactorAuthActions } from './enums/2fa-actions.enum';
import * as otpGenerator from 'otp-generator';
import { ReqUser } from 'src/user/interfaces/req-user';
import { accountReactivationJWTConfig, accountReactivationJWTExp, accountReactivationSecret, resetPasswordJWTConfig, resetPasswordJWTExp, resetPasswordSecret, verificationJWTConfig, verificationJWTExp, verificationTokenSecret } from 'src/config/jwt.config';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailingService: MailingService,
    private readonly smsService: SmsService,
  ) {}

  public async registerAccount(
    userRegisterBody: UserRegisterBody,
  ): Promise<void> {
    const user = await this.userService.create(userRegisterBody);

    await this.requestEmailVerification(user.email);
  }

  public async requestEmailVerification(email: string): Promise<void> {
    const user = await this.userService.getOne({
      email,
    });

    if (user.isActive && user.emailVerified){
      throw new HttpException('User email is already verified.', HttpStatus.BAD_REQUEST)
    }

    const verificationToken = await this.jwtService.signAsync(
      {
        userId: user.id,
        exp: verificationJWTExp,
      },
      verificationJWTConfig,
    );

    this.mailingService.sendVerificationEmail(
      verificationToken,
      user.username,
      user.email,
    );
  }

  public async verifyEmail(token: string): Promise<void> {
    try {
      const verifiedToken = await this.jwtService.verifyAsync(token, {
        secret: verificationTokenSecret,
      });

      const user = await this.userService.getById(verifiedToken.userId);

      user.emailVerified = true;

      await user.save();
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new InvalidTokenException();
      }
    }
  }

  public async requestPhoneNumberVerification(userId: string): Promise<void> {
    const user = await this.userService.getById(userId);
    await this.requestSmsCode(
      user.id,
      TwoFactorAuthActions.VERIFY_PHONE_NUMBER,
    );
  }
  public async verifyPhoneNumber(userId: string, submittedCode: string) {
    await this.validateSmsCode(
      userId,
      submittedCode,
      TwoFactorAuthActions.VERIFY_PHONE_NUMBER,
    );

    const user = await this.userService.getById(userId);
    user.phoneNumberVerified = true;
    await user.save();
  } 

  public async request2FaEnable(userId: string, method: TwoFactorAuthMethods){
    await this.request2FA(userId, method, TwoFactorAuthActions.ENABLE_2FA)
  }
  public async enable2Fa(
    userId: string,
    method: TwoFactorAuthMethods,
    submittedCode: string,
  ): Promise<void> {
    if (method === TwoFactorAuthMethods.SMS) {
      await this.validateSmsCode(
        userId,
        submittedCode,
        TwoFactorAuthActions.ENABLE_2FA,
      );
    }

    if (method === TwoFactorAuthMethods.EMAIL) {
      await this.validateEmailCode(
        userId,
        submittedCode,
        TwoFactorAuthActions.ENABLE_2FA,
      );
    }

    const user = await this.userService.getById(userId);

    user.twoFactorAuthEnabled = true;

    if (!user.twoFactorAuthMethods.includes(method)) {
      user.twoFactorAuthMethods.push(method);
    }

    if (!user.defaultTwoFactorAuthMethod) {
      user.defaultTwoFactorAuthMethod = method;
    }

    await user.save();
  }

  public async requestAccountReactivation(email: string): Promise<void> {
    const user = await this.userService.getOne({ email });

    const verificationToken = await this.jwtService.signAsync(
      {
        userId: user.id,
        exp: accountReactivationJWTExp,
      },
      accountReactivationJWTConfig,
    );

    this.mailingService.sendReactivationEmail(
      verificationToken,
      user.username,
      user.email,
    );
  }

  public async reactivateAccount(token: string): Promise<void> {
    try {
      const verifiedToken = await this.jwtService.verifyAsync(token, {
        secret: accountReactivationSecret,
      });

      if (!verifiedToken) {
        throw new InvalidTokenException();
      }

      const user = await this.userService.getById(verifiedToken.userId);

      user.isActive = true;

      await user.save();
    } catch (error: any) {
      if (error instanceof JsonWebTokenError || error.name === TokenExpiredError.name) {
        throw new InvalidTokenException();
      }
    }
  }

  public async validateUser(
    username: string,
    password: string,
  ): Promise<ReqUser> {
    const user = await this.userService.getOne({ username });

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new InvalidCredentialsException();
    }

    if (!user.isActive) {
      this.requestAccountReactivation(user.email);
      throw new UserNotActiveException();
    }

    if (!user.emailVerified) {
      throw new UserNotVerifiedException();
    }

    if (user.twoFactorAuthEnabled) {
      const method = user.defaultTwoFactorAuthMethod ?? user.twoFactorAuthMethods[0];
      await this.request2FA(user.id, method, TwoFactorAuthActions.LOGIN);

      return {
        id: user.id,
        username: user.username,
        twoFaAuthenticated: false,
      };
    } else {
      return {
        id: user.id,
        username: user.username,
      };
    }
  }

  public async validateLogin2FaOtp(
    userId: string,
    method: string,
    submittedCode: string,
    session: Record<string, any>,
  ): Promise<void> {
    if (method === TwoFactorAuthMethods.EMAIL) {
      await this.validateEmailCode(
        userId,
        submittedCode,
        TwoFactorAuthActions.LOGIN,
      );
    }

    if (method === TwoFactorAuthMethods.SMS) {
      await this.validateSmsCode(
        userId,
        submittedCode,
        TwoFactorAuthActions.LOGIN,
      );
    }

    session.passport.user.twoFaAuthenticated = true;
  }

  public async validateUserByEmail(email: string): Promise<ReqUser> {
    const user = await this.userService.getOne({ email: email });
    if (user.twoFactorAuthEnabled) {
      const method = user.defaultTwoFactorAuthMethod ?? user.twoFactorAuthMethods[0];

      await this.request2FA(user.id, method, TwoFactorAuthActions.LOGIN);
      return {
        id: user.id,
        username: user.username,
        twoFaAuthenticated: false,
      };
    } else {
      return {
        id: user.id,
        username: user.username,
      };
    }
  }

  public async logOutAccount(session: Record<string, any>): Promise<void> {
    await session.destroy();
  }

  public async deactivateAccount(
    userId: string,
    submittedPassword: string,
    session: any,
  ): Promise<void> {
    const user = await this.userService.getById(userId);

    await this.validateUser(user.username, submittedPassword);

    user.isActive = false;
    await user.save();
    this.mailingService.sendDeactivationEmail(user.username, user.email);

    this.logOutAccount(session);
  }

  public async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userService.getOne({ email });
    if (user.twoFactorAuthEnabled) {
      const method = user.defaultTwoFactorAuthMethod ?? user.twoFactorAuthMethods[0];

      await this.request2FA(
        user.id,
        method,
        TwoFactorAuthActions.REQUEST_PASSWORD_RESET,
      );
      return;
    }
    const token = await this.jwtService.signAsync(
      {
        userId: user.id,
        exp: resetPasswordJWTExp,
      },
      resetPasswordJWTConfig,
    );

    this.mailingService.sendResetPasswordEmail(
      user.username,
      user.email,
      token,
    );
  }

  public async validatePasswordResetOtp(
    email: string,
    method: TwoFactorAuthMethods,
    submittedCode: string,
  ): Promise<void> {
    const user = await this.userService.getOne({
      email,
    });

    if (method === TwoFactorAuthMethods.EMAIL) {
      await this.validateEmailCode(
        user.id,
        submittedCode,
        TwoFactorAuthActions.REQUEST_PASSWORD_RESET,
      );
    }

    if (method === TwoFactorAuthMethods.SMS) {
      await this.validateSmsCode(
        user.id,
        submittedCode,
        TwoFactorAuthActions.REQUEST_PASSWORD_RESET,
      );
    }

    const token = await this.jwtService.signAsync(
      {
        userId: user.id,
        exp: resetPasswordJWTExp
      },
      resetPasswordJWTConfig,
    );

    this.mailingService.sendResetPasswordEmail(
      user.username,
      user.email,
      token,
    );
  }

  public async resetUserPassword(
    token: string,
    newPassword: string,

  ): Promise<void> {
    try {
      const verifiedToken = await this.jwtService.verifyAsync(token, {
        secret: resetPasswordSecret,
      });

      if (!verifiedToken) {
        throw new InvalidTokenException();
      }

      if (verifiedToken.userId) {
        const user = await this.userService.getById(verifiedToken.userId)
          await this.userService.updateById(verifiedToken.userId, {
            password: newPassword,
          });
      }
    } catch (error: any) {
      if (
        error instanceof JsonWebTokenError ||
        error.name === TokenExpiredError.name
      ) {
        throw new InvalidTokenException();
      }
    }
  }

  public async request2FA(
    userId: string,
    method: TwoFactorAuthMethods,
    action: TwoFactorAuthActions,
  ): Promise<void> {
    const user = await this.userService.getById(userId);

    if (
      action === TwoFactorAuthActions.ENABLE_2FA &&
      user.twoFactorAuthMethods.includes(method)
    ) {
      return;
    }

    if (
      (method === TwoFactorAuthMethods.SMS && !user.phoneNumberVerified) ||
      (method === TwoFactorAuthMethods.EMAIL && !user.emailVerified)
    ) {
      throw new UserNotVerifiedException();
    }

    if (method === TwoFactorAuthMethods.SMS) {
      this.requestSmsCode(userId, action);
    }
    if (method === TwoFactorAuthMethods.EMAIL) {
      this.requestEmailCode(userId, action);
    }
  }

  public async requestSmsCode(
    userId: string,
    action: TwoFactorAuthActions,
  ): Promise<void> {
    const user = await this.userService.getById(userId);

    const userPhoneNumber = user.phoneNumber.completeNumber;

    if (!userPhoneNumber) {
      throw new HttpException(
        'User does not have a phone number registered',
        HttpStatus.BAD_REQUEST,
      );
    }
    const redisKey = `${user.id}_${action}_sms_otp`;

    const code = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const existingCode = await redisClient.get(redisKey);

    if (existingCode) {
      redisClient.del(redisKey);
    }

    await redisClient.setEx(redisKey, 500, code);
    return await this.smsService.sendAuthCode(userPhoneNumber, code);
  }

  public async validateSmsCode(
    userId: string,
    submittedCode: string,
    action: TwoFactorAuthActions,
  ): Promise<void> {
    const user = await this.userService.getById(userId);

    if (!user) throw new UserNotFoundException();

    const redisKey = `${user.id}_${action}_sms_otp`;

    const storedOtp = await redisClient.get(redisKey);

    if (storedOtp !== submittedCode) {
      throw new InvalidAuthCodeException();
    }

    redisClient.del(redisKey);
  }

  public async requestEmailCode(
    userId: string,
    action: TwoFactorAuthActions,
  ): Promise<void> {
    const user = await this.userService.getById(userId);

    if (!user) throw new UserNotFoundException();

    const email = user.email;

    const code = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const redisKey = `${user.id}_${action}_email_otp`;
    const existingCode = await redisClient.get(redisKey);
    if (existingCode) {
      redisClient.del(redisKey);
    }

    await redisClient.setEx(redisKey, 500, code);

    return await this.mailingService.sendAuthCodeEmail(
      user.username,
      email,
      code,
    );
  }

  public async validateEmailCode(
    userId: string,
    submittedCode: string,
    action: TwoFactorAuthActions,
  ): Promise<void> {
    const user = await this.userService.getById(userId);

    if (!user) throw new UserNotFoundException();

    const redisKey = `${user.id}_${action}_email_otp`;
    const storedOtp = await redisClient.get(redisKey);

    if (storedOtp !== submittedCode) {
      throw new InvalidAuthCodeException();
    }

    redisClient.del(redisKey);
  }
}
