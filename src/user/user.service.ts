import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { User } from "./user.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { UserRegisterBody } from "./dtos/user-register-body";
import { UserNotFoundException } from "src/common/exceptions/user-not-found.exception";
import { UserQuery } from "./dtos/user-query";
import { UserUpdateBody } from "./dtos/user-update-body";
import { Request } from "express";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async create(userRegisterBody: UserRegisterBody) {
    const user = await this.userModel.create(userRegisterBody);
    return user;
  }

  async getById(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async getOne(userQuery: UserQuery) {
    const user = await this.userModel.findOne(userQuery);
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }

  async get(userQuery: UserQuery) {
    const users = await this.userModel.find(userQuery);

    if (!users.length) {
      throw new UserNotFoundException();
    }

    return users;
  }

  async updateById(id: string, update: UserUpdateBody, req?: Request) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new UserNotFoundException();
    }

    if (
      update.defaultTwoFactorAuthMethod &&
      !user.twoFactorAuthMethods.includes(update.defaultTwoFactorAuthMethod)
    ) {
      throw new HttpException(
        "The specified 2FA method is not enabled.",
        HttpStatus.BAD_REQUEST
      );
    }

    
    await user.updateOne(update);
    this.cacheManager.del(`/user/${user.id}`);
    
    if (update.email){
     user.emailVerified = false
    }

    if (update.password) {
      user.password = update.password;
      if (req && req.session) await req.session.destroy();
    }
    if (update.username) {
      req.session.passport.user.username = update.username;
    }

    await user.save()
  }

  async deleteUserById(id: string) {
    await this.userModel.findByIdAndDelete(id).catch((error) => {
      throw new Error();
    });
  }
}
