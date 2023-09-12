import { Twilio } from "twilio";
import { SmsStrategy } from "./sms.strategy";
import { error } from "console";
import { SendSmsBody } from "../dtos/send-sms-body";

export class TwilioSmsStrategy implements SmsStrategy {
    constructor(private readonly twilioClient: Twilio){
        this.twilioClient = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_ACCOUNT_TOKEN)
    }

    sendSms(sendSmsBody: SendSmsBody){
        this.twilioClient.messages.create({
            to: `+${sendSmsBody.destinationNumber}`,
            body: sendSmsBody.body,
            from: process.env.TWILIO_PHONE_NUMBER
        }).catch((error)=>{
            throw new Error
        })
        return Promise.resolve()
    }

}