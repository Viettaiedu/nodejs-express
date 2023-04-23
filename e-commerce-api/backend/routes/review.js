const router = require("express").Router();
const {
  getAllReviews,
  getSingleReview,
  createReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
} = require("../controllers/review");
const { authenticateUser } = require("../middleware/authentication");
router
  .route("/")
  .get(authenticateUser, getAllReviews)
  .post(authenticateUser, createReview);
router.route("/single-product").get(authenticateUser, getSingleProductReviews);
router
  .route("/:id")
  .get(getSingleReview)
  .patch(authenticateUser, updateReview)
  .delete(authenticateUser, deleteReview);

module.exports = router;
