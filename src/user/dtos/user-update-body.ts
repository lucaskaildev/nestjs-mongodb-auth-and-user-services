import { IsEmail, IsEnum, IsOptional, IsString, Matches, MinLength } from "class-validator"
import { UserPhoneNumber } from "./user-phone-number"
import { Type } from "class-transformer"
import { TwoFactorAuthMethods } from "src/auth/enums/2fa-methods.enum"
import { passwordRegEx, passwordRegExTransformer } from "../consts/user-validation-parameter.consts"
import { invalidPasswordValidationErrorMessage } from "../consts/user-validation-error-messages.consts"

export class UserUpdateBody {
  
  @IsOptional()
  @IsString()
  @MinLength(4)
  username?: string  
  
  @IsOptional()
  @IsString()
  @MinLength(8)
  @Matches(passwordRegEx, passwordRegExTransformer, {
    message: invalidPasswordValidationErrorMessage
  })
  password?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsString()
  @MinLength(2)
  firstName?: string

  @IsOptional()
  @IsString()
  @MinLength(2)
  lastName?: string
  
  @IsOptional()
  @Type(()=> UserPhoneNumber)
  phoneNumber?: UserPhoneNumber
  
  @IsOptional()
  @IsEnum(TwoFactorAuthMethods)
  defaultTwoFactorAuthMethod?: TwoFactorAuthMethods

}
