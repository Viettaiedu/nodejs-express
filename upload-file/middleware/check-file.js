const { BadRequest } = require("../errors");
const checkSingleFile = (req, res, next) => {
  if (!req.file) {
    throw new BadRequest("Please provide a file");
  }
  if (!req.file.mimetype.startsWith("image")) {
    throw new BadRequest("Please provide file image");
  }
  next();
};

const checkMultipleFile = (req, res, next) => {
  if (!req.files) {
    throw new BadRequest("Please provide a file");
  }
  next();
};

module.exports = {
  checkSingleFile,
  checkMultipleFile,
};
