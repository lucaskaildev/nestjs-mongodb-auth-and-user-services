import { Injectable, ExecutionContext } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
@Injectable()
export class GoogleOAuthGuard extends AuthGuard("google") {
    constructor(){
        super({accessType: 'offline'})
    }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const result = (await super.canActivate(context)) as boolean;
        const request = context.switchToHttp().getRequest();
        await super.logIn(request);
        return result;  
      }
} 