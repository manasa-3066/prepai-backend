const { validationResult } = require("express-validator");

// This middleware runs after validation rules
// If any rule failed, it sends the errors back immediately
// If all rules passed, it calls next() to continue to the controller
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg, // send first error message
    });
  }
  next();
};

module.exports = validate;