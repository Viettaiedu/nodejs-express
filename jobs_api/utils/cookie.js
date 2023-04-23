const attachCookie = ({ res, token }) => {
  const fourHours = 60 * 1000 * 60 * 4;
  res.cookie("accessToken", token, {
    httpOnly: true,
    expires: new Date(Date.now() + fourHours),
  });
};

const removeCookie = ({ res }) => {
  res.clearCookie("accessToken");
};

module.exports = {
  attachCookie,
  removeCookie,
};
