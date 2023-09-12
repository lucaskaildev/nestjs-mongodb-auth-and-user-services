import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class SendSmsBody{
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    destinationNumber?: string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    destinationCountryCode?: string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    originNumber?: string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    originCountryCode?: string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    body?: string
    
}