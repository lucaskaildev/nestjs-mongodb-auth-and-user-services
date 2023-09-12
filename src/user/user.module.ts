import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'src/config/redis-store.config';

@Module({
  imports: [MongooseModule.forFeature([{
    name: User.name,
    schema: UserSchema
  }]), CacheModule.register({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    store: redisStore.redisStore,
    ttl: 60 * 10,
  })],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
