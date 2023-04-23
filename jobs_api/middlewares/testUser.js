const { UnauthenrizationError } = require("../errors");
const testUser = (req, res, next) => {
  if (req.userInfo.testUser) {
    throw new UnauthenrizationError("Test user , only read");
  }
  next();
};
module.exports = testUser;
