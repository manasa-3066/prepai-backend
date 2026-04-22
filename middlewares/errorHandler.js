const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(`[${req.method}] ${req.path} → ${err.message}`);
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

const createError = (message, statusCode = 400) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

module.exports = { errorHandler, createError };