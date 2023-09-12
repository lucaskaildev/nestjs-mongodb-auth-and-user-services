import { IsNotEmpty, IsString, Matches } from "class-validator";

export class ResetPasswordBody {
    @IsString()
    @IsNotEmpty()
    @Matches('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')
    password: string
}

