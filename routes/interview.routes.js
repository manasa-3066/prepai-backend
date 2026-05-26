// const router = require("express").Router();
// const { protect } = require("../middlewares/authMiddleware");
// const {
//   generate,
//   startInterview,
//   evaluateAnswer,
//   completeInterview,
//   getHistory,
// } = require("../controllers/interviewController");

// router.post("/generate",  protect, generate);
// router.post("/start",     protect, startInterview);
// router.post("/evaluate",  protect, evaluateAnswer);
// router.post("/complete",  protect, completeInterview);
// router.get("/history",    protect, getHistory);

// module.exports = router;

const router = require("express").Router();
const { protect } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");
const { startRules, evaluateRules } = require("../middlewares/rules/interviewRules");
const {
  generate,
  startInterview,
  evaluateAnswer,
  completeInterview,
  getHistory,
} = require("../controllers/interviewController");

router.post("/generate",  protect, generate);
router.post("/start",     protect, startRules,    validate, startInterview);
router.post("/evaluate",  protect, evaluateRules, validate, evaluateAnswer);
router.post("/complete",  protect, completeInterview);
router.get("/history",    protect, getHistory);

module.exports = router;