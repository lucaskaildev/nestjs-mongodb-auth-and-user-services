import { Injectable } from "@nestjs/common"
import { PassportSerializer } from "@nestjs/passport"
import { User } from "src/user/user.schema"

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: User, done: (err: Error, user: User) => void): void {
    done(null, user)
  }
  
  deserializeUser(
    payload: any,
    done: (err: Error, payload: string) => void
  ): void {
    done(null, payload)
  }
}