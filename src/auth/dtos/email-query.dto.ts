import { IsEmail, IsString } from "class-validator";

export class EmailQuery {
    @IsString()
    @IsEmail()
    email: string;
}