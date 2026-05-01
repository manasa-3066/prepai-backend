const router = require("express").Router();

router.use("/auth",      require("./auth.routes"));
router.use("/interview", require("./interview.routes"));
router.use("/skillgap",  require("./skillGap.routes"));
router.use("/chat",      require("./chat.routes"));

module.exports = router;