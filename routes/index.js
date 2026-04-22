const router = require("express").Router();
const { protect } = require("../middlewares/authMiddleware");

router.use("/auth", require("./auth.routes"));
router.use("/interview", require("./interview.routes"));


module.exports = router;