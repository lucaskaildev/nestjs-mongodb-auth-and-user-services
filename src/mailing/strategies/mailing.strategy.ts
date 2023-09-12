import { SendEmailBody } from "../interfaces/send-email-body"

export interface MailingStrategy {
    sendEmail(sendEmailBody: SendEmailBody): Promise<void>
    sendDeactivationEmail(username: string, email:string): Promise<void>
    sendVerificationEmail(verificationToken: string, username: string, email: string): Promise<void>
    sendReactivationEmail(reactivationToken: string, username: string, email: string): Promise<void>
    sendAuthCodeEmail(username: string, email: string, code: string): Promise<void>
    sendResetPasswordEmail(resetPasswordToken: string, username: string, email: string): Promise<void>
    
  }