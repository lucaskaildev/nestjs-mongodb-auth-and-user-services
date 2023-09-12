import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../../user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowedRoles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();
    if (!allowedRoles) return true
    if (request?.user) {
      const { id } = request.user;
      const user = await this.userService.getById(id);
      const permissions = allowedRoles.map((role)=>{
        if (user.roles.includes(role)) return true
      })
      return permissions.includes(true)
    }

    return false;
  }
}