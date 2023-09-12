import {
  Controller,
  Post,
  UseGuards,
  Get,
  Body,
  Param,
  Session,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { GoogleOAuthGuard } from 'src/common/guards/google-oauth.guard';
import { UserRegisterBody } from 'src/user/dtos/user-register-body';
import { User } from 'src/common/decorators/param/user.decorator';
import { ReqUser } from 'src/user/interfaces/req-user';
import { AuthenticatedGuard } from 'src/common/guards/user-authenticated.guard';
import { AuthRoutes } from './auth-route.enum';
import { EmailQuery } from './dtos/email-query.dto';
import { AuthOtpQuery } from './dtos/auth-otp-query.dto';
import { ResetPasswordBody } from './dtos/reset-password-body.dto';
import { RequestOtp } from './dtos/request-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post(AuthRoutes._REGISTER)
  async registerAccount(
    @Body()
    body: UserRegisterBody,
  ): Promise<void> {
    await this.authService.registerAccount(body);
  }

  @Get(AuthRoutes._REQUEST_EMAIL_VERIFICATION)
  async requestEmailVerification(@Query() query: EmailQuery): Promise<void> {
    const {email} = query
    return await this.authService.requestEmailVerification(email);
  }

  @Get(AuthRoutes._VERIFY_EMAIL)
  async verifyEmail(@Param('verificationToken') verificationToken: string): Promise<void> {
    return await this.authService.verifyEmail(verificationToken);
  }

  @UseGuards(AuthenticatedGuard)
  @Get(AuthRoutes._REQUEST_PHONE_VERIFICATION)
  async requestPhoneVerification(@User() user: ReqUser): Promise<void> {
    await this.authService.requestPhoneNumberVerification(user.id);
  }

  @UseGuards(AuthenticatedGuard)
  @Get(AuthRoutes._VERIFY_PHONE_NUMBER)
  async verifyPhoneNumber(@User() user: ReqUser, @Query() query: AuthOtpQuery): Promise<void> {
    const {code} = query
    await this.authService.verifyPhoneNumber(user.id, code);
  }

  @UseGuards(AuthenticatedGuard)
  @Get(AuthRoutes._REQUEST_ENABLE_2FA)
  async requestEnable2fa(@User() user: ReqUser, @Query() query: RequestOtp  ){
    const {method} = query
    await this.authService.request2FaEnable(user.id, method)
  }

  @UseGuards(AuthenticatedGuard)
  @Get(AuthRoutes._ENABLE_2FA)
  async enable2fa(
    @User() user: ReqUser,
    @Query() query: AuthOtpQuery
  ): Promise<ReqUser> {
    const {method, code} = query
    await this.authService.enable2Fa(user.id, method, code);
    user.twoFaAuthenticated = true
    return user
  }

  @Get(AuthRoutes._VALIDATE_LOGIN_2FA_OTP)
  async validateLogin2FaOtp(@User() user: ReqUser, @Session() session: Record<string, any>, @Query() query: AuthOtpQuery): Promise<void>{
    const {method, code} = query
    await this.authService.validateLogin2FaOtp(user.id, method, code, session)
  }

  @UseGuards(LocalAuthGuard)
  @Post()
  logIn(
    @User() user: ReqUser,
  ): ReqUser {
    return user;
  }

  @UseGuards(GoogleOAuthGuard)
  @Get(AuthRoutes._GOOGLE_OAUTH_LOGIN)
  googleOAuthLogin(@User() user: ReqUser): ReqUser {
    return user;
  }

  @UseGuards(GoogleOAuthGuard)
  @Get(AuthRoutes._GOOGLE_OAUTH_LOGIN_REDIRECT)
  googleOAuthRedirect(@User() user: ReqUser): ReqUser {
    return user;
  }

  @Get(AuthRoutes._LOGOUT)
  async logout(@Session() session: Record<string, any>): Promise<void> {
    await this.authService.logOutAccount(session);
  }

  @Get(AuthRoutes._REQUEST_PASSWORD_RESET)
  async requestPasswordReset(@Query() query: EmailQuery): Promise<void> {
    const {email} = query
    await this.authService.requestPasswordReset(email);
  }

  @Get(AuthRoutes._VALIDATE_PASSWORD_RESET_OTP)
  async validatePasswordResetOtp(@Query() query: AuthOtpQuery): Promise<void>{
    const {email, method, code} = query
    await this.authService.validatePasswordResetOtp(email, method, code)
  }

  @Post(`${AuthRoutes._RESET_PASSWORD}/:token`)
  async resetUserPassword(@Param('token') token: string, @Body() body: ResetPasswordBody): Promise<void> {
    const {password} = body
    await this.authService.resetUserPassword(token, password);
  }

  @UseGuards(AuthenticatedGuard)
  @Post(AuthRoutes._DEACTIVATE_ACCOUNT)
  async deactivateAccount(
    @User() user: ReqUser,
    @Session() session: Record<string, any>,
    @Body() body: ResetPasswordBody,
  ): Promise<void> {
    const {password} = body
    await this.authService.deactivateAccount(
      user.id,
      password,
      session,
    );
  }

  @Get(`${AuthRoutes._REACTIVATE_ACCOUNT_BASE}/:reactivationToken`)
  async reactivateAccount(@Param('reactivationToken') reactivationToken: string): Promise<void>{
    await this.authService.reactivateAccount(reactivationToken)
  }

}
