import { JwtSignOptions } from "@nestjs/jwt";

export const verificationJWTExp = Math.floor(Date.now() / 1000) + (60 * 10 * 60 * 24) //default verification token expiration time is 24h 

export const verificationTokenSecret = process.env.VERIFICATION_EMAIL_SECRET

export const verificationJWTConfig: JwtSignOptions = {
    secret: verificationTokenSecret
}

export const resetPasswordJWTExp = Math.floor(Date.now() / 1000) + (60 * 10) //default reset password token expiration time is 10 minutes

export const resetPasswordSecret = process.env.PASSWORD_RESET_EMAIL_SECRET

export const resetPasswordJWTConfig: JwtSignOptions = {
    secret: resetPasswordSecret
}

export const accountReactivationJWTExp = Math.floor(Date.now()/1000)+(60*10*60*24) // default account reactivation token expiration time is 24h
export const accountReactivationSecret = process.env.REACTIVATION_EMAIL_SECRET

export const accountReactivationJWTConfig: JwtSignOptions = {
    secret: accountReactivationSecret
}



