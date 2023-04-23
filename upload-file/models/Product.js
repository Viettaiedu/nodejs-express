const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "name must be provided"],
  },
  image: {
    type: String,
    maxLength: 300,
    default: "no-image",
  },
});

module.exports = mongoose.model("Product", ProductSchema);
