import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { UserPhoneNumber } from './user-phone-number';
import { IsAdultBirthday } from 'src/common/decorators/validation/is-adult-birthday.decorator';
import { Type } from 'class-transformer';
import { passwordRegEx, passwordRegExTransformer } from '../consts/user-validation-parameter.consts';
import { invalidAgeValidationErrorMessage, invalidPasswordValidationErrorMessage } from '../consts/user-validation-error-messages.consts';

export class UserRegisterBody {
  @IsString()
  @MinLength(4)
  username: string;

  @IsString()
  @MinLength(8)
  @Matches(
   passwordRegEx,
    passwordRegExTransformer,
    {
      message:
        invalidPasswordValidationErrorMessage,
    },
  )
  password: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  firstName: string;

  @IsString()
  @MinLength(2)
  lastName: string;

  @IsOptional()
  @ValidateNested({each: true})
  @Type(() => UserPhoneNumber)
  phoneNumber: UserPhoneNumber;

  @IsDateString()
  @IsAdultBirthday({
    message: invalidAgeValidationErrorMessage,
  })
  dateOfBirth: Date;
}
