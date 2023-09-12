import {IsString, IsNotEmpty, MinLength} from 'class-validator'
export class UserPhoneNumber {
    
    @IsString()
    @IsNotEmpty()
    countryCode: string;
    
    @IsString()
    @MinLength(5)
    number: string;

    @IsString()
    @MinLength(8)
    completeNumber: string;
}