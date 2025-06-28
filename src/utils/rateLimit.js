import { rateLimit } from 'express-rate-limit'

export const rate_Limit = rateLimit({
    windowMs: 1*5000,
    standardHeaders: 'draft-7',
    legacyHeaders: false, 
  statusCode: 429,
  message: 'Too many requests. Please try again later'
})

