const router = require("express").Router();
const { protect } = require("../middlewares/authMiddleware");

router.use("/auth", require("./auth.routes"));

// temporary test route — we will delete this after testing
router.get("/protected-test", protect, (req, res) => {
  res.json({
    success: true,
    message: "You are inside a protected route",
    user: req.user,
  });
});

module.exports = router;