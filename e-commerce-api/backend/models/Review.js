const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: [true, "Please provide title for this"],
      maxLength: 200,
    },
    comment: {
      type: String,
    },
    createdByUserId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user for this"],
    },
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: [true, "Please provide id product"],
    },
  },
  {
    timestamps: true,
  }
);
ReviewSchema.index({ productId: 1, createdByUserId: -1 }, { unique: true });
ReviewSchema.statics.calculateAverageRating = async function (productId) {
  const results = await this.aggregate([
    { $match: { productId: productId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    await this.model("Product").findByIdAndUpdate(
      { _id: productId },
      {
        averageRating: results[0]?.averageRating || 0,
        numOfReviews: results[0]?.numOfReviews || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

ReviewSchema.post("save", async function () {
  await this.constructor.calculateAverageRating(this.productId);
});
ReviewSchema.post("remove", async function () {
  await this.constructor.calculateAverageRating(this.productId);
});

module.exports = mongoose.model("Review", ReviewSchema);
