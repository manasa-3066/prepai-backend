const jwt = require("jsonwebtoken");
const { createError } = require("./errorHandler");

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return next(createError("No token provided", 401));

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    next(createError("Invalid or expired token", 401));
  }
};

module.exports = { protect };