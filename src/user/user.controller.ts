import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Delete,
  Req,
  UseInterceptors,
  Inject,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UserUpdateBody } from "./dtos/user-update-body";
import { AuthenticatedGuard } from "src/common/guards/user-authenticated.guard";
import { RolesGuard } from "src/common/guards/roles.guard";
import { Roles } from "src/common/decorators/handler-decorators/roles.decorator";
import { UserRoles } from "./interfaces/user-roles";
import { User } from "src/common/decorators/param/user.decorator";
import { ReqUser } from "./interfaces/req-user";
import { ForbiddenResourceException } from "src/common/exceptions/forbidden-resource.exception";
import { Request } from "express";
import { CACHE_MANAGER, CacheInterceptor } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@UseGuards(AuthenticatedGuard)
@UseGuards(RolesGuard)
@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) cacheManager: Cache
  ) {}

  @UseInterceptors(CacheInterceptor)
  @Get(":id")
  async getById(@User() user: ReqUser, @Param("id") id: string) {
    if (user.id !== id) {
      throw new ForbiddenResourceException();
    }

    return await this.userService.getById(id);
  }

  @Get()
  async getCurrentUser(@User() user: ReqUser) {
    return await this.userService.getById(user.id);
  }

  @Post(":id")
  async updateById(
    @Req() req: Request,
    @User() user: ReqUser,
    @Param("id") id: string,
    @Body()
    body: UserUpdateBody
  ) {
    if (user.id !== id) throw new ForbiddenResourceException();
    await this.userService.updateById(id, body, req);
  }

  @Roles(UserRoles.ADMIN)
  @Delete(":id")
  async delete(@Param("id") id: string) {
    await this.userService.deleteUserById(id);
  }
}
