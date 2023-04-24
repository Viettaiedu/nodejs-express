const jwt = require("jsonwebtoken");
const createJWT = (payload) => {
  const token = jwt.sign({ ...payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFITIME,
  });
  return token;
};
const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET);
const attachCookiesResponse = ({ res, tokenUser, refreshToken }) => {
  const token = createJWT(tokenUser);
  const refreshTokenJWT = createJWT({ tokenUser, refreshToken });
  const oneDay = 1000 * 60 * 60 * 24;
  const oneMonth = 1000 * 60 * 60 * 24 * 30;
  res.cookie("accessToken", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
  });
  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + oneMonth),
    secure: process.env.NODE_ENV === "production",
  });
  return token;
};
module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesResponse,
};
