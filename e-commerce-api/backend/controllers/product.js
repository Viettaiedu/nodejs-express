const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  NotFoundError,
} = require("../errors");
const path = require("path");

const getAllProducts = async (req, res) => {
  const {
    name,
    category,
    numericFilters,
    company,
    featured,
    freeShipping,
    createdByUser,
    sort,
  } = req.query;
  const queryObject = {};
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }
  if (category) {
    queryObject.category = category;
  }
  if (company) {
    queryObject.company = company;
  }
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (freeShipping) {
    queryObject.freeShipping = freeShipping === "true" ? true : false;
  }
  if (createdByUser) {
    queryObject.createdByUser = createdByUser;
  }
  if (numericFilters) {
    const operators = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regex = /\b(>|>=|=|<|<=)\b/g;
    const listFilters = numericFilters.replace(
      regex,
      (match) => `-${operators[match]}-`
    );
    listFilters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      queryObject[field] = { [operator]: Number(value) };
    });
  }
  let results = Product.find(queryObject);
  if (sort) {
    const sortList = sort.split(",").join(" ");
    results = results.sort(sortList);
  } else {
    results = results.sort("-createdAt");
  }
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 2;
  const skip = (page - 1) * limit;
  results = results.skip(skip).limit(limit);
  const totalsProducts = await Product.countDocuments();
  const products = await results;
  res.status(StatusCodes.OK).json({
    currentPage: page,
    totalPages: Math.ceil(totalsProducts / limit),
    products,
    nbHits: products.length,
    totalProducts: totalsProducts,
  });
};
const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new NotFoundError(`No item with id ${productId} not found`);
  }
  res.status(StatusCodes.OK).json({ product });
};
const createProduct = async (req, res) => {
  const { name, price, category, company } = req.body;
  if (!name || !price || !category || !company) {
    throw new BadRequestError("Please provide all values");
  }
  req.body.createdByUser = req.userInfo.userId;
  const product = await Product.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ product });
};
const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findByIdAndUpdate(
    { _id: productId },
    { ...req.body },
    { new: true, runValidators: true }
  );

  if (!product) throw new NotFoundError(`No item with id ${productId} `);
  res.status(StatusCodes.OK).json({ product });
};
const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndDelete({ _id: productId });
  if (!product) throw new NotFoundError(`No item with id ${productId} `);
  res
    .status(StatusCodes.OK)
    .json({ message: `Delete product with id ${productId} successfully` });
};

const uploadImage = async (req, res) => {
  const { id: productId } = req.params;
  if (!req.file) throw new BadRequestError("Please provide a file");
  const product = await Product.findOne({ _id: productId });
  if (!product) throw new NotFoundError(`No item with id ${productId}`);
  product.image = path.join(
    __dirname,
    "../public/uploads/" + req.file.filename
  );
  await product.save();
  res
    .status(StatusCodes.OK)
    .json({ product, message: "Update product successfully" });
};
module.exports = {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};


