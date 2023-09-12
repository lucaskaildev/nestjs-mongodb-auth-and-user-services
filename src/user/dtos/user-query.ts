import { IsArray, IsEmail, IsOptional, IsString } from 'class-validator';

export class UserQuery {
  
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  mpCustomerId?: string;
}
