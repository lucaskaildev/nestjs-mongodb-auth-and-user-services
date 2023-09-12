import { redisStore } from "./redis-store.config";


export const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  store: redisStore,
  saveUninitialized: false,
  resave: false,
  name: "SID",
  cookie: {
    httpOnly: true,
    maxAge: 60*60*60*24,
  },
};
