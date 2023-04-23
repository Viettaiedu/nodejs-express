const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images");
  },
  filename: function (req, file, cb) {
    const prefix = Math.round(Math.random() * 100000) + Date.now();
    cb(null, prefix + "-" + file.originalname);
  },
});

// filter file
const fileFilter = (req, file, cb) => {
  const isMimeType =
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg";
  if (isMimeType) {
    cb(null, true);
  } else {
    cb("Please provide a file smaller than 2048", false);
  }
};
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 3,
  },
  fileFilter,
});
module.exports = upload;
