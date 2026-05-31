import rateLimit from 'express-rate-limit';

// 1. Credit Check Middleware: bypassed since AetherArt is now 100% free and unlimited for all users
export const checkCredits = async (req, res, next) => {
  next();
};

// 2. Generation rate limiter depending on User subscription tier (unlocked to a high limit for everyone)
export const generateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // Generous 60 images per minute
  message: {
    success: false,
    message: 'Too many images generated recently. Please slow down.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user?.id || req.ip;
  }
});
