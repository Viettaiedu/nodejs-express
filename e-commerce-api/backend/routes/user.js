const router = require("express").Router();
const {
  getAllUsers,
  getSingleUser,
  updateUser,
  updateUserPassword,
  showCurrentUser,
} = require("../controllers/user");
const {authenticateUser ,authorizePermession} = require('../middleware/authentication');
router.route("/updateUser").patch(authenticateUser,updateUser);
router.route("/updateUserPassword").patch(authenticateUser,updateUserPassword);
router.route("/show-me").get(authenticateUser,showCurrentUser);
router.route("").get(authenticateUser, authorizePermession('admin'),getAllUsers);
router.route("/:id").get(authenticateUser,getSingleUser);

module.exports = router;
