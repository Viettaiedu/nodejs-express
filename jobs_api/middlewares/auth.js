require("dotenv").config();
const jwt = require("jsonwebtoken");
const { UnauthenrizationError } = require("../errors");
const checkAuth = async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) throw new UnauthenrizationError("token is invalid");
  try {
    const decoded = await jwt.verify(token, process.env.PRIVATE_KEY);
    const testUser = decoded.userId === "643e526ef57a1767e8b65645";
    req.userInfo = { userId: decoded.userId, name: decoded.name ,testUser };
  } catch (err) {
    console.log(err);
  }
  next();
};

module.exports = checkAuth;
