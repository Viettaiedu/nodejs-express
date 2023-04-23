const { uploadSingle, uploadMultiple } = require("../controllers/upload");
const {
  checkSingleFile,
  checkMultipleFile,
} = require("../middleware/check-file");

const uploadHelpers = require("../helpers/upload");
const router = require("express").Router();
// const {upload} = require('../controllers/upload');

router
  .route("/single")
  .post(uploadHelpers.single("file"), checkSingleFile, uploadSingle);
router
  .route("/multiple")
  .post(uploadHelpers.array("multiple"), checkMultipleFile, uploadMultiple);

module.exports = router;
