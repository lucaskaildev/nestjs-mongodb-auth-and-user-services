import { MailingStrategy } from './mailing.strategy';
import { transporter } from '../../config/mailing-service.config';
import { SendEmailBody } from '../interfaces/send-email-body';
import {
  authCodeEmailSubject,
  deactivationEmailSubject,
  defaultSenderEmail,
  defaultSenderName,
  reactivationEmailSubject,
  resetPasswordEmailSubject,
  verificationEmailSubject,
} from '../consts/email-body.consts';
import {
  getAuthCodeEmail,
  getDeactivationEmailHtml,
  getReactivationEmail,
  getResetPasswordEmail,
  getVerificationEmailHtml,
} from 'src/mailing/helpers/get-email-html.helper';
import { AuthRoutes } from 'src/auth/auth-route.enum';
import { HttpException, HttpStatus } from '@nestjs/common';

export class NodemailerStrategy implements MailingStrategy {
  constructor() {}

  async sendEmail(sendEmailBody: SendEmailBody): Promise<void> {
    await transporter
      .sendMail({
        from: `${sendEmailBody.senderName ?? defaultSenderName} <${
          sendEmailBody.senderEmail ?? defaultSenderEmail
        }>`,
        to: sendEmailBody.recipientEmail,
        subject: sendEmailBody.subject,
        text: sendEmailBody.emailText ?? null,
        html: sendEmailBody.emailHtml ?? null,
      })
      .catch((error) => {
        throw new HttpException('Error while sending email', HttpStatus.INTERNAL_SERVER_ERROR)
      });
    return Promise.resolve();
  }

  sendDeactivationEmail(username: string, email: string): Promise<void> {
    this.sendEmail({
      recipientEmail: [email],
      subject: deactivationEmailSubject,
      emailHtml: getDeactivationEmailHtml(username),
    });
    return Promise.resolve();
  }

  async sendVerificationEmail(
    verificationToken: string,
    username: string,
    email: string,
  ): Promise<void> {
    const verificationHref = `${AuthRoutes._BASE_ROUTE}/${AuthRoutes._VERIFY_EMAIL_BASE}/${verificationToken}`;
    await this.sendEmail({
      recipientEmail: [email],
      subject: verificationEmailSubject,
      emailHtml: getVerificationEmailHtml(verificationHref, username),
    });
    return Promise.resolve();
  }

  async sendReactivationEmail(
    reactivationToken: string,
    username: string,
    email: string,
  ): Promise<void> {
    const reactivationHref = `${AuthRoutes._BASE_ROUTE}/${AuthRoutes._REACTIVATE_ACCOUNT_BASE}/${reactivationToken}`;
    await this.sendEmail({
      recipientEmail: [email],
      subject: reactivationEmailSubject,
      emailHtml: getReactivationEmail(reactivationHref, username),
    });
    return Promise.resolve();
  }

  async sendAuthCodeEmail(
    username: string,
    email: string,
    code: string,
  ): Promise<void> {
    await this.sendEmail({
      recipientEmail: [email],
      subject: authCodeEmailSubject,
      emailHtml: getAuthCodeEmail(username, code),
    })
  }

  async sendResetPasswordEmail(
    username: string,
    email: string,
    resetPasswordToken: string,
  ): Promise<void> {
    try {
      
      // this href should later be replaced following the next flow click on href -> takes you to the app client with token -> ...
      // ... post from the app client to the app server with token and new password included
      const resetPasswordHref = `${AuthRoutes._BASE_ROUTE}/${AuthRoutes._RESET_PASSWORD}/${resetPasswordToken}`;
      await this.sendEmail({
        recipientEmail: [email],
        subject: resetPasswordEmailSubject,
        emailHtml: getResetPasswordEmail(username, resetPasswordHref),
      });
    } catch (error) {
      throw new Error
    }
  }
}
