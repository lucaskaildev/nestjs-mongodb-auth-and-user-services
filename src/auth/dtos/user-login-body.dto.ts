import { IsNotEmpty, IsString } from "class-validator";

export class UserLoginBody {
    @IsString()
    @IsNotEmpty()
    username: string;
    
    @IsString()
    @IsNotEmpty()
    password: string;
}