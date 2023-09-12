import { IsEnum, IsOptional } from "class-validator";
import { TwoFactorAuthMethods } from "../enums/2fa-methods.enum";
import { TwoFactorAuthActions } from "../enums/2fa-actions.enum";

export class RequestOtp {
    @IsOptional()
    @IsEnum(TwoFactorAuthMethods)
    method?: TwoFactorAuthMethods

    @IsOptional()
    @IsEnum(TwoFactorAuthActions)
    action?: TwoFactorAuthActions
}