import "dotenv/config"
import { createClient } from "redis";

const RedisStore = require('connect-redis').default

export const redisClient = createClient({
  url: process.env.REDIS_URL 
});

export const redisStore = new RedisStore({ host: process.env.REDIS_HOST, port: process.env.REDIS_PORT, client: redisClient })

