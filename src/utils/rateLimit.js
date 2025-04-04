import { rateLimit } from 'express-rate-limit'

export const rate_Limit = rateLimit({
    windowMs: 1*5000, // 5 segundos
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Redis, Memcached, etc. See below.
  statusCode: 429,
  message: 'Too many requests. Please try again later'
})

