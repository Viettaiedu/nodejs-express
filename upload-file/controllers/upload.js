const { StatusCodes } = require("http-status-codes");
const { BadRequest } = require("../errors");
const uploadSingle = (req, res) => {
  res.status(200).json({ file: req.file.filename });
};
const uploadMultiple = (req, res) => {
  if (!req.files) {
    throw new BadRequest("Please provide a file");
  }
  res.status(200).json({ files: req.files });
};

module.exports = {
  uploadSingle,
  uploadMultiple,
};
