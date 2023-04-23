const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name must be provided"],
      minLength: 3,
      maxLength: 20,
    },
    price: {
      type: Number,
      required: [true, "Price must be provided"],
      default: 10,
    },
    description: {
      type: String,
      default: "no description",
    },
    image: { type: String, default: "/product-no-image.png" },
    category: {
      type: String,
      required: [true, "Please provide product category"],
      enum: ["office", "kitchen", "bedroom"],
    },
    company: {
      type: String,
      required: [true, "Company must be provided"],
      enum: {
        values: ["ikea", "liddy", "marcos"],
        message: "{VALUE} is not supported",
      },
    },
    colors: { type: Array, default: "#fff" },
    featured: { type: Boolean, default: false },
    freeShipping: { type: Boolean, default: false },
    inventory: { type: Number, default: 15 },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    createdByUser: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", ProductSchema);
