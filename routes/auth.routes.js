// const router = require("express").Router();
// const { register, login } = require("../controllers/authController");

// router.post("/register", register);
// router.post("/login", login);

// module.exports = router;

const router = require("express").Router();
const { register, login } = require("../controllers/authController");
const validate = require("../middlewares/validate");
const { registerRules, loginRules } = require("../middlewares/rules/authRules");

router.post("/register", registerRules, validate, register);
router.post("/login",    loginRules,    validate, login);

module.exports = router;