const { body } = require("express-validator");

const COMPANIES   = ["Google","Amazon","Microsoft","Meta","Apple",
                     "TCS","Infosys","Wipro","Accenture","Flipkart",
                     "Swiggy","Zomato","Razorpay","CRED","Startup"];
const ROLES       = ["Frontend Developer","Backend Developer",
                     "Full Stack Developer","Data Analyst",
                     "Data Scientist","DevOps Engineer",
                     "System Design Engineer","Software Engineer"];
const DIFFICULTIES = ["easy","medium","hard"];

const startRules = [
  body("company")
    .trim()
    .notEmpty().withMessage("Company is required")
    .isIn(COMPANIES).withMessage("Invalid company selected"),

  body("role")
    .trim()
    .notEmpty().withMessage("Role is required")
    .isIn(ROLES).withMessage("Invalid role selected"),

  body("difficulty")
    .trim()
    .notEmpty().withMessage("Difficulty is required")
    .isIn(DIFFICULTIES).withMessage("Difficulty must be easy, medium or hard"),
];

const evaluateRules = [
  body("sessionId")
    .notEmpty().withMessage("Session ID is required"),

  body("questionIndex")
    .notEmpty().withMessage("Question index is required")
    .isInt({ min: 0, max: 4 }).withMessage("Invalid question index"),

  body("userAnswer")
    .trim()
    .notEmpty().withMessage("Answer is required")
    .isLength({ min: 10 }).withMessage("Answer is too short"),
];

module.exports = { startRules, evaluateRules };