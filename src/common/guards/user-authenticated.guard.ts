import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();
      if (!request.isAuthenticated()) return false;

      const user = await this.userService.getById(
        request.session.passport.user.id,
      );

      if (
        user.twoFactorAuthEnabled &&
        !request.session.passport.user.twoFaAuthenticated
      ) {
        return false;
      }

      return true
      
  }
}
