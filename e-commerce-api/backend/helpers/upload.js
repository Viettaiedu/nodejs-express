const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    const prefix = Date.now() + "--" + Math.round(Math.random() * 1000000);
    cb(null, prefix + "--" + file.originalname);
  },
});
const upload = multer({ storage }).single("file");
module.exports = upload;
