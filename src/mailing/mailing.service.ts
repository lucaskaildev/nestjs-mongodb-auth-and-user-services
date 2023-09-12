import { Injectable } from '@nestjs/common';
import { SendEmailBody } from './interfaces/send-email-body';
import { NodemailerStrategy } from './strategies/nodemailer.strategy';

@Injectable()
export class MailingService {
  constructor(private readonly mailingStrategy: NodemailerStrategy) {}

  public async sendEmail(sendEmailBody: SendEmailBody): Promise<void> {
    await this.mailingStrategy.sendEmail(sendEmailBody)   
  }

  public async sendDeactivationEmail(username: string, email: string): Promise<void> {
    await this.mailingStrategy.sendDeactivationEmail(username, email)
  }

  public async sendVerificationEmail(verificationToken: string, username: string, email: string): Promise<void> {
    await this.mailingStrategy.sendVerificationEmail(verificationToken, username, email)
  }

  public async sendReactivationEmail(reactivationToken: string, username: string, email: string): Promise<void> {
   await this.mailingStrategy.sendReactivationEmail(reactivationToken, username, email)
  }

  public async sendAuthCodeEmail(username: string, email: string, code: string): Promise<void>{
    await this.mailingStrategy.sendAuthCodeEmail(username, email, code)
  }

  public async sendResetPasswordEmail(resetPasswordToken: string, username: string, email: string): Promise<void>{
   await this.mailingStrategy.sendResetPasswordEmail(resetPasswordToken, username, email)
  }
}

