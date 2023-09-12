import { ReqUser } from "src/user/interfaces/req-user";

export interface GoogleOAuthResponse {
    user: ReqUser;
    accessToken: string;
    refreshToken: string | undefined

}