const router = require("express").Router();
const { login, register, logout } = require("../controllers/auth");
const rateLimiter = require("express-rate-limit");
const apiRateLimit = rateLimiter({
  windowWs: 60000 * 15, // 15 phut
  max: 10,
  message: "Too many requests from this IP ,please try again after 15 minutes",
});
router.route("/login").post(apiRateLimit, login);
router.route("/register").post(apiRateLimit, register);
router.route("/logout").post(logout);

module.exports = router;
