const {
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
} = require("../errors");
const { isTokenValid } = require("../utils/jwt");

const authenticateUser = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) throw new UnauthenticatedError("Authentication invalid");
  try {
    const { userId, email, role } = isTokenValid(token);
    req.userInfo = { userId, email, role };
    next();
  } catch (error) {
    console.log(error);
  }
};

const authorizePermession = (...roles) => {
  console.log(roles);
  return (req, res, next) => {
    if (!roles.includes(req.userInfo.role)) {
      throw new UnauthenticatedError("Authentication invalid");
    }
    next();
  };
};
module.exports = { authenticateUser, authorizePermession };
