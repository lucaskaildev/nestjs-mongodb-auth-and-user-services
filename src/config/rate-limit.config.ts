export const rateLimitConfig = {
    windowMs: 10 * 60 * 1000,
    max: 100, 
    standardHeaders: true, 
    legacyHeaders: false, 
    skipSuccessfulRequests: false, 
    message: { "message": 'Request limit exceeded. Try again later.', "statusCode": 403, }
  }