import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

export class SendEmailBody {
    
    @IsOptional()
    @IsEmail()
    senderEmail?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    senderName?: string;

    @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
        each: true,
        message: "Recipient e-mails must be valid e-mail addresses."
    })
    recipientEmail: string[]

    @IsString()
    @IsNotEmpty()
    subject: string;

    @IsOptional()
    @IsString()
    emailText?: string;

    @IsOptional()
    @IsString()
    emailHtml?: string;
}