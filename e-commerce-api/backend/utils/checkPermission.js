const { UnauthenticatedError } = require("../errors");

const checkPermission = ({ userInfo, userId }) => {
  if (userInfo.role === "admin") return;
  if (userInfo.userId === userId.toString()) return;
  throw new UnauthenticatedError("Invalid permission");
};

module.exports = { checkPermission };
