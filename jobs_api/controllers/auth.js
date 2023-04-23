const { StatusCodes } = require("http-status-codes");
const { attachCookie , removeCookie } = require("../utils/cookie");
const {
  BadRequestError,
  NotFoundError,
} = require("../errors");
const User = require("../models/User");
const register = async (req, res) => {
  const { name, password, email } = req.body;
  if (!name || !password || !email)
    throw new BadRequestError("Please provide all infomation");
  const isCheckEmail = await User.findOne({ email });
  if (isCheckEmail) throw new BadRequestError("Email is existing");
  const user = await User.create({ ...req.body });
  const token = await user.createJWT();
  attachCookie({ res, token });
  res.status(StatusCodes.OK).json({ user, token });
};
const login = async (req, res) => {
  const { password, email } = req.body;
  if (!email || !password || !email)
    throw new BadRequestError("Please provide all infomation");
  const user = await User.findOne({ email });
  if (!user) throw new NotFoundError("Email is not existing");
  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new BadRequestError("password is invalid");
  const token = await user.createJWT();
  attachCookie({ res, token });
  res.status(StatusCodes.OK).json({ user, token });
};
const logout = async (req, res) => {
  removeCookie({res});
  res.status(StatusCodes.OK).json({ message:"Logout have been succesfully" });
};
module.exports = {
  register,
  login,
  logout
};
