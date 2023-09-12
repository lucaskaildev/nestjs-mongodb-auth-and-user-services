import { Express } from "express-serve-static-core";
import { ReqUser } from "src/user/types/req-user";
declare module "express-serve-static-core" {
  interface Request {
    user: ReqUser;
    session: Session & Partial<SessionData> = {
      passport: any
    }
  }
}