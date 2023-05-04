const passport = require("passport");
const router = require("express").Router();

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get("/logout", (req, res) => {
    req.logout();
  res.send("logout google");
});
router.get("/profile", (req, res) => {
  res.render("Profile" , {user:req.user});
});
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.redirect("/auth/profile");
});
module.exports = router;
