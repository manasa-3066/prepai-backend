const router = require("express").Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  generate,
  startInterview,
  evaluateAnswer,
  completeInterview,
  getHistory,
} = require("../controllers/interviewController");

router.post("/generate",  protect, generate);
router.post("/start",     protect, startInterview);
router.post("/evaluate",  protect, evaluateAnswer);
router.post("/complete",  protect, completeInterview);
router.get("/history",    protect, getHistory);

module.exports = router;