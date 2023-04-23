const Review = require("../models/Review");
const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");
const { checkPermission } = require("../utils/checkPermission");
const getAllReviews = async (req, res) => {
  const reviews = await Review.find();
  res.status(StatusCodes.OK).json({ reviews, nbHits: reviews.length });
};
const getSingleReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });
  if (!review) throw new NotFoundError(`No item with id ${reviewId}`);
  res.status(StatusCodes.OK).json({ review });
};
const createReview = async (req, res) => {
  const { productId } = req.body;
  const isProductExisting = await Product.findOne({ _id: productId });
  if (!isProductExisting)
    throw new NotFoundError(`No item with id ${productId}`);
  req.body.createdByUserId = req.userInfo.userId;
  const review = await Review.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ review });
};
const updateReview = async (req, res) => {
  const {
    params: { id: rewiewId },
    body: { title },
  } = req;
  if (!title) {
    throw new BadRequestError("Please provide title for this review");
  }
  const isReview = await Review.findOne({ _id: rewiewId });
  if (!isReview) throw new NotFoundError(`No review with id ${rewiewId}`);
  checkPermission({ userInfo: req.userInfo, userId: isReview.createdByUserId });
  const review = await Review.findByIdAndUpdate(
    { _id: rewiewId, createdByUserId: req.userInfo.userId },
    { ...req.body },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(StatusCodes.OK).json({ review });
};
const deleteReview = async (req, res) => {
  const {
    params: { id: rewiewId },
    userInfo: { userId },
  } = req;
  const isReview = await Review.findOne({ _id: rewiewId });
  if (!isReview) throw new NotFoundError(`No review with id ${rewiewId}`);
  checkPermission({ userInfo: req.userInfo, userId: isReview.createdByUserId });
  await Review.deleteOne({ _id: rewiewId, createdByUserId: userId });
  res
    .status(StatusCodes.OK)
    .json({ message: `Delete review with id ${rewiewId} successfully` });
};

const getSingleProductReviews = async (req, res) => {
  const { userId } = req.userInfo;
  const reviews = await Review.find({ createdByUserId: userId });
  res.status(StatusCodes.OK).json({ reviews, nbHits: reviews.length });
};

// entire user [testing]
module.exports = {
  getAllReviews,
  getSingleReview,
  createReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
