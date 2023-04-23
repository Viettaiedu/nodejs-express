const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name must be provided"],
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide valid email",
    },
  },
  password: {
    type: String,
    required: [true, "Password must be provided"],
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  verificationToken: String,
  isVerified: { type: Boolean, default: false },
  verified: Date,
  passwordToken :String,
  passwordTokenExpirationDate:Date,
});

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
UserSchema.methods.comparePWD = async function (pwd) {
  return await bcrypt.compare(pwd, this.password);
};

module.exports = mongoose.model("User", UserSchema);
