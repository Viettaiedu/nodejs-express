const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  googleId: String,
  name: String,
});

module.exports = mongoose.model("User", UserSchema);
