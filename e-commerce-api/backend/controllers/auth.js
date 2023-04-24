const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedError,
} = require("../errors");
const { attachCookiesResponse } = require("../utils/jwt");
const createHash = require("../utils/createHash");
const createTokenUser = require("../utils/createTokenUser");
const sendVerificationEmail = require("../utils/sendVerification");
const sendResetPasswordEmail = require("../utils/sendResetPasswordEmail");
const crypto = require("crypto");
const Token = require("../models/Token");
const register = async (req, res) => {
  const { email } = req.body;
  const isExistEmail = await User.findOne({ email });
  if (isExistEmail) throw new BadRequestError("Email already exists");
  const isFirstUser = (await User.countDocuments({})) === 0;
  if (isFirstUser) {
    req.body.role = "admin";
  }
  const verificationToken = crypto.randomBytes(40).toString("hex");
  req.body.verificationToken = verificationToken;
  const user = await User.create({ ...req.body });
  const origin = "http://localhost:3000";
  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken,
    origin,
  });
  res
    .status(StatusCodes.CREATED)
    .json({ message: "success! please check your email to verify" });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new BadRequestError(`Email is invalid`);
  const isMatchPWD = await user.comparePWD(password);
  if (!isMatchPWD) throw new BadRequestError(`Password is invalid`);
  const tokenUser = createTokenUser(user);

  let refreshToken = "";
  const existingToken = await Token.findOne({ userId: user._id });
  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new UnauthenticatedError("Invalid Credentials");
    }
    refreshToken = existingToken.refreshToken;
    attachCookiesResponse({ res, tokenUser, refreshToken });
    res.status(StatusCodes.OK).json({ user: tokenUser });
    return;
  }
  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, userId: user._id };
  await Token.create(userToken);
  attachCookiesResponse({ res, tokenUser, refreshToken });
  res.status(StatusCodes.OK).json({ user: tokenUser, userAgent, ip });
};
const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new UnauthenticatedError(`Verification Failed`);
  if (user.verificationToken !== verificationToken) {
    throw new UnauthenticatedError("Verification failed");
  }
  user.isVerified = true;
  user.verified = Date.now();
  user.verificationToken = "";
  await user.save();

  res.status(StatusCodes.OK).json({ message: "Email verified" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new UnauthenticatedError("Comfirm email failed");
  const origin = "http://localhost:3000";
  const passwordToken = crypto.randomBytes(70).toString("hex");
  await sendResetPasswordEmail({
    name: user.name,
    email: user.email,
    token: passwordToken,
    origin,
  });
  const tenMinutes = 60 * 1000 * 10;
  const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);
  user.passwordToken = createHash(passwordToken);
  user.passwordTokenExpirationDate = passwordTokenExpirationDate;
  await user.save();
  res
    .status(StatusCodes.OK)
    .json({ message: "Please check your email for reset password link" });
};

const resetPassword = async (req, res) => {
  const { token, email, password } = req.body;
  if (!token || !email || !password) {
    throw new CustomError.BadRequestError("Please provide all values");
  }
  const user = await User.findOne({ email });
  if (user) {
    const currentDate = new Date();
    if (
      user.passwordToken === createHash(token) &&
      user.passwordTokenExpirationDate > currentDate
    ) {
      user.password = password;
      user.passwordToken = null;
      user.passwordTokenExpirationDate = null;
      await user.save();
    }
  }
  return res.status(200).json({ message: "reset password successfully" });
};

const logout = async (req, res) => {
  await Token.findOneAndDelete({ userId: req.userInfo.userId });
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(StatusCodes.OK).json({ message: "logout successfully" });
};
// entire user [testing]
module.exports = {
  login,
  register,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
};

/* 
get , post ,patch , getDetail ,create



*/
