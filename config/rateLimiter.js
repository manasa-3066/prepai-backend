const rateLimit = require("express-rate-limit");

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please slow down." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  message: { success: false, message: "Too many login attempts. Try again later." },
});

const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { success: false, message: "AI request limit reached. Please wait an hour." },
});

module.exports = { globalLimiter, authLimiter, aiLimiter };