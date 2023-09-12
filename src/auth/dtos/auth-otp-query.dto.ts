import { Type } from "class-transformer";
import { IsEmail, IsEnum, IsNumberString, IsOptional, IsString, MinLength } from "class-validator";
import { TwoFactorAuthMethods } from "../enums/2fa-methods.enum";
import { TwoFactorAuthActions } from "../enums/2fa-actions.enum";

export class AuthOtpQuery {
    @IsString()
    @IsNumberString()
    @MinLength(6)
    code: string

    @IsOptional()
    @IsEnum(TwoFactorAuthMethods)
    method?: TwoFactorAuthMethods

    @IsOptional()
    @IsEnum(TwoFactorAuthActions)
    action?: TwoFactorAuthActions

    @IsOptional()
    @IsEmail()
    email?: string
}
