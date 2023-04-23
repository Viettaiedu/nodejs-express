const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "name must be provided"],
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "email must be provided"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email",
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, "password must be provided"],
    minlength: 6,
    maxlength: 400,
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: 20,
    default: "lastName",
  },
  location: {
    type: String,
    trim: true,
    maxlength: 20,
    default: "my city",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

UserSchema.pre("save", async function () {
  // console.log(this.modifiedPaths())
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
UserSchema.methods.createJWT = async function () {
  const token = await jwt.sign(
    { userId: this._id, name: this.name },
    process.env.PRIVATE_KEY,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
  return token;
};

UserSchema.methods.comparePassword = async function (pwd) {
  const isMatch = await bcrypt.compare(pwd, this.password);
  return isMatch;
};
module.exports = mongoose.model("User", UserSchema);
