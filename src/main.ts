import { NestFactory} from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { redisClient } from './config/redis-store.config'
import {rateLimit} from "express-rate-limit"
import { ValidationPipe } from '@nestjs/common';
import { sessionConfig } from './config/session.config';
import { rateLimitConfig } from './config/rate-limit.config';
const session = require("express-session");


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }))
  
  app.enableCors({
    origin: '*',
  });

  


  app.use(rateLimit(rateLimitConfig))

  app.use(morgan('combined'));
  app.use(cookieParser());

  await redisClient.connect().catch((err)=>{
    console.log("Problems connecting to redis store")
  })

  app.use(session(sessionConfig));

  app.use(passport.initialize());
  app.use(passport.session());
  app.listen(process.env.APP_PORT);
}
bootstrap();
