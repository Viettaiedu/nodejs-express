const router = require("express").Router();

const {
  login,
  register,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");
const { authenticateUser } = require("../middleware/authentication");
router.route("/login").post(login);
router.route("/register").post(register);
router.route("/logout").post(authenticateUser, logout);
router.route("/verify-email").post(verifyEmail);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);

module.exports = router;
